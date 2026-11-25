"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Loading bar tipis di atas layar. App Router tidak punya event navigasi,
 * jadi bar dimulai saat tautan internal diklik dan selesai saat URL berubah.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  const clearTimers = () => {
    if (timer.current) clearInterval(timer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  // Selesai: URL sudah berubah.
  useEffect(() => {
    if (!active.current) return;
    active.current = false;
    clearTimers();
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }, [pathname, search]);

  // Mulai: klik tautan internal.
  useEffect(() => {
    const start = () => {
      clearTimers();
      active.current = true;
      setVisible(true);
      setProgress(12);
      timer.current = setInterval(() => {
        setProgress((p) => (p < 85 ? p + (90 - p) * 0.12 : p));
      }, 200);
      // Pengaman bila navigasi tidak mengubah URL.
      hideTimer.current = setTimeout(() => {
        active.current = false;
        clearTimers();
        setVisible(false);
        setProgress(0);
      }, 10000);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimers();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className="h-full rounded-r-full bg-golden-yellow shadow-[0_0_10px_var(--color-golden-yellow)]"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? "none" : "width 200ms ease-out",
        }}
      />
    </div>
  );
}
