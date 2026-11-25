"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; type: ToastType; message: string };

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type FeedbackContextValue = {
  toast: (type: ToastType, message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("FeedbackProvider belum dipasang.");
  return ctx;
}

export const useToast = () => useFeedback().toast;
export const useConfirm = () => useFeedback().confirm;

const toastStyle: Record<ToastType, string> = {
  success: "border-clover-green bg-clover-soft text-deep-green",
  error: "border-red-300 bg-red-50 text-red-800",
  info: "border-golden-yellow bg-golden-yellow/20 text-ink",
};

function ToastIcon({ type }: { type: ToastType }) {
  const path =
    type === "success"
      ? "M5 13l4 4L19 7"
      : type === "error"
        ? "M6 6l12 12M18 6L6 18"
        : "M12 8v5m0 3h.01";
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function ConfirmDialog({
  options,
  onResult,
}: {
  options: ConfirmOptions;
  onResult: (ok: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const danger = options.danger ?? false;

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onCancel={(e) => {
        e.preventDefault();
        onResult(false);
      }}
      onClick={(e) => {
        if (e.target === ref.current) onResult(false);
      }}
      className="m-auto w-[min(92vw,26rem)] animate-dialog-in rounded-card border border-deep-green/10 bg-off-white p-0 text-ink shadow-soft backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div
          className={`mb-3 flex size-11 items-center justify-center rounded-full ${
            danger ? "bg-red-100 text-red-700" : "bg-clover-soft text-deep-green"
          }`}
        >
          <ToastIcon type={danger ? "error" : "info"} />
        </div>
        <h2 id="confirm-title" className="text-2xl font-semibold">
          {options.title ?? "Yakin?"}
        </h2>
        <p id="confirm-message" className="mt-2 text-sm text-ink/80">
          {options.message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => onResult(false)}
            className="rounded-pill border border-deep-green/30 px-5 py-2 text-sm font-semibold text-deep-green transition hover:bg-clover-soft"
          >
            {options.cancelLabel ?? "Batal"}
          </button>
          <button
            type="button"
            onClick={() => onResult(true)}
            className={`rounded-pill px-5 py-2 text-sm font-semibold text-white transition ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-deep-green hover:bg-deep-green-dark"
            }`}
          >
            {options.confirmLabel ?? "Ya, lanjutkan"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [pending, setPending] = useState<{
    options: ConfirmOptions;
    resolve: (ok: boolean) => void;
  } | null>(null);
  const nextId = useRef(1);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), type === "error" ? 6500 : 4000);
    },
    [dismiss],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      pendingRef.current?.resolve(false);
      setPending({ options, resolve });
    });
  }, []);

  const settle = useCallback((ok: boolean) => {
    pendingRef.current?.resolve(ok);
    setPending(null);
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:items-end"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-soft ${toastStyle[t.type]}`}
          >
            <ToastIcon type={t.type} />
            <p className="flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="-m-1 rounded-full p-1 opacity-60 hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {pending && <ConfirmDialog options={pending.options} onResult={settle} />}
    </FeedbackContext.Provider>
  );
}
