import type { Metadata } from "next";
import { deleteTestimonial, setTestimonialApproval } from "@/app/adalahpokoknya/actions";
import { ActionButton, DeleteButton } from "@/components/admin/ui";
import { Stars } from "@/components/Stars";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/site";

export const metadata: Metadata = { title: "Testimoni" };

type Row = {
  id: string;
  name: string;
  rating: number;
  message: string;
  is_approved: boolean;
  created_at: string;
};

export default async function TestimonialsAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("testimonials")
    .select("id, name, rating, message, is_approved, created_at")
    .order("is_approved")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Testimoni</h1>
      <p className="text-sm text-ink/70">
        Testimoni baru tidak tampil di website sampai Anda menyetujuinya.
      </p>

      {rows.length === 0 ? (
        <p className="rounded-card border border-deep-green/10 bg-white p-6 text-sm text-ink/70">
          Belum ada testimoni.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((t) => (
            <li key={t.id} className="rounded-card border border-deep-green/10 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Stars rating={t.rating} />
                  <span
                    className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
                      t.is_approved
                        ? "bg-clover-green/20 text-deep-green"
                        : "bg-golden-yellow/30 text-deep-green"
                    }`}
                  >
                    {t.is_approved ? "Tampil" : "Menunggu"}
                  </span>
                </div>
                <span className="text-xs text-ink/60">{formatDateTime(t.created_at)}</span>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{t.message}</p>
              <p className="mt-2 text-sm font-semibold text-deep-green">{t.name}</p>

              <div className="mt-4 flex items-center gap-2">
                <ActionButton
                  action={setTestimonialApproval}
                  fields={{ id: t.id, approve: t.is_approved ? "0" : "1" }}
                  label={t.is_approved ? "Sembunyikan" : "Setujui"}
                />
                <DeleteButton action={deleteTestimonial} fields={{ id: t.id }} confirmText="Hapus testimoni ini?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
