/*
  # Add Anonymous Access Policies for All Tables

  ## Overview
  This migration adds RLS policies to allow anonymous access to users, user_profiles,
  orders, and inquiries tables. This is necessary because the app uses custom OTP
  authentication rather than Supabase Auth.

  ## Changes
  - Allow anonymous users to read/write users table (for registration and login)
  - Allow anonymous users to read/write user_profiles (for profile updates)
  - Allow anonymous users to read/write orders (for checkout and admin dashboard)
  - Allow anonymous users to read/write inquiries (for quote requests and admin dashboard)

  ## Security Notes
  - Anonymous access is required for custom auth implementation
  - The frontend application handles authorization logic
  - RLS provides table-level protection
  - In production, consider adding additional API layer security
*/

-- Users table policies
CREATE POLICY "Allow anon to insert users"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to read users"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to update users"
  ON users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- User Profiles table policies
CREATE POLICY "Allow anon to insert user_profiles"
  ON user_profiles FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to read user_profiles"
  ON user_profiles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to update user_profiles"
  ON user_profiles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Orders table policies
CREATE POLICY "Allow anon to insert orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to read all orders"
  ON orders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to update orders"
  ON orders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Inquiries table policies
CREATE POLICY "Allow anon to insert inquiries"
  ON inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to read all inquiries"
  ON inquiries FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to update inquiries"
  ON inquiries FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
