import type { Metadata } from "next";
import { saveSettings } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "admin_wa")
    .maybeSingle();

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-3xl font-semibold">Pengaturan</h1>
      <div className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <AdminForm action={saveSettings}>
          <Field
            label="Nomor WhatsApp admin"
            hint="Tujuan redirect dari form order. Contoh: 081234567890."
          >
            <input
              name="admin_wa"
              type="tel"
              required
              defaultValue={data?.value ?? ""}
              className={inputClass}
            />
          </Field>
        </AdminForm>
      </div>
    </div>
  );
}
