import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : ({} as any);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          contact: string;
          last_login_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact: string;
          last_login_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact?: string;
          last_login_at?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          email: string | null;
          phone_number: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          company_name: string | null;
          business_type: string | null;
          gst_number: string | null;
          profile_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          company_name?: string | null;
          business_type?: string | null;
          gst_number?: string | null;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          company_name?: string | null;
          business_type?: string | null;
          gst_number?: string | null;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string;
          customer_city: string | null;
          customer_state: string | null;
          customer_pincode: string;
          items: any;
          subtotal: number;
          shipping_cost: number;
          total_amount: number;
          status: string;
          payment_status: string;
          payment_method: string | null;
          qr_code_data: string | null;
          transaction_id: string | null;
          estimated_delivery: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string;
          customer_city?: string | null;
          customer_state?: string | null;
          customer_pincode: string;
          items: any;
          subtotal: number;
          shipping_cost?: number;
          total_amount: number;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          qr_code_data?: string | null;
          transaction_id?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_address?: string;
          customer_city?: string | null;
          customer_state?: string | null;
          customer_pincode?: string;
          items?: any;
          subtotal?: number;
          shipping_cost?: number;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          qr_code_data?: string | null;
          transaction_id?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          user_id: string;
          user_type: string;
          location: string;
          product_name: string | null;
          product_specification: string | null;
          quantity: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          additional_requirements: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_type: string;
          location: string;
          product_name?: string | null;
          product_specification?: string | null;
          quantity?: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          additional_requirements?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_type?: string;
          location?: string;
          product_name?: string | null;
          product_specification?: string | null;
          quantity?: string | null;
          contact_name?: string;
          contact_email?: string;
          contact_phone?: string;
          additional_requirements?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
