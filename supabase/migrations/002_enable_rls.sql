-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS Policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Orders RLS Policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Inquiries RLS Policies
-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own inquiries" ON inquiries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own inquiries" ON inquiries
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Owner Dashboard Access (for owner@cablehq.com)
-- Create a policy that allows viewing all records (owner can use a service role key)
-- For now, we'll use RLS bypass with service role in the backend
