import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export { isSupabaseConfigured };

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

// ============ USER PROFILE FUNCTIONS ============

export const saveUserProfile = async (userId: string, profileData: UserProfileData) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, skipping database save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: userId,
          full_name: profileData.fullName,
          email: profileData.email,
          phone_number: profileData.phoneNumber,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
          company_name: profileData.companyName,
          business_type: profileData.businessType,
          gst_number: profileData.gstNumber,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
};

// ============ ORDER FUNCTIONS ============

export const saveOrder = async (orderData: OrderData) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, skipping order save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        order_number: orderData.orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        customer_city: orderData.customerCity,
        customer_state: orderData.customerState,
        customer_pincode: orderData.customerPincode,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shippingCost || 0,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus || 'pending',
        qr_code_data: orderData.qrCodeData,
        transaction_id: orderData.transactionId,
        estimated_delivery: orderData.estimatedDelivery,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving order:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string, userId?: string) => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    let query = supabase.from('orders').update(updateData).eq('id', orderId);
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select().single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

// ============ INQUIRY FUNCTIONS ============

export const saveInquiry = async (inquiryData: InquiryData) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, skipping inquiry save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        user_id: inquiryData.userId,
        user_type: inquiryData.userType,
        location: inquiryData.location,
        product_name: inquiryData.productName,
        product_specification: inquiryData.productSpecification,
        quantity: inquiryData.quantity,
        contact_name: inquiryData.contactName,
        contact_email: inquiryData.contactEmail,
        contact_phone: inquiryData.contactPhone,
        additional_requirements: inquiryData.additionalRequirements,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving inquiry:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save inquiry:', error);
    throw error;
  }
};

export const getUserInquiries = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get user inquiries:', error);
    return [];
  }
};

export const updateInquiryStatus = async (inquiryId: string, status: string) => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquiryId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    throw error;
  }
};

// ============ OWNER DASHBOARD FUNCTIONS (Admin View) ============

export const getAllOrders = async () => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    // This uses the regular authenticated client
    // For owner dashboard, you'll need to use a service role or adjust RLS policies
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get all orders:', error);
    return [];
  }
};

export const getAllInquiries = async () => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all inquiries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get all inquiries:', error);
    return [];
  }
};

export const getOrderStats = async () => {
  if (!isSupabaseConfigured) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
    };
  }

  try {
    const { data: orders } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (!orders) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
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
