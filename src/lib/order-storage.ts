import { CartItem } from './cart-storage';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy as firestoreOrderBy, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'qr_code';
  qrCodeData?: string;
  transactionId?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

const ORDER_STORAGE_KEY = 'wire_cable_orders';

export const getOrders = async (userId?: string): Promise<Order[]> => {
  if (!userId) {
    return [];
  }

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      firestoreOrderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        orderNumber: data.orderNumber,
        userId: data.userId,
        customerInfo: data.customerInfo,
        items: data.items,
        subtotal: Number(data.subtotal),
        shippingCost: Number(data.shippingCost),
        totalAmount: Number(data.totalAmount),
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        qrCodeData: data.qrCodeData,
        transactionId: data.transactionId,
        createdAt: data.createdAt,
        estimatedDelivery: data.estimatedDelivery,
      });
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const saveOrder = async (order: Order): Promise<void> => {
  if (!order.userId) {
    throw new Error('User ID is required to save order');
  }

  // Recursively remove undefined fields to avoid Firestore errors
  const clean = (value: any): any => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (Array.isArray(value)) {
      return value.map((v) => clean(v)).filter((v) => v !== undefined);
    }
    if (typeof value === 'object') {
      const out: any = {};
      for (const k of Object.keys(value)) {
        const v = clean(value[k]);
        if (v !== undefined) out[k] = v;
      }
      return out;
    }
    return value;
  };

  try {
    const orderRef = doc(db, 'orders', order.id);

    const payload: any = {
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerInfo: order.customerInfo,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      qrCodeData: order.qrCodeData,
      transactionId: order.transactionId,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: serverTimestamp()
    };

    const cleanedPayload = clean(payload);

    await setDoc(orderRef, cleanedPayload);
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order');
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus'], userId?: string): Promise<void> => {
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
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

export const getOrderById = async (orderId: string, userId?: string): Promise<Order | undefined> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return undefined;
    }

    const data = orderSnap.data();
    if (userId && data.userId !== userId) {
      return undefined;
    }

    return {
      id: orderSnap.id,
      orderNumber: data.orderNumber,
      userId: data.userId,
      customerInfo: data.customerInfo,
      items: data.items,
      subtotal: Number(data.subtotal),
      shippingCost: Number(data.shippingCost),
      totalAmount: Number(data.totalAmount),
      status: data.status,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      qrCodeData: data.qrCodeData,
      transactionId: data.transactionId,
      createdAt: data.createdAt,
      estimatedDelivery: data.estimatedDelivery,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return undefined;
  }
};

export const generateOrderNumber = (): string => {
  const prefix = 'WB';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const calculateEstimatedDelivery = (pincode: string): string => {
  const days = pincode.startsWith('4') ? 3 : 5;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toISOString();
};

export const calculateShippingCost = (pincode: string, subtotal: number): number => {
  if (subtotal >= 5000) return 0;
  const baseRate = pincode.startsWith('4') ? 50 : 100;
  return baseRate;
};

export const getAllOrdersForAdmin = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, firestoreOrderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        orderNumber: data.orderNumber,
        userId: data.userId,
        customerInfo: data.customerInfo,
        items: data.items,
        subtotal: Number(data.subtotal),
        shippingCost: Number(data.shippingCost),
        totalAmount: Number(data.totalAmount),
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        qrCodeData: data.qrCodeData,
        transactionId: data.transactionId,
        createdAt: data.createdAt,
        estimatedDelivery: data.estimatedDelivery,
      });
    });

    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};
