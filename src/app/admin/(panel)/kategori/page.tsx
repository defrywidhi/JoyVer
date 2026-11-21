import type { Metadata } from "next";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { AdminForm, Checkbox, DeleteButton, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Kategori" };

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

function CategoryFields({ c }: { c?: Category }) {
  return (
    <>
      <input type="hidden" name="id" value={c?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama">
          <input name="name" required defaultValue={c?.name} className={inputClass} />
        </Field>
        <Field label="Slug" hint="Kosongkan untuk otomatis.">
          <input name="slug" defaultValue={c?.slug} className={inputClass} />
        </Field>
      </div>
      <Field label="Deskripsi">
        <input name="description" defaultValue={c?.description ?? ""} className={inputClass} />
      </Field>
      <div className="flex flex-wrap items-end gap-6">
        <Field label="Urutan">
          <input
            name="sort_order"
            type="number"
            defaultValue={c?.sort_order ?? 0}
            className={`${inputClass} w-28`}
          />
        </Field>
        <Checkbox name="is_active" label="Aktif" defaultChecked={c?.is_active ?? true} />
      </div>
    </>
  );
}

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  const categories = (data ?? []) as Category[];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Kategori</h1>

      <section className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-xl font-semibold">Tambah kategori</h2>
        <AdminForm action={saveCategory} submitLabel="Tambah" resetOnSuccess>
          <CategoryFields />
        </AdminForm>
      </section>

      {categories.map((c) => (
        <section key={c.id} className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <DeleteButton
              action={deleteCategory}
              fields={{ id: c.id }}
              confirmText={`Hapus kategori ${c.name}? Hanya bisa jika belum ada layanan di dalamnya.`}
            />
          </div>
          <AdminForm action={saveCategory}>
            <CategoryFields c={c} />
          </AdminForm>
        </section>
      ))}
    </div>
  );
}
