import { createClient } from "@/lib/supabase/server";
import type { Category, Service, TeamMember, Testimonial } from "@/lib/types";

// Nomor cadangan bila site_settings belum terisi. Ganti lewat tabel site_settings.
const FALLBACK_WA = "6281234567890";

const SERVICE_COLUMNS =
  "id, category_id, name, slug, short_description, description, price_from, image_url, category:categories(name, slug)";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as Category[];
}

export async function getServices(categorySlug?: string): Promise<Service[]> {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select(
      categorySlug
        ? SERVICE_COLUMNS.replace("category:categories", "category:categories!inner")
        : SERVICE_COLUMNS,
    )
    .eq("is_active", true)
    .order("sort_order");
  if (categorySlug) query = query.eq("category.slug", categorySlug);
  const { data } = await query;
  return (data ?? []) as unknown as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select(SERVICE_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as unknown as Service) ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("id, name, role_title, photo_url, bio, skills")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as TeamMember[];
}

export async function getApprovedTestimonials(limit = 6): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, name, rating, message, created_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Testimonial[];
}

export async function getAdminWa(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "admin_wa")
    .maybeSingle();
  return data?.value ?? FALLBACK_WA;
}
