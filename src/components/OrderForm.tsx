"use client";

import { useActionState } from "react";
import { submitOrder, type OrderFormState } from "@/app/(site)/actions";

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
        className="w-full rounded-pill bg-golden-yellow px-6 py-3.5 font-semibold text-deep-green shadow-soft transition hover:-translate-y-0.5 hover:bg-golden-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Pesan via WhatsApp"}
      </button>
      <p className="text-center text-xs text-ink/60">
        Anda akan diarahkan ke WhatsApp untuk diskusi sampai deal. Belum ada
        pembayaran di tahap ini.
      </p>
    </form>
  );
}
