import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import {
  formatDateTime,
  formatRupiah,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/lib/site";

export const metadata: Metadata = { title: "Order" };

type Row = {
  id: string;
  code: string;
  customer_name: string;
  status: OrderStatus;
  final_price: number | null;
  created_at: string;
  service: { name: string } | null;
  assigned: { name: string } | null;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("orders")
    .select(
      "id, code, customer_name, status, final_price, created_at, service:services(name), assigned:team_members(name)",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (status && status in ORDER_STATUS_LABEL) query = query.eq("status", status);
  const { data } = await query;
  const rows = (data ?? []) as unknown as Row[];

  const chip = (active: boolean) =>
    `rounded-pill px-3 py-1.5 text-xs font-semibold ${
      active ? "bg-deep-green text-off-white" : "bg-clover-soft text-deep-green"
    }`;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Order</h1>

      <div className="flex flex-wrap gap-2">
        <Link href="/adalahpokoknya/orders" className={chip(!status)}>
          Semua
        </Link>
        {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
          <Link key={s} href={`/adalahpokoknya/orders?status=${s}`} className={chip(status === s)}>
            {ORDER_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-deep-green/10 bg-white">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-ink/70">Tidak ada order.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-clover-soft text-xs tracking-wide text-deep-green uppercase">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Layanan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Ditugaskan</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-deep-green/10">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-clover-soft/40">
                  <td className="px-4 py-3 font-semibold">
                    <Link href={`/adalahpokoknya/orders/${o.id}`} className="text-deep-green underline underline-offset-4">
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3">{o.service?.name}</td>
                  <td className="px-4 py-3">{ORDER_STATUS_LABEL[o.status]}</td>
                  <td className="px-4 py-3">
                    {o.final_price !== null ? formatRupiah(o.final_price) : "-"}
                  </td>
                  <td className="px-4 py-3">{o.assigned?.name ?? "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
