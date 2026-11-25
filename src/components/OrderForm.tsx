"use client";

import { useActionState, useEffect } from "react";
import { submitOrder, type OrderFormState } from "@/app/(site)/actions";
import { Spinner } from "@/components/ui/Spinner";

const initialState: OrderFormState = {};

const inputClass =
  "w-full rounded-xl border border-deep-green/20 bg-white px-4 py-3 text-base outline-none transition focus:border-clover-green focus:ring-2 focus:ring-clover-green/30";

export function OrderForm({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);

  useEffect(() => {
    if (!state.ok) return;
    const timer = window.setTimeout(() => window.location.assign(state.waUrl), 800);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state.ok) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="space-y-4 rounded-card border border-clover-green/30 bg-clover-soft p-6 text-center"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-clover-green text-white">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <div>
          <h3 className="text-2xl font-semibold">Pesanan Berhasil</h3>
          <p className="mt-1 text-sm text-ink/75">Kode order Anda:</p>
          <p className="mt-1 font-heading text-2xl font-bold text-deep-green">{state.orderCode}</p>
        </div>
        <p className="text-sm text-ink/75">
          Membuka WhatsApp... Jika tidak terbuka otomatis, tekan tombol di bawah.
        </p>
        <a
          href={state.waUrl}
          onClick={(event) => {
            event.preventDefault();
            window.location.assign(state.waUrl);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-golden-yellow px-6 py-3.5 font-semibold text-deep-green shadow-soft transition hover:bg-golden-dark"
        >
          Buka WhatsApp
        </a>
      </section>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="service_name" value={serviceName} />

      {/* Honeypot anti-bot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-deep-green">
          Nama
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          defaultValue={state.values?.name}
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
          autoComplete="tel"
          placeholder="081234567890"
          defaultValue={state.values?.wa}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink/60">
          Dipakai untuk diskusi dan melacak pesanan.
        </p>
      </div>

      <div>
        <label htmlFor="details" className="mb-1 block text-sm font-semibold text-deep-green">
          Kebutuhan <span className="font-normal text-ink/60">(opsional)</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          maxLength={2000}
          placeholder="Ceritakan singkat kebutuhan, tema, atau tanggal yang diinginkan."
          defaultValue={state.values?.details}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-golden-yellow px-6 py-3.5 font-semibold text-deep-green shadow-soft transition hover:-translate-y-0.5 hover:bg-golden-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <Spinner className="size-5" />}
        {pending ? "Menyimpan pesanan..." : "Pesan via WhatsApp"}
      </button>
      <p className="text-center text-xs text-ink/60">
        Anda akan diarahkan ke WhatsApp untuk diskusi sampai deal. Belum ada
        pembayaran di tahap ini.
      </p>
    </form>
  );
}
