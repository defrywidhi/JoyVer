import type { Metadata } from "next";
import { saveSettings } from "@/app/admin/actions";
import { AdminForm, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["admin_wa", "admin_notification_email"]);
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

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
              defaultValue={settings.admin_wa ?? ""}
              className={inputClass}
            />
          </Field>
          <Field
            label="Email Notifikasi Admin"
            hint="Penerima email order baru. Kosongkan untuk memakai ADMIN_NOTIFICATION_EMAIL dari environment."
          >
            <input
              name="admin_notification_email"
              type="email"
              autoComplete="email"
              placeholder="admin@contoh.id"
              defaultValue={settings.admin_notification_email ?? ""}
              className={inputClass}
            />
          </Field>
        </AdminForm>
      </div>
    </div>
  );
}
