-- JoyVer: skema awal (MVP)
-- Jalankan di Supabase SQL Editor atau lewat `supabase db push`.
-- Prinsip keamanan:
--   * Semua tabel memakai RLS.
--   * Publik hanya BACA data katalog (aktif) dan testimoni (disetujui).
--   * Publik TIDAK bisa membaca/menulis tabel orders langsung.
--     Buat order, lacak order, dan kirim testimoni lewat fungsi RPC.
--   * Pengelolaan penuh hanya untuk admin (tabel `admins`).

-- ---------------------------------------------------------------
-- 1. Tipe dan fungsi bantu
-- ---------------------------------------------------------------

create type public.order_status as enum (
  'menunggu_konfirmasi',
  'deal',
  'dikerjakan',
  'selesai',
  'dibatalkan'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Normalisasi nomor WA ke format 62xxxxxxxxxx (hanya digit).
create or replace function public.normalize_wa(raw text)
returns text
language plpgsql
immutable
as $$
declare
  d text := regexp_replace(coalesce(raw, ''), '\D', '', 'g');
begin
  if d like '0%' then
    d := '62' || substr(d, 2);
  elsif d like '8%' then
    d := '62' || d;
  end if;
  return d;
end;
$$;

-- ---------------------------------------------------------------
-- 2. Admin
-- ---------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------
-- 3. Tabel katalog
-- ---------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price_from numeric(12, 0) not null check (price_from >= 0),
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_category_idx on public.services (category_id);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text,
  photo_url text,
  bio text,
  skills text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 4. Order
-- ---------------------------------------------------------------

create sequence public.order_code_seq start 1;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_wa text not null check (customer_wa ~ '^62[0-9]{8,13}$'),
  service_id uuid not null references public.services (id) on delete restrict,
  details text check (char_length(details) <= 2000),
  status public.order_status not null default 'menunggu_konfirmasi',
  final_price numeric(12, 0) check (final_price >= 0),
  assigned_to uuid references public.team_members (id) on delete set null,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_idx on public.orders (status);
create index orders_service_idx on public.orders (service_id);
create index orders_assigned_idx on public.orders (assigned_to);
create index orders_created_idx on public.orders (created_at desc);

-- Kode order otomatis: JV-0001, JV-0002, ...
create or replace function public.set_order_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'JV-' || lpad(nextval('public.order_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

-- `code` wajib not null; beri default kosong agar trigger yang mengisi.
alter table public.orders alter column code set default '';

create trigger orders_set_code
before insert on public.orders
for each row execute function public.set_order_code();

create table public.order_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  note text,
  image_url text,
  link_url text,
  is_visible_to_customer boolean not null default true,
  created_at timestamptz not null default now(),
  check (note is not null or image_url is not null or link_url is not null)
);
create index order_updates_order_idx on public.order_updates (order_id, created_at);

-- ---------------------------------------------------------------
-- 5. Testimoni
-- ---------------------------------------------------------------

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique references public.orders (id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 5 and 1000),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 6. Pengaturan situs (nomor WA admin, dll.)
-- ---------------------------------------------------------------

create table public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('admin_wa', '6281234567890'),            -- GANTI dengan nomor asli
  ('site_tagline', 'We Create Joy')
on conflict (key) do nothing;

-- ---------------------------------------------------------------
-- 7. Trigger updated_at
-- ---------------------------------------------------------------

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- 8. Row Level Security
-- ---------------------------------------------------------------

alter table public.admins          enable row level security;
alter table public.categories      enable row level security;
alter table public.services        enable row level security;
alter table public.team_members    enable row level security;
alter table public.orders          enable row level security;
alter table public.order_updates   enable row level security;
alter table public.testimonials    enable row level security;
alter table public.site_settings   enable row level security;

-- admins: hanya admin yang boleh melihat; perubahan lewat dashboard Supabase.
create policy "admins: admin read" on public.admins
  for select to authenticated using (public.is_admin());

-- categories
create policy "categories: public read active" on public.categories
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "categories: admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- services
create policy "services: public read active" on public.services
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "services: admin write" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- team_members
create policy "team: public read active" on public.team_members
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "team: admin write" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- orders: hanya admin. Publik lewat RPC.
create policy "orders: admin all" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- order_updates: hanya admin. Publik lewat RPC track_order.
create policy "order_updates: admin all" on public.order_updates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- testimonials: publik baca yang disetujui; admin kelola.
create policy "testimonials: public read approved" on public.testimonials
  for select to anon, authenticated using (is_approved or public.is_admin());
create policy "testimonials: admin write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings: hanya key yang aman dibaca publik.
create policy "settings: public read" on public.site_settings
  for select to anon, authenticated
  using (key in ('admin_wa', 'site_tagline') or public.is_admin());
create policy "settings: admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------
-- 9. Fungsi RPC untuk publik (security definer)
-- ---------------------------------------------------------------

-- 9a. Buat order baru. Mengembalikan kode order.
create or replace function public.create_order(
  p_customer_name text,
  p_customer_wa text,
  p_service_id uuid,
  p_details text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wa text := public.normalize_wa(p_customer_wa);
  v_code text;
begin
  if not exists (
    select 1 from public.services s
    join public.categories c on c.id = s.category_id
    where s.id = p_service_id and s.is_active and c.is_active
  ) then
    raise exception 'Layanan tidak tersedia';
  end if;

  insert into public.orders (customer_name, customer_wa, service_id, details)
  values (trim(p_customer_name), v_wa, p_service_id, nullif(trim(p_details), ''))
  returning code into v_code;

  return v_code;
end;
$$;

-- 9b. Lacak order: butuh kode + nomor WA yang cocok.
create or replace function public.track_order(p_code text, p_wa text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_result jsonb;
begin
  select * into v_order
  from public.orders
  where upper(code) = upper(trim(p_code))
    and customer_wa = public.normalize_wa(p_wa);

  if not found then
    return null;
  end if;

  select jsonb_build_object(
    'code', v_order.code,
    'status', v_order.status,
    'service_name', (select name from public.services where id = v_order.service_id),
    'final_price', v_order.final_price,
    'assigned_to', (select name from public.team_members where id = v_order.assigned_to),
    'created_at', v_order.created_at,
    'can_review', v_order.status = 'selesai'
                  and not exists (select 1 from public.testimonials where order_id = v_order.id),
    'updates', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'note', u.note,
          'image_url', u.image_url,
          'link_url', u.link_url,
          'created_at', u.created_at
        ) order by u.created_at
      )
      from public.order_updates u
      where u.order_id = v_order.id and u.is_visible_to_customer
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

-- 9c. Kirim testimoni: hanya untuk order selesai, satu kali per order.
create or replace function public.submit_testimonial(
  p_code text,
  p_wa text,
  p_rating int,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  select * into v_order
  from public.orders
  where upper(code) = upper(trim(p_code))
    and customer_wa = public.normalize_wa(p_wa);

  if not found then
    raise exception 'Order tidak ditemukan';
  end if;
  if v_order.status <> 'selesai' then
    raise exception 'Testimoni hanya bisa dikirim setelah order selesai';
  end if;
  if exists (select 1 from public.testimonials where order_id = v_order.id) then
    raise exception 'Testimoni untuk order ini sudah dikirim';
  end if;

  insert into public.testimonials (order_id, name, rating, message)
  values (v_order.id, v_order.customer_name, p_rating, trim(p_message));
end;
$$;

-- Batasi eksekusi: publik hanya boleh memanggil 3 RPC di atas.
revoke all on function public.create_order(text, text, uuid, text) from public;
revoke all on function public.track_order(text, text) from public;
revoke all on function public.submit_testimonial(text, text, int, text) from public;
grant execute on function public.create_order(text, text, uuid, text) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
grant execute on function public.submit_testimonial(text, text, int, text) to anon, authenticated;

-- ---------------------------------------------------------------
-- 10. Storage (foto)
-- ---------------------------------------------------------------
-- Bucket publik untuk dibaca; hanya admin yang boleh mengunggah/mengubah.

insert into storage.buckets (id, name, public) values
  ('service-images', 'service-images', true),
  ('team-photos', 'team-photos', true),
  ('progress-photos', 'progress-photos', true)
on conflict (id) do nothing;

create policy "storage: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('service-images', 'team-photos', 'progress-photos'));

create policy "storage: admin insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('service-images', 'team-photos', 'progress-photos')
    and public.is_admin()
  );

create policy "storage: admin update" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('service-images', 'team-photos', 'progress-photos')
    and public.is_admin()
  );

create policy "storage: admin delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('service-images', 'team-photos', 'progress-photos')
    and public.is_admin()
  );
