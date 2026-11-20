-- Data contoh untuk pengembangan. Ganti dengan konten asli nanti.

insert into public.categories (name, slug, description, sort_order) values
  ('Undangan Digital', 'undangan-digital', 'Website undangan pernikahan dan acara', 1),
  ('Website Usaha', 'website-usaha', 'Website profil dan toko untuk bisnis Anda', 2),
  ('Buket Bunga', 'buket-bunga', 'Buket bunga untuk hadiah dan momen spesial', 3)
on conflict (slug) do nothing;

insert into public.services (category_id, name, slug, short_description, price_from, sort_order)
select c.id, s.name, s.slug, s.short_description, s.price_from, s.sort_order
from (values
  ('undangan-digital', 'Undangan Pernikahan Digital', 'undangan-pernikahan-digital', 'Undangan online lengkap dengan RSVP dan galeri', 150000, 1),
  ('website-usaha', 'Website Profil Usaha', 'website-profil-usaha', 'Website profesional untuk usaha kecil dan menengah', 750000, 1),
  ('buket-bunga', 'Buket Bunga Custom', 'buket-bunga-custom', 'Buket sesuai tema dan budget Anda', 100000, 1)
) as s(cat_slug, name, slug, short_description, price_from, sort_order)
join public.categories c on c.slug = s.cat_slug
on conflict (slug) do nothing;

insert into public.team_members (name, role_title, skills, sort_order) values
  ('Anggota 1', 'Web Developer', array['Web'], 1),
  ('Anggota 2', 'Desainer', array['Desain', 'Undangan'], 2),
  ('Anggota 3', 'Florist', array['Floral'], 3);

-- Menjadikan akun sebagai admin (jalankan SETELAH membuat user di Supabase Auth):
-- insert into public.admins (user_id) values ('<UUID-USER-ADMIN>');
