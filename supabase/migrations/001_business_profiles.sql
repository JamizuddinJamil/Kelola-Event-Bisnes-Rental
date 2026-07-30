-- Fasa 2: Business Profile
-- Satu profile per user (satu akaun = satu bisnes, untuk sekarang).

create table if not exists business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,

  business_name text not null,
  logo_url text,
  phone text,
  whatsapp text,
  address text,

  bank_name text,
  bank_account_number text,
  bank_account_holder text,

  terms_conditions text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on every change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_business_profiles_updated_at on business_profiles;
create trigger trg_business_profiles_updated_at
  before update on business_profiles
  for each row execute function set_updated_at();

-- Row Level Security: setiap user cuma boleh access profile dia sendiri
alter table business_profiles enable row level security;

drop policy if exists "select_own_profile" on business_profiles;
create policy "select_own_profile"
  on business_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_profile" on business_profiles;
create policy "insert_own_profile"
  on business_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_profile" on business_profiles;
create policy "update_own_profile"
  on business_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket untuk logo bisnes
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Logo boleh dibaca sesiapa (public URL untuk paparan di quotation/invoice nanti)
drop policy if exists "public_read_logos" on storage.objects;
create policy "public_read_logos"
  on storage.objects for select
  using (bucket_id = 'logos');

-- Tapi upload/update/delete cuma boleh untuk fail dalam folder {user_id}/ sendiri
drop policy if exists "own_folder_insert_logos" on storage.objects;
create policy "own_folder_insert_logos"
  on storage.objects for insert
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own_folder_update_logos" on storage.objects;
create policy "own_folder_update_logos"
  on storage.objects for update
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own_folder_delete_logos" on storage.objects;
create policy "own_folder_delete_logos"
  on storage.objects for delete
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);
