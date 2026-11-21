"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/app/admin/actions";
import { useConfirm, useToast, type ConfirmOptions } from "@/components/ui/Feedback";
import { Spinner } from "@/components/ui/Spinner";

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

/**
 * Membungkus server action: menampilkan toast sukses/gagal dan menangani
 * `redirectTo`. Toast dipicu di sini (bukan lewat effect) supaya tetap muncul
 * walaupun komponen sudah hilang setelah data direvalidasi (mis. baris dihapus).
 */
function useFeedbackAction(action: (prev: FormState, fd: FormData) => Promise<FormState>) {
  const toast = useToast();
  const router = useRouter();

  return useActionState(async (prev: FormState, fd: FormData) => {
    const result = await action(prev, fd);
    if (result.error) toast("error", result.error);
    else if (result.success) toast("success", result.success);
    if (result.redirectTo) router.push(result.redirectTo);
    return result;
  }, {} as FormState);
}

/** Form admin: tombol submit menampilkan spinner, hasil lewat toast. */
export function AdminForm({
  action,
  submitLabel = "Simpan",
  pendingLabel = "Menyimpan...",
  resetOnSuccess = false,
  className = "space-y-4",
  children,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  submitLabel?: string;
  pendingLabel?: string;
  resetOnSuccess?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useFeedbackAction(action);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.success) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={className} aria-busy={pending}>
      {children}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-pill bg-deep-green px-6 py-2.5 text-sm font-semibold text-off-white transition hover:bg-deep-green-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <Spinner />}
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}

const variantClass = {
  primary: "bg-deep-green text-off-white hover:bg-deep-green-dark",
  outline: "border border-deep-green/30 text-deep-green hover:bg-clover-soft",
  danger: "border border-red-300 text-red-700 hover:bg-red-50",
} as const;

/** Tombol aksi satu klik (hapus, setujui, keluar) dengan konfirmasi opsional. */
export function ActionButton({
  action,
  fields = {},
  label,
  pendingLabel = "Memproses...",
  variant = "primary",
  confirm,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  fields?: Record<string, string>;
  label: string;
  pendingLabel?: string;
  variant?: keyof typeof variantClass;
  confirm?: ConfirmOptions;
}) {
  const [, formAction, pending] = useFeedbackAction(action);
  const askConfirm = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmed = useRef(false);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={async (e) => {
        if (!confirm || confirmed.current) {
          confirmed.current = false;
          return;
        }
        e.preventDefault();
        if (await askConfirm(confirm)) {
          confirmed.current = true;
          formRef.current?.requestSubmit();
        }
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]}`}
      >
        {pending && <Spinner className="size-3.5" />}
        {pending ? pendingLabel : label}
      </button>
    </form>
  );
}

export function DeleteButton({
  action,
  fields,
  confirmText = "Data ini akan dihapus permanen dan tidak bisa dikembalikan.",
  label = "Hapus",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  fields: Record<string, string>;
  confirmText?: string;
  label?: string;
}) {
  return (
    <ActionButton
      action={action}
      fields={fields}
      label={label}
      pendingLabel="Menghapus..."
      variant="danger"
      confirm={{
        title: "Hapus data?",
        message: confirmText,
        confirmLabel: "Ya, hapus",
        danger: true,
      }}
    />
  );
}
