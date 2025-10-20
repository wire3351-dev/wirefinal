import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'sonner';

export interface UserProfileData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  companyName?: string;
  businessType?: string;
  gstNumber?: string;
}

export interface OrderData {
  userId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerState?: string;
  customerPincode: string;
  items: any[];
  subtotal: number;
  shippingCost?: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  qrCodeData?: string;
  transactionId?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface InquiryData {
  userId: string;
  userType: string;
  location: string;
  productName?: string;
  productSpecification?: string;
  quantity?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalRequirements?: string;
}

export const saveUserProfile = async (userId: string, profileData: UserProfileData) => {
  try {
    const profileRef = doc(db, 'user_profiles', userId);
    await setDoc(profileRef, {
      ...profileData,
      profileCompleted: true,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const profileRef = doc(db, 'user_profiles', userId);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return profileSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
};

export const saveOrder = async (orderData: OrderData) => {
  try {
    const orderId = `order_${Date.now()}`;
    const orderRef = doc(db, 'orders', orderId);

    await setDoc(orderRef, {
      ...orderData,
      status: 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      shippingCost: orderData.shippingCost || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: orderId, ...orderData };
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return orders;
  } catch (error) {
    console.error('Failed to get user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string, userId?: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    await updateDoc(orderRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

export const saveInquiry = async (inquiryData: InquiryData) => {
  try {
    const inquiryId = `inquiry_${Date.now()}`;
    const inquiryRef = doc(db, 'inquiries', inquiryId);

    await setDoc(inquiryRef, {
      ...inquiryData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: inquiryId, ...inquiryData };
  } catch (error) {
    console.error('Error saving inquiry:', error);
    throw error;
  }
};

export const getUserInquiries = async (userId: string) => {
  try {
    const inquiriesRef = collection(db, 'inquiries');
    const q = query(
      inquiriesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const inquiries: any[] = [];

    querySnapshot.forEach((doc) => {
      inquiries.push({ id: doc.id, ...doc.data() });
    });

    return inquiries;
  } catch (error) {
    console.error('Failed to get user inquiries:', error);
    return [];
  }
};

export const updateInquiryStatus = async (inquiryId: string, status: string) => {
  try {
    const inquiryRef = doc(db, 'inquiries', inquiryId);
    await updateDoc(inquiryRef, {
      status,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const orders: any[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return orders;
  } catch (error) {
    console.error('Failed to get all orders:', error);
    return [];
  }
};

export const getAllInquiries = async () => {
  try {
    const inquiriesRef = collection(db, 'inquiries');
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const inquiries: any[] = [];

    querySnapshot.forEach((doc) => {
      inquiries.push({ id: doc.id, ...doc.data() });
    });

    return inquiries;
  } catch (error) {
    console.error('Failed to get all inquiries:', error);
    return [];
  }
};

export const getOrderStats = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  } catch (error) {
    console.error('Failed to get order stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
    };
  }
};

export const saveProduct = async (productData: any) => {
  try {
    const productId = productData.id || `product_${Date.now()}`;
    const productRef = doc(db, 'products', productId);

    await setDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    return { id: productId, ...productData };
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error('Failed to get all products:', error);
    return [];
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};
