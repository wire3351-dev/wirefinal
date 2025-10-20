import type { InquiryData } from "@/pages/Inquiry";
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, orderBy as firestoreOrderBy, serverTimestamp } from 'firebase/firestore';

export interface StoredInquiry extends InquiryData {
  id: string;
  createdAt: string;
}

export const INQUIRY_STORAGE_KEY = "owner-dashboard-inquiries";

type ParsedValue = unknown;

const isStoredInquiryArray = (value: ParsedValue): value is StoredInquiry[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) =>
    item &&
    typeof item === "object" &&
    "id" in item &&
    "createdAt" in item &&
    "userType" in item &&
    "phone" in item &&
    "email" in item &&
    "address" in item &&
    "pincode" in item &&
    "brand" in item &&
    "color" in item &&
    "quantity" in item &&
    "unit" in item,
  );
};

const readStorage = (): StoredInquiry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ParsedValue;

    if (!isStoredInquiryArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read inquiries from storage", error);
    return [];
  }
};

const writeStorage = (value: StoredInquiry[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write inquiries to storage", error);
  }
};

export const getStoredInquiries = async (): Promise<StoredInquiry[]> => {
  try {
    const inquiriesRef = collection(db, 'inquiries');
    const q = query(inquiriesRef, firestoreOrderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const inquiries: StoredInquiry[] = [];
    querySnapshot.forEach((doc) => {
      inquiries.push({ id: doc.id, ...doc.data() } as StoredInquiry);
    });

    return inquiries;
  } catch (error) {
    console.error('Error fetching inquiries from Firebase:', error);
    return readStorage();
  }
};

export const addInquiryToStorage = async (data: InquiryData): Promise<StoredInquiry> => {
  const newInquiry: StoredInquiry = {
    ...data,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const inquiryRef = doc(db, 'inquiries', newInquiry.id);
    await setDoc(inquiryRef, {
      ...data,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
  } catch (error) {
    console.error('Error saving inquiry to Firebase:', error);
  }

  const inquiries = [...readStorage(), newInquiry];
  writeStorage(inquiries);
  return newInquiry;
};

export const clearStoredInquiries = () => {
  writeStorage([]);
};

export const removeInquiryFromStorage = (id: string) => {
  const next = readStorage().filter((inquiry) => inquiry.id !== id);
  writeStorage(next);
};
