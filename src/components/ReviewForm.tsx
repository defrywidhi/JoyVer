"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewState } from "@/app/lacak/actions";

const initialState: ReviewState = {};

export function ReviewForm({ code, wa }: { code: string; wa: string }) {
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(state.values?.rating ?? 0);
  const [hover, setHover] = useState(0);

  if (state.success) {
    return (
      <div role="status" className="rounded-card bg-clover-soft p-6 text-center">
        <h3 className="text-xl font-semibold">Terima kasih!</h3>
        <p className="mt-1 text-sm text-ink/80">
          Testimoni Anda sudah kami terima dan akan tampil setelah ditinjau.
        </p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-card border border-golden-yellow/60 bg-golden-yellow/10 p-6"
    >
      <div>
        <h3 className="text-xl font-semibold">Bagaimana pengalaman Anda?</h3>
        <p className="text-sm text-ink/75">
          Pesanan sudah selesai. Bagikan ulasan Anda untuk JoyVer.
        </p>
      </div>

      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="wa" value={wa} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p id="rating-label" className="mb-1 text-sm font-semibold text-deep-green">
          Rating
        </p>
        <div
          role="radiogroup"
          aria-labelledby="rating-label"
          className="flex gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={rating === i}
              aria-label={`${i} bintang`}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              className="rounded-md p-0.5 transition hover:scale-110"
            >
              <svg
                viewBox="0 0 20 20"
                className={`size-9 ${i <= shown ? "text-golden-yellow" : "text-deep-green/20"}`}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1 4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-semibold text-deep-green">
          Ulasan
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          minLength={5}
          maxLength={1000}
          defaultValue={state.values?.message}
          placeholder="Ceritakan pengalaman Anda..."
          className="w-full rounded-xl border border-deep-green/20 bg-white px-4 py-3 outline-none focus:border-clover-green focus:ring-2 focus:ring-clover-green/30"
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
        className="rounded-pill bg-deep-green px-6 py-3 font-semibold text-off-white transition hover:bg-deep-green-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Kirim Testimoni"}
      </button>
    </form>
  );
}
