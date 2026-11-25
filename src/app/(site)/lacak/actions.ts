"use server";

import { getClientIp, rateLimit, waitMessage } from "@/lib/rate-limit";
import type { OrderStatus } from "@/lib/site";
import { normalizeWa } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export type OrderUpdate = {
  note: string | null;
  image_url: string | null;
  link_url: string | null;
  created_at: string;
};

export type TrackedOrder = {
  code: string;
  status: OrderStatus;
  service_name: string;
  final_price: number | null;
  assigned_to: string | null;
  created_at: string;
  can_review: boolean;
  updates: OrderUpdate[];
};

export type TrackState = {
  error?: string;
  order?: TrackedOrder;
  /** Nilai ternormalisasi, dipakai form testimoni. */
  values?: { code: string; wa: string };
};

export async function trackOrder(
  _prev: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const wa = normalizeWa(String(formData.get("wa") ?? ""));
  const values = { code, wa };

  if (!/^JV-\d{4,}$/.test(code)) {
    return { error: "Format kode order tidak valid. Contoh: JV-0001.", values };
  }
  if (!/^62\d{8,13}$/.test(wa)) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890.", values };
  }

  // Batas per IP dan per kode, agar nomor WA tidak bisa ditebak lewat brute force.
  const ip = await getClientIp();
  const byIp = rateLimit(`track:ip:${ip}`, 10, TEN_MINUTES);
  const byCode = rateLimit(`track:code:${code}`, 10, TEN_MINUTES);
  if (!byIp.ok || !byCode.ok) {
    return {
      error: waitMessage(Math.max(byIp.retryAfterSec, byCode.retryAfterSec)),
      values,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("track_order", {
    p_code: code,
    p_wa: wa,
  });

  if (error) {
    return { error: "Pesanan belum bisa dicek. Coba lagi sebentar lagi.", values };
  }
  if (!data) {
    return {
      error: "Pesanan tidak ditemukan. Periksa kembali kode dan nomor WhatsApp.",
      values,
    };
  }

  return { order: data as TrackedOrder, values };
}

export type ReviewState = {
  error?: string;
  success?: boolean;
  values?: { rating: number; message: string };
};

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const wa = normalizeWa(String(formData.get("wa") ?? ""));
  const rating = Number(formData.get("rating"));
  const message = String(formData.get("message") ?? "").trim();
  const values = { rating, message };

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pilih rating 1 sampai 5 bintang.", values };
  }
  if (message.length < 5 || message.length > 1000) {
    return { error: "Ulasan harus 5 sampai 1000 karakter.", values };
  }

  const ip = await getClientIp();
  const limited = rateLimit(`review:ip:${ip}`, 5, ONE_HOUR);
  if (!limited.ok) {
    return { error: waitMessage(limited.retryAfterSec), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_testimonial", {
    p_code: code,
    p_wa: wa,
    p_rating: rating,
    p_message: message,
  });

  if (error) {
    const sudahAda = error.message.includes("sudah dikirim");
    return {
      error: sudahAda
        ? "Testimoni untuk pesanan ini sudah pernah dikirim."
        : "Testimoni belum bisa dikirim. Coba lagi sebentar lagi.",
      values,
    };
  }

  return { success: true };
}
