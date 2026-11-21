import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveService } from "@/app/admin/actions";
import { AdminForm, Checkbox, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Form Layanan" };

export default async function ServiceFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  const { supabase } = await requireAdmin();

  const [{ data: categories }, { data: service }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order"),
    isNew
      ? Promise.resolve({ data: null })
      : supabase.from("services").select("*").eq("id", id).maybeSingle(),
  ]);
  if (!isNew && !service) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/layanan" className="text-sm font-semibold text-deep-green underline underline-offset-4">
        &larr; Semua layanan
      </Link>
      <h1 className="text-3xl font-semibold">{isNew ? "Layanan baru" : "Ubah layanan"}</h1>

      {(categories ?? []).length === 0 ? (
        <p className="rounded-xl bg-golden-yellow/20 px-4 py-3 text-sm">
          Buat kategori dulu di menu{" "}
          <Link href="/admin/kategori" className="font-semibold underline">
            Kategori
          </Link>
          .
        </p>
      ) : (
        <div className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
          <AdminForm action={saveService}>
            <input type="hidden" name="id" value={service?.id ?? ""} />
            <input type="hidden" name="current_image" value={service?.image_url ?? ""} />

            <Field label="Nama">
              <input name="name" required defaultValue={service?.name} className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kategori">
                <select
                  name="category_id"
                  required
                  defaultValue={service?.category_id ?? ""}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Harga mulai dari (Rp)">
                <input
                  name="price_from"
                  type="number"
                  min={0}
                  step={1000}
                  required
                  defaultValue={service?.price_from}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Deskripsi singkat" hint="Tampil di kartu katalog.">
              <input
                name="short_description"
                maxLength={160}
                defaultValue={service?.short_description ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Deskripsi lengkap">
              <textarea
                name="description"
                rows={6}
                defaultValue={service?.description ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Foto" hint="JPG, PNG, atau WebP, maksimal 4 MB. Kosongkan untuk mempertahankan foto saat ini.">
              {service?.image_url && (
                <div className="relative mb-2 aspect-[4/3] max-w-xs overflow-hidden rounded-xl bg-clover-soft">
                  <Image src={service.image_url} alt="Foto saat ini" fill unoptimized className="object-cover" />
                </div>
              )}
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={inputClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" hint="Kosongkan untuk dibuat otomatis dari nama.">
                <input name="slug" defaultValue={service?.slug} className={inputClass} />
              </Field>
              <Field label="Urutan">
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={service?.sort_order ?? 0}
                  className={inputClass}
                />
              </Field>
            </div>
            <Checkbox name="is_active" label="Aktif (tampil di website)" defaultChecked={service?.is_active ?? true} />
          </AdminForm>
        </div>
      )}
    </div>
  );
}
