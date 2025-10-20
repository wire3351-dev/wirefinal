/*
  # Complete Schema: Users, Profiles, Orders, and Inquiries with Anonymous Access

  ## Overview
  Consolidated migration creating all tables and RLS policies for the WireBazaar application.
  Uses anonymous access policies to support custom OTP-based authentication.

  ## Tables
  1. users - User accounts
  2. user_profiles - Extended user information
  3. orders - Customer orders
  4. inquiries - Quote requests

  ## Security
  - RLS enabled on all tables with anonymous access
  - Frontend application handles authorization
  - Includes automatic timestamp management
*/

-- ============ CREATE TABLES ============

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact text UNIQUE NOT NULL,
  last_login_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  company_name VARCHAR(255),
  business_type VARCHAR(100),
  gst_number VARCHAR(20),
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address VARCHAR(500) NOT NULL,
  customer_city VARCHAR(100),
  customer_state VARCHAR(100),
  customer_pincode VARCHAR(10) NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  qr_code_data TEXT,
  transaction_id VARCHAR(255),
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_type VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  product_name VARCHAR(255),
  product_specification VARCHAR(500),
  quantity VARCHAR(100),
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  additional_requirements TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_inquiry_status CHECK (status IN ('pending', 'contacted', 'quote_sent', 'completed', 'cancelled'))
);

-- ============ CREATE INDEXES ============

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_contact ON users(contact);

-- ============ ENABLE RLS ============

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ============ CREATE HELPER FUNCTION ============

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============ CREATE TRIGGERS ============

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============ ANONYMOUS ACCESS POLICIES ============

-- Users table
CREATE POLICY "Allow anon to insert users" ON users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon to read users" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to update users" ON users FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- User Profiles table
CREATE POLICY "Allow anon to insert user_profiles" ON user_profiles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon to read user_profiles" ON user_profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to update user_profiles" ON user_profiles FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Orders table
CREATE POLICY "Allow anon to insert orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon to read all orders" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to update orders" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Inquiries table
CREATE POLICY "Allow anon to insert inquiries" ON inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon to read all inquiries" ON inquiries FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to update inquiries" ON inquiries FOR UPDATE TO anon USING (true) WITH CHECK (true);
