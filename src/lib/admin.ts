import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Pastikan pemanggil adalah admin terdaftar (tabel `admins`).
 * Middleware hanya mengecek login; pengecekan peran ada di sini dan di RLS.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }
  return { supabase, user };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Unggah gambar ke bucket publik. Mengembalikan URL publik, atau null jika tidak ada file. */
export async function uploadImage(
  supabase: Supabase,
  bucket: "service-images" | "team-photos" | "progress-photos",
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Format gambar harus JPG, PNG, atau WebP.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Ukuran gambar maksimal 4 MB.");

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });
  if (error) throw new Error("Gagal mengunggah gambar.");

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
