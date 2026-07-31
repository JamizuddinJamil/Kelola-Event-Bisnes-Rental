-- Fasa 4: Inventory Management

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  item_name text not null,
  category text,
  photo_url text,
  quantity integer not null default 1 check (quantity >= 0),
  rental_price numeric(10, 2) check (rental_price >= 0),
  deposit numeric(10, 2) check (deposit >= 0),
  status text not null default 'tersedia'
    check (status in ('tersedia', 'disewa', 'pembaikan', 'tidak_aktif')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_items_user_id on inventory_items(user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inventory_items_updated_at on inventory_items;
create trigger trg_inventory_items_updated_at
  before update on inventory_items
  for each row execute function set_updated_at();

-- Row Level Security
alter table inventory_items enable row level security;

drop policy if exists "select_own_inventory" on inventory_items;
create policy "select_own_inventory"
  on inventory_items for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_inventory" on inventory_items;
create policy "insert_own_inventory"
  on inventory_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_inventory" on inventory_items;
create policy "update_own_inventory"
  on inventory_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete_own_inventory" on inventory_items;
create policy "delete_own_inventory"
  on inventory_items for delete
  using (auth.uid() = user_id);

-- Storage bucket untuk gambar inventory (sama pattern macam bucket 'logos')
insert into storage.buckets (id, name, public)
values ('inventory-photos', 'inventory-photos', true)
on conflict (id) do nothing;

drop policy if exists "public_read_inventory_photos" on storage.objects;
create policy "public_read_inventory_photos"
  on storage.objects for select
  using (bucket_id = 'inventory-photos');

drop policy if exists "own_folder_insert_inventory_photos" on storage.objects;
create policy "own_folder_insert_inventory_photos"
  on storage.objects for insert
  with check (bucket_id = 'inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own_folder_update_inventory_photos" on storage.objects;
create policy "own_folder_update_inventory_photos"
  on storage.objects for update
  using (bucket_id = 'inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own_folder_delete_inventory_photos" on storage.objects;
create policy "own_folder_delete_inventory_photos"
  on storage.objects for delete
  using (bucket_id = 'inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);