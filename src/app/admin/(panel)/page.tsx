import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/site";

export const metadata: Metadata = { title: "Ringkasan" };

type RecentOrder = {
  id: string;
  code: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  service: { name: string } | null;
};

export default async function AdminHome() {
  const { supabase } = await requireAdmin();

  const [{ data: statuses }, { data: recent }, { count: pendingReviews }] =
    await Promise.all([
      supabase.from("orders").select("status"),
      supabase
        .from("orders")
        .select("id, code, customer_name, status, created_at, service:services(name)")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", false),
    ]);

  const counts = (statuses ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Ringkasan</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className="rounded-card border border-deep-green/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5"
          >
            <p className="font-heading text-3xl font-semibold text-deep-green">
              {counts[s] ?? 0}
            </p>
            <p className="text-sm text-ink/70">{ORDER_STATUS_LABEL[s]}</p>
          </Link>
        ))}
      </div>

      {(pendingReviews ?? 0) > 0 && (
        <Link
          href="/admin/testimoni"
          className="block rounded-card bg-golden-yellow/20 px-5 py-3 text-sm font-semibold text-deep-green"
        >
          {pendingReviews} testimoni menunggu persetujuan &rarr;
        </Link>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Order terbaru</h2>
        <div className="overflow-hidden rounded-card border border-deep-green/10 bg-white">
          {(recent ?? []).length === 0 ? (
            <p className="p-6 text-sm text-ink/70">Belum ada order.</p>
          ) : (
            <ul className="divide-y divide-deep-green/10">
              {(recent as unknown as RecentOrder[]).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 hover:bg-clover-soft/50"
                  >
                    <span>
                      <span className="font-semibold text-deep-green">{o.code}</span>{" "}
                      <span className="text-sm">{o.customer_name}</span>
                      <span className="block text-xs text-ink/60">
                        {o.service?.name} &middot; {formatDateTime(o.created_at)}
                      </span>
                    </span>
                    <span className="rounded-pill bg-clover-soft px-3 py-1 text-xs font-semibold text-deep-green">
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
