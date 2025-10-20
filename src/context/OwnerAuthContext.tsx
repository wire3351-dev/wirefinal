import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const OWNER_AUTH_STORAGE_KEY = "owner-dashboard-authenticated";
const OWNER_EMAIL = "owner@cablehq.com";
const OWNER_PASSWORD = "SecurePass123!";

interface OwnerAuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const OwnerAuthContext = createContext<OwnerAuthContextValue | undefined>(undefined);

export const OwnerAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(OWNER_AUTH_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === OWNER_AUTH_STORAGE_KEY) {
        setIsAuthenticated(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const success = normalizedEmail === OWNER_EMAIL && normalizedPassword === OWNER_PASSWORD;

    if (success) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(OWNER_AUTH_STORAGE_KEY, "true");
      }

      // Also ensure we have a Firebase auth session so Firestore rules that require auth pass.
      try {
        signInAnonymously(auth).catch((e) => console.warn('Firebase anonymous sign-in failed for owner:', e));
      } catch (e) {
        console.warn('Firebase anonymous sign-in invocation failed:', e);
      }
    }

    return success;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(OWNER_AUTH_STORAGE_KEY);
    }
    try {
      auth.signOut().catch(() => {});
    } catch (e) {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout],
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
};

export const useOwnerAuth = () => {
  const context = useContext(OwnerAuthContext);

  if (!context) {
    throw new Error("useOwnerAuth must be used within an OwnerAuthProvider");
  }

  return context;
};
