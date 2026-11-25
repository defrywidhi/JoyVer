import type { MetadataRoute } from "next";
import { getServices } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/layanan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/tim`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/tentang`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/syarat-ketentuan`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/kebijakan-privasi`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const services = await getServices();
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${siteConfig.url}/layanan/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
    return [...staticRoutes, ...serviceRoutes];
  } catch {
    // Sitemap tetap menyediakan rute utama jika Supabase sedang unavailable.
    return staticRoutes;
  }
}
