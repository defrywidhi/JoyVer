import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addOrderUpdate,
  deleteOrder,
  deleteOrderUpdate,
  updateOrder,
} from "@/app/admin/actions";
import { PriceInput } from "@/components/admin/PriceInput";
import { AdminForm, Checkbox, DeleteButton, Field, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import {
  buildWhatsAppUrl,
  formatDateTime,
  formatRupiah,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/lib/site";

export const metadata: Metadata = { title: "Detail Order" };

type Order = {
  id: string;
  code: string;
  customer_name: string;
  customer_wa: string;
  details: string | null;
  status: OrderStatus;
  final_price: number | null;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
  service: { name: string; price_from: number } | null;
};

type Update = {
  id: string;
  note: string | null;
  image_url: string | null;
  link_url: string | null;
  is_visible_to_customer: boolean;
  created_at: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: order }, { data: updates }, { data: team }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, service:services(name, price_from)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("order_updates")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("team_members")
      .select("id, name, skills")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  if (!order) notFound();
  const o = order as unknown as Order;
  const list = (updates ?? []) as Update[];

  const waUrl = buildWhatsAppUrl(
    o.customer_wa,
    `Halo ${o.customer_name}, ini JoyVer terkait pesanan ${o.code} (${o.service?.name}).`,
  );

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm font-semibold text-deep-green underline underline-offset-4">
        &larr; Semua order
      </Link>

      <section className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">{o.code}</h1>
            <p className="text-sm text-ink/60">Masuk {formatDateTime(o.created_at)}</p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill bg-golden-yellow px-5 py-2 text-sm font-semibold text-deep-green hover:bg-golden-dark"
          >
            Chat pelanggan di WA
          </a>
        </div>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink/60">Pelanggan</dt>
            <dd className="font-semibold">{o.customer_name}</dd>
          </div>
          <div>
            <dt className="text-ink/60">WhatsApp</dt>
            <dd className="font-semibold">+{o.customer_wa}</dd>
          </div>
          <div>
            <dt className="text-ink/60">Layanan</dt>
            <dd className="font-semibold">
              {o.service?.name}{" "}
              <span className="font-normal text-ink/60">
                (mulai dari {o.service ? formatRupiah(o.service.price_from) : "-"})
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-ink/60">Kebutuhan</dt>
            <dd className="whitespace-pre-line">{o.details ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-xl font-semibold">Status, harga, dan penugasan</h2>
        <AdminForm action={updateOrder}>
          <input type="hidden" name="id" value={o.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select name="status" defaultValue={o.status} className={inputClass}>
                {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Harga final (Rp)" hint="Kosongkan jika belum deal.">
              <PriceInput name="final_price" defaultValue={o.final_price} />
            </Field>
            <Field label="Ditugaskan ke">
              <select name="assigned_to" defaultValue={o.assigned_to ?? ""} className={inputClass}>
                <option value="">Belum ditugaskan</option>
                {(team ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {m.skills?.length ? ` (${m.skills.join(", ")})` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Catatan internal" hint="Tidak terlihat oleh pelanggan.">
            <textarea
              name="admin_notes"
              rows={3}
              defaultValue={o.admin_notes ?? ""}
              className={inputClass}
            />
          </Field>
        </AdminForm>
      </section>

      <section className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-xl font-semibold">Progres</h2>

        <AdminForm action={addOrderUpdate} submitLabel="Tambah progres" resetOnSuccess>
          <input type="hidden" name="order_id" value={o.id} />
          <Field label="Catatan">
            <textarea name="note" rows={3} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tautan preview (opsional)">
              <input name="link_url" type="url" placeholder="https://" className={inputClass} />
            </Field>
            <Field label="Foto (opsional)" hint="JPG, PNG, atau WebP, maksimal 4 MB.">
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={inputClass}
              />
            </Field>
          </div>
          <Checkbox name="visible" label="Tampilkan ke pelanggan" defaultChecked />
        </AdminForm>

        <ul className="mt-6 space-y-4">
          {list.length === 0 && <li className="text-sm text-ink/70">Belum ada progres.</li>}
          {list.map((u) => (
            <li key={u.id} className="rounded-xl border border-deep-green/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-ink/60">
                  {formatDateTime(u.created_at)}
                  {!u.is_visible_to_customer && (
                    <span className="ml-2 rounded-pill bg-golden-yellow/30 px-2 py-0.5 font-semibold text-deep-green">
                      Internal
                    </span>
                  )}
                </p>
                <DeleteButton
                  action={deleteOrderUpdate}
                  fields={{ id: u.id, order_id: o.id }}
                  confirmText="Hapus progres ini?"
                />
              </div>
              {u.note && <p className="mt-2 text-sm whitespace-pre-line">{u.note}</p>}
              {u.link_url && (
                <a
                  href={u.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-deep-green underline underline-offset-4"
                >
                  {u.link_url}
                </a>
              )}
              {u.image_url && (
                <div className="relative mt-3 aspect-[4/3] max-w-xs overflow-hidden rounded-xl bg-clover-soft">
                  <Image src={u.image_url} alt="Foto progres" fill unoptimized className="object-cover" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-between rounded-card border border-red-200 bg-red-50/50 p-5">
        <p className="text-sm text-red-800">
          Menghapus order juga menghapus semua progresnya. Untuk pesanan batal, lebih
          aman ubah status ke Dibatalkan.
        </p>
        <DeleteButton
          action={deleteOrder}
          fields={{ id: o.id }}
          label="Hapus order"
          confirmText={`Hapus order ${o.code} secara permanen?`}
        />
      </section>
    </div>
  );
}
