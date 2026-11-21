"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/app/admin/actions";

export const inputClass =
  "w-full rounded-xl border border-deep-green/20 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-clover-green focus:ring-2 focus:ring-clover-green/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-deep-green">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </label>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-clover-green"
      />
      {label}
    </label>
  );
}

/** Form dengan pesan error/sukses. `resetOnSuccess` mengosongkan isian setelah berhasil. */
export function AdminForm({
  action,
  submitLabel = "Simpan",
  resetOnSuccess = false,
  className = "space-y-4",
  children,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.success) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-xl bg-clover-soft px-4 py-2.5 text-sm text-deep-green">
          {state.success}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-deep-green px-6 py-2.5 text-sm font-semibold text-off-white transition hover:bg-deep-green-dark disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}

/** Tombol hapus dengan konfirmasi. `action` adalah server action yang menerima FormData. */
export function DeleteButton({
  action,
  fields,
  confirmText = "Hapus data ini? Tindakan tidak bisa dibatalkan.",
  label = "Hapus",
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className="rounded-pill border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  );
}
