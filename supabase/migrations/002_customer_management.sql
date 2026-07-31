-- Fasa 3: Customer Management
-- Setiap customer dipautkan kepada user_id (business owner) yang create dia.

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  phone text,
  email text,
  address text,
  company text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customers_user_id on customers(user_id);

-- Reuse trigger function set_updated_at() dari migration 001.
-- create or replace di sini supaya migration ni tetap boleh run standalone.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_customers_updated_at on customers;
create trigger trg_customers_updated_at
  before update on customers
  for each row execute function set_updated_at();

-- Row Level Security: setiap user cuma boleh access customer dia sendiri
alter table customers enable row level security;

drop policy if exists "select_own_customers" on customers;
create policy "select_own_customers"
  on customers for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_customers" on customers;
create policy "insert_own_customers"
  on customers for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_customers" on customers;
create policy "update_own_customers"
  on customers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete_own_customers" on customers;
create policy "delete_own_customers"
  on customers for delete
  using (auth.uid() = user_id);