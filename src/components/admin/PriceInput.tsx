"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { inputClass } from "./ui";

const formatter = new Intl.NumberFormat("id-ID");
const MAX_DIGITS = 12;

const onlyDigits = (s: string) => s.replace(/\D/g, "").slice(0, MAX_DIGITS);
const format = (digits: string) => (digits ? formatter.format(Number(digits)) : "");

/**
 * Input rupiah dengan pemisah ribuan otomatis (1.500.000).
 * Yang tampil adalah teks berformat; yang dikirim ke server (`name`) angka murni.
 */
export function PriceInput({
  name,
  defaultValue,
  required,
  placeholder,
}: {
  name: string;
  defaultValue?: number | string | null;
  required?: boolean;
  placeholder?: string;
}) {
  const [digits, setDigits] = useState(() =>
    defaultValue === null || defaultValue === undefined || defaultValue === ""
      ? ""
      : onlyDigits(String(Math.round(Number(defaultValue)))),
  );
  const ref = useRef<HTMLInputElement>(null);
  const digitsBeforeCaret = useRef<number | null>(null);

  // Pertahankan posisi kursor setelah titik ditambah/dihapus.
  useLayoutEffect(() => {
    const input = ref.current;
    const target = digitsBeforeCaret.current;
    if (!input || target === null) return;
    digitsBeforeCaret.current = null;

    let seen = 0;
    let pos = input.value.length;
    for (let i = 0; i < input.value.length; i++) {
      if (seen === target) {
        pos = i;
        break;
      }
      if (/\d/.test(input.value[i])) seen++;
    }
    input.setSelectionRange(pos, pos);
  }, [digits]);

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-ink/50"
      >
        Rp
      </span>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required={required}
        placeholder={placeholder}
        value={format(digits)}
        onChange={(e) => {
          const raw = e.target.value;
          const caret = e.target.selectionStart ?? raw.length;
          digitsBeforeCaret.current = onlyDigits(raw.slice(0, caret)).length;
          setDigits(onlyDigits(raw));
        }}
        className={`${inputClass} pl-11`}
      />
      <input type="hidden" name={name} value={digits} />
    </div>
  );
}
