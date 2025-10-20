# Supabase Database Setup Guide

This document explains how to set up your Supabase database for WireBazaar.

## Project ID
Your Supabase Project ID: `duhsvsskqceltccieysz`

## Setup Steps

### 1. Create Tables in Supabase

Run the following SQL migrations in your Supabase SQL Editor:

#### Migration 1: Create Tables
Navigate to: SQL Editor → New Query, and paste the content from `supabase/migrations/001_create_tables.sql`

#### Migration 2: Enable RLS
Navigate to: SQL Editor → New Query, and paste the content from `supabase/migrations/002_enable_rls.sql`

### 2. Get Your Supabase Credentials

1. Go to your Supabase Project Dashboard
2. Click on **Settings** → **API**
3. Copy:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)

### 3. Configure Environment Variables

In the **DevServerControl** settings or your `.env` file, set:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Or use the DevServerControl tool with `set_env_variable` to configure these securely.

## Database Schema

### Tables Created

#### 1. **user_profiles**
Stores extended user information:
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to users table)
- `full_name` - Name of the user
- `email` - Email address
- `phone_number` - Contact number
- `address` - Residential address
- `city`, `state`, `pincode` - Location details
- `company_name` - Business name
- `business_type` - Type of business
- `gst_number` - GST identification
- `profile_completed` - Boolean flag
- `created_at`, `updated_at` - Timestamps

#### 2. **orders**
Stores all customer orders:
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key)
- `order_number` - Unique order identifier
- `customer_*` - Customer details (name, email, phone, address)
- `items` - JSONB array of ordered products
- `subtotal`, `shipping_cost`, `total_amount` - Pricing
- `status` - Order status (pending, confirmed, processing, shipped, delivered, cancelled)
- `payment_status` - Payment status (pending, completed, failed, refunded)
- `payment_method` - Payment method used
- `qr_code_data` - UPI QR code string
- `transaction_id` - Payment transaction ID
- `estimated_delivery` - Expected delivery date
- `created_at`, `updated_at` - Timestamps

#### 3. **inquiries**
Stores customer quote inquiries:
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key)
- `user_type` - Customer type (consumer, electrician, shopkeeper, etc.)
- `location` - Customer location
- `product_name` - Product being inquired about
- `product_specification` - Product specifications
- `quantity` - Quantity needed
- `contact_*` - Contact details (name, email, phone)
- `additional_requirements` - Extra notes
- `status` - Inquiry status (pending, contacted, quote_sent, completed, cancelled)
- `created_at`, `updated_at` - Timestamps

## Row Level Security (RLS)

RLS policies are enabled on all tables to ensure:
- Users can only view/update their own data
- Owner access requires service role key for admin operations

## Backend Functions

All database operations are in `src/lib/db-services.ts`:

### User Profile Functions
- `saveUserProfile()` - Save/update user profile
- `getUserProfile()` - Fetch user profile

### Order Functions
- `saveOrder()` - Save new order
- `getUserOrders()` - Fetch user's orders
- `updateOrderStatus()` - Update order status
- `getAllOrders()` - Admin: Fetch all orders

### Inquiry Functions
- `saveInquiry()` - Save new inquiry
- `getUserInquiries()` - Fetch user's inquiries
- `updateInquiryStatus()` - Update inquiry status
- `getAllInquiries()` - Admin: Fetch all inquiries

## Integration Points

### Pages Updated
1. **Checkout** - Orders saved to Supabase
2. **Inquiry** - Inquiries saved to Supabase
3. **Orders** - Fetches from Supabase first, falls back to localStorage
4. **OwnerDashboard** - Displays Supabase data

### Data Flow
```
User Action → Save to localStorage → Also save to Supabase (if configured)
                                    ↓
                            Owner Dashboard ← Fetch from Supabase
```

## Testing

1. Make sure environment variables are set correctly
2. Sign in a user and place an order
3. Navigate to Owner Dashboard to see orders and inquiries
4. Check that data appears in Supabase Console

## Troubleshooting

**Data not saving to Supabase?**
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Ensure RLS policies are enabled
- Check browser console for error messages

**Can't see data in Owner Dashboard?**
- Refresh the page
- Verify that `isSupabaseConfigured` is true
- Check Supabase RLS policies allow admin read access

**Orders appear in localStorage but not Supabase?**
- Supabase save errors are logged to console
- Check RLS policies on orders table
- Verify user is authenticated properly
