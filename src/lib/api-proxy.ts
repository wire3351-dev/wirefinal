import { db } from '@/lib/firebase';
import { collection, query, where, orderBy as firestoreOrderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { getUserOrders as getUserOrdersFromFirebase } from './firebase-services';
import type { Order } from './order-storage';

export const fetchOrdersApi = async (userId: string | null) => {
  // Try calling /api/orders?userId= first, fallback to Firebase
  if (!userId) return [] as Order[];

  try {
    const resp = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
  } catch (e) {
    // ignore and fallback
  }

  // Fallback: use Firebase function
  try {
    const orders = await getUserOrdersFromFirebase(userId as string);
    return orders as Order[];
  } catch (e) {
    console.error('API proxy: failed to fetch orders from Firebase', e);
    return [] as Order[];
  }
};

export const fetchEnquiriesApi = async (userId: string | null) => {
  if (!userId) return [];

  try {
    const resp = await fetch(`/api/enquiries?userId=${encodeURIComponent(userId)}`);
    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
  } catch (e) {
    // ignore
  }

  // Fallback: query Firestore directly
  try {
    const enquiriesRef = collection(db, 'inquiries');
    const q = query(enquiriesRef, where('userId', '==', userId), firestoreOrderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items: any[] = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (e) {
    console.error('API proxy: failed to fetch enquiries from Firebase', e);
    return [];
  }
};

// Real-time subscription helpers
export const subscribeToUserOrders = (userId: string, cb: (orders: Order[]) => void) => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), firestoreOrderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const next: Order[] = [] as any;
    snapshot.forEach((doc) => {
      next.push({ id: doc.id, ...doc.data() } as Order);
    });
    cb(next);
  }, (error) => {
    console.error('subscribeToUserOrders error', error);
  });
  return unsubscribe;
};

export const subscribeToUserEnquiries = (userId: string, cb: (items: any[]) => void) => {
  const enquiriesRef = collection(db, 'inquiries');
  const q = query(enquiriesRef, where('userId', '==', userId), firestoreOrderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const next: any[] = [];
    snapshot.forEach((doc) => next.push({ id: doc.id, ...doc.data() }));
    cb(next);
  }, (error) => {
    console.error('subscribeToUserEnquiries error', error);
  });
  return unsubscribe;
};
