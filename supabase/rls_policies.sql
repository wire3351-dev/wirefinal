-- Enable RLS and enforce per-user access using auth.uid()

-- ORDERS
alter table if exists public.orders enable row level security;

create policy if not exists orders_select_own
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists orders_insert_own
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists orders_update_own
  on public.orders for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- INQUIRIES
alter table if exists public.inquiries enable row level security;

create policy if not exists inquiries_select_own
  on public.inquiries for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists inquiries_insert_own
  on public.inquiries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists inquiries_update_own
  on public.inquiries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- USERS (public table tracking contact details)
alter table if exists public.users enable row level security;

create policy if not exists users_select_self
  on public.users for select
  to authenticated
  using (auth.uid() = id);

create policy if not exists users_upsert_self
  on public.users for insert
  to authenticated
  with check (auth.uid() = id);

create policy if not exists users_update_self
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- USER PROFILES
alter table if exists public.user_profiles enable row level security;

create policy if not exists user_profiles_select_own
  on public.user_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists user_profiles_upsert_own
  on public.user_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists user_profiles_update_own
  on public.user_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
