import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveTeamMember } from "@/app/adalahpokoknya/actions";
import { AdminForm, Checkbox, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Form Anggota Tim" };

export default async function TeamFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  const { supabase } = await requireAdmin();

  const { data: member } = isNew
    ? { data: null }
    : await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  if (!isNew && !member) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/adalahpokoknya/tim" className="text-sm font-semibold text-deep-green underline underline-offset-4">
        &larr; Semua anggota
      </Link>
      <h1 className="text-3xl font-semibold">{isNew ? "Anggota baru" : "Ubah anggota"}</h1>

      <div className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <AdminForm action={saveTeamMember}>
          <input type="hidden" name="id" value={member?.id ?? ""} />
          <input type="hidden" name="current_photo" value={member?.photo_url ?? ""} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama">
              <input name="name" required defaultValue={member?.name} className={inputClass} />
            </Field>
            <Field label="Peran">
              <input
                name="role_title"
                placeholder="Web Developer"
                defaultValue={member?.role_title ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field
            label="Keahlian"
            hint="Pisahkan dengan koma, contoh: Web, Desain, Floral. Dipakai untuk memilih penugasan order."
          >
            <input
              name="skills"
              defaultValue={(member?.skills ?? []).join(", ")}
              className={inputClass}
            />
          </Field>
          <Field label="Bio singkat">
            <textarea name="bio" rows={3} defaultValue={member?.bio ?? ""} className={inputClass} />
          </Field>
          <Field label="Foto" hint="JPG, PNG, atau WebP, maksimal 4 MB. Disarankan persegi.">
            {member?.photo_url && (
              <div className="relative mb-2 size-32 overflow-hidden rounded-xl bg-clover-soft">
                <Image src={member.photo_url} alt="Foto saat ini" fill unoptimized className="object-cover" />
              </div>
            )}
            <input
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
            />
          </Field>
          <div className="flex flex-wrap items-end gap-6">
            <Field label="Urutan">
              <input
                name="sort_order"
                type="number"
                defaultValue={member?.sort_order ?? 0}
                className={`${inputClass} w-28`}
              />
            </Field>
            <Checkbox name="is_active" label="Aktif (tampil di website)" defaultChecked={member?.is_active ?? true} />
          </div>
        </AdminForm>
      </div>
    </div>
  );
}
