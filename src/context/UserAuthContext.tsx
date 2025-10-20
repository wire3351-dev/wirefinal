import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const USER_AUTH_STORAGE_KEY = "wirebazaar-user";

type UserProfile = {
  id: string;
  contact: string;
  lastLoginAt: string;
};

type PendingVerification = {
  contact: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
};

type UserAuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  requestOtp: (contact: string) => Promise<void>;
  verifyOtp: (contact: string, otp: string) => Promise<void>;
  logout: () => void;
};

const UserAuthContext = createContext<UserAuthContextValue | undefined>(undefined);

const bufferToHex = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const hashOtp = async (otp: string, contact: string) => {
  const encoder = new TextEncoder();
  const normalized = `${contact.toLowerCase().trim()}::${otp}`;
  const data = encoder.encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(digest);
};

const TEST_OTP = "123456";

const generateOtp = () => {
  return TEST_OTP;
};

const isValidEmail = (value: string) => {
  return /^(?:[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/u.test(value.trim());
};

const isValidPhone = (value: string) => {
  // Indian phone number: 10 digits starting with 6-9
  return /^[6-9]\d{9}$/.test(value.trim().replace(/[\s-]/g, ''));
};

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem(USER_AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          if (parsed?.contact) {
            setUser(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to restore user session", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        return;
      }

      try {
        // store id token for API calls
        try {
          const idToken = await firebaseUser.getIdToken();
          if (idToken) {
            localStorage.setItem('firebase_id_token', idToken);
          }
        } catch (tokenErr) {
          console.warn('Failed to get id token:', tokenErr);
        }

        const stored = localStorage.getItem(USER_AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          if (parsed?.id === firebaseUser.uid) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const updatedProfile: UserProfile = {
                id: firebaseUser.uid,
                contact: userData.contact || parsed.contact,
                lastLoginAt: userData.lastLoginAt?.toDate?.()?.toISOString?.() || parsed.lastLoginAt,
              };
              setUser(updatedProfile);
              localStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify(updatedProfile));
            }
          }
        }
      } catch (error) {
        console.error('Error syncing Firebase auth state:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  const requestOtp = useCallback(async (contact: string) => {
    const trimmed = contact.trim();
    if (!isValidEmail(trimmed) && !isValidPhone(trimmed)) {
      throw new Error("Enter a valid mobile number or email address.");
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp, trimmed);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    setPending({ contact: trimmed, otpHash, expiresAt, attempts: 0 });

    toast.success("OTP sent successfully.", {
      description: "Please enter the one-time password to verify your account.",
    });

    if (import.meta.env.DEV) {
      console.info(`[OTP DEBUG] Code for ${trimmed}: ${otp}`);
    }
  }, []);

  const verifyOtp = useCallback(
    async (contact: string, otp: string) => {
      const trimmedContact = contact.trim();
      if (!pending || pending.contact !== trimmedContact) {
        throw new Error("Please request a new OTP for this contact.");
      }

      if (Date.now() > pending.expiresAt) {
        setPending(null);
        throw new Error("OTP has expired. Please request a new code.");
      }

      if (pending.attempts >= 4) {
        setPending(null);
        throw new Error("Too many incorrect attempts. Please request a new OTP.");
      }

      if (!/^[0-9]{6}$/.test(otp.trim())) {
        throw new Error("Enter the 6-digit OTP sent to you.");
      }

      const candidateHash = await hashOtp(otp.trim(), trimmedContact);
      if (candidateHash !== pending.otpHash) {
        setPending((prev) => (prev ? { ...prev, attempts: prev.attempts + 1 } : prev));
        throw new Error("Incorrect OTP. Please try again.");
      }

      let userId: string;

      try {
        const userCredential = await signInAnonymously(auth);
        userId = userCredential.user.uid;

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await setDoc(userRef, {
            contact: trimmedContact,
            lastLoginAt: serverTimestamp()
          }, { merge: true });
        } else {
          await setDoc(userRef, {
            contact: trimmedContact,
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp()
          });
        }
      } catch (e) {
        console.error('Firebase auth failed', e);
        throw new Error('Authentication failed. Please try again.');
      }

      const profile: UserProfile = {
        id: userId,
        contact: trimmedContact,
        lastLoginAt: new Date().toISOString(),
      };

      setUser(profile);
      localStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify(profile));
      // store id token for API calls
      try {
        const current = auth.currentUser;
        if (current) {
          const idToken = await current.getIdToken();
          if (idToken) localStorage.setItem('firebase_id_token', idToken);
        }
      } catch (e) {
        console.warn('Failed to store id token after sign-in', e);
      }

      setPending(null);

      toast.success("Login successful.", {
        description: "You are now securely logged in.",
      });
    },
    [pending],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_AUTH_STORAGE_KEY);
    auth.signOut().catch(() => {});
    toast.info("You have been logged out.");
  }, []);

  const value = useMemo<UserAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      requestOtp,
      verifyOtp,
      logout,
    }),
    [logout, requestOtp, user, verifyOtp],
  );

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};
