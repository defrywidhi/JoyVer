import { unstable_cache } from "next/cache";
import { PUBLIC_DATA_TAG, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category, Service, TeamMember, Testimonial } from "@/lib/types";

// Nomor cadangan bila site_settings belum terisi. Ganti lewat dashboard admin.
const FALLBACK_WA = "6281234567890";

const SERVICE_COLUMNS =
  "id, category_id, name, slug, short_description, description, price_from, image_url, category:categories(name, slug)";

/**
 * Cache data publik. Disegarkan otomatis tiap PUBLIC_REVALIDATE_SECONDS dan
 * langsung saat admin mengubah data (revalidateTag(PUBLIC_DATA_TAG)).
 * Error dilempar (bukan dikembalikan kosong) agar hasil gagal tidak ikut ter-cache.
 */
function cached<A extends unknown[], T>(fn: (...args: A) => Promise<T>, key: string) {
  return unstable_cache(fn, [key], {
    tags: [PUBLIC_DATA_TAG],
    revalidate: PUBLIC_REVALIDATE_SECONDS,
  });
}

export const getCategories = cached(async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(`categories: ${error.message}`);
  return (data ?? []) as Category[];
}, "categories");

export const getServices = cached(async (): Promise<Service[]> => {
  const { data, error } = await createPublicClient()
    .from("services")
    .select(SERVICE_COLUMNS)
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(`services: ${error.message}`);
  return (data ?? []) as unknown as Service[];
}, "services");

export const getServiceBySlug = cached(async (slug: string): Promise<Service | null> => {
  const { data, error } = await createPublicClient()
    .from("services")
    .select(SERVICE_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(`service: ${error.message}`);
  return (data as unknown as Service) ?? null;
}, "service-by-slug");

export const getTeam = cached(async (): Promise<TeamMember[]> => {
  const { data, error } = await createPublicClient()
    .from("team_members")
    .select("id, name, role_title, photo_url, bio, skills")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(`team: ${error.message}`);
  return (data ?? []) as TeamMember[];
}, "team");

export const getApprovedTestimonials = cached(async (limit: number = 6): Promise<Testimonial[]> => {
  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("id, name, rating, message, created_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`testimonials: ${error.message}`);
  return (data ?? []) as Testimonial[];
}, "testimonials");

export const getAdminWa = cached(async (): Promise<string> => {
  const { data, error } = await createPublicClient()
    .from("site_settings")
    .select("value")
    .eq("key", "admin_wa")
    .maybeSingle();
  if (error) throw new Error(`settings: ${error.message}`);
  return data?.value ?? FALLBACK_WA;
}, "admin-wa");
