"use client";

import Image from "next/image";
import { useActionState } from "react";
import {
  trackOrder,
  type TrackedOrder,
  type TrackState,
} from "@/app/lacak/actions";
import {
  formatDateTime,
  formatRupiah,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/lib/site";
import { ReviewForm } from "./ReviewForm";

const initialState: TrackState = {};

const inputClass =
  "w-full rounded-xl border border-deep-green/20 bg-white px-4 py-3 text-base outline-none transition focus:border-clover-green focus:ring-2 focus:ring-clover-green/30";

const FLOW: OrderStatus[] = ["menunggu_konfirmasi", "deal", "dikerjakan", "selesai"];

export function TrackForm() {
  const [state, formAction, pending] = useActionState(trackOrder, initialState);

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        className="space-y-4 rounded-card border border-deep-green/10 bg-white p-6 shadow-soft"
        noValidate
      >
        <div>
          <label htmlFor="code" className="mb-1 block text-sm font-semibold text-deep-green">
            Kode Order
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="JV-0001"
            autoComplete="off"
            autoCapitalize="characters"
            defaultValue={state.values?.code}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wa" className="mb-1 block text-sm font-semibold text-deep-green">
            Nomor WhatsApp
          </label>
          <input
            id="wa"
            name="wa"
            type="tel"
            inputMode="tel"
            required
            placeholder="081234567890"
            autoComplete="tel"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink/60">
            Gunakan nomor yang sama dengan saat memesan.
          </p>
        </div>

        {state.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-pill bg-golden-yellow px-6 py-3.5 font-semibold text-deep-green shadow-soft transition hover:-translate-y-0.5 hover:bg-golden-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Mencari..." : "Lacak Pesanan"}
        </button>
      </form>

      {state.order && state.values && (
        <OrderResult order={state.order} wa={state.values.wa} />
      )}
    </div>
  );
}

function OrderResult({ order, wa }: { order: TrackedOrder; wa: string }) {
  const cancelled = order.status === "dibatalkan";
  const currentIndex = FLOW.indexOf(order.status);

  return (
    <section aria-live="polite" className="space-y-6">
      <div className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-ink/60">Kode order</p>
            <p className="font-heading text-2xl font-semibold text-deep-green">
              {order.code}
            </p>
          </div>
          <span
            className={`rounded-pill px-4 py-1.5 text-sm font-semibold ${
              cancelled
                ? "bg-red-100 text-red-700"
                : order.status === "selesai"
                  ? "bg-clover-green text-white"
                  : "bg-golden-yellow text-deep-green"
            }`}
          >
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink/60">Layanan</dt>
            <dd className="font-semibold">{order.service_name}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/60">Harga final</dt>
            <dd className="font-semibold">
              {order.final_price !== null
                ? formatRupiah(order.final_price)
                : "Belum ditentukan"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink/60">Dikerjakan oleh</dt>
            <dd className="font-semibold">{order.assigned_to ?? "Belum ditugaskan"}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/60">Dipesan pada</dt>
            <dd className="font-semibold">{formatDateTime(order.created_at)}</dd>
          </div>
        </dl>

        {cancelled ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Pesanan ini dibatalkan. Hubungi kami lewat WhatsApp jika ada pertanyaan.
          </p>
        ) : (
          <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Tahapan pesanan">
            {FLOW.map((s, i) => {
              const done = i <= currentIndex;
              return (
                <li key={s} className="text-center">
                  <div
                    className={`h-2 rounded-full ${done ? "bg-clover-green" : "bg-deep-green/15"}`}
                  />
                  <span
                    className={`mt-2 block text-xs ${
                      i === currentIndex ? "font-bold text-deep-green" : "text-ink/60"
                    }`}
                  >
                    {ORDER_STATUS_LABEL[s]}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="rounded-card border border-deep-green/10 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-2xl font-semibold">Riwayat Progres</h2>
        {order.updates.length === 0 ? (
          <p className="text-sm text-ink/70">
            Belum ada update progres. Kami akan menambahkannya begitu pengerjaan berjalan.
          </p>
        ) : (
          <ol className="space-y-6 border-l-2 border-clover-green/40 pl-5">
            {[...order.updates].reverse().map((u, i) => (
              <li key={`${u.created_at}-${i}`} className="relative">
                <span className="absolute top-1.5 -left-[1.7rem] size-3 rounded-full bg-clover-green" />
                <time className="text-xs text-ink/60">{formatDateTime(u.created_at)}</time>
                {u.note && <p className="mt-1 whitespace-pre-line">{u.note}</p>}
                {u.link_url && (
                  <a
                    href={u.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-deep-green underline underline-offset-4"
                  >
                    Buka tautan preview
                  </a>
                )}
                {u.image_url && (
                  <a
                    href={u.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-3 block aspect-[4/3] max-w-sm overflow-hidden rounded-xl bg-clover-soft"
                  >
                    <Image
                      src={u.image_url}
                      alt="Foto progres pengerjaan"
                      fill
                      unoptimized
                      sizes="24rem"
                      className="object-cover"
                    />
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {order.can_review && <ReviewForm code={order.code} wa={wa} />}
    </section>
  );
}
