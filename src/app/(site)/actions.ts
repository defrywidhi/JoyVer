"use server";

import { after } from "next/server";

import { sendOrderNotification } from "@/lib/email";
import { getAdminWa } from "@/lib/data";
import { getClientIp, rateLimit, waitMessage } from "@/lib/rate-limit";
import { buildWhatsAppUrl, normalizeWa } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type OrderFormState =
  | {
      ok?: false;
      error?: string;
      values?: { name: string; wa: string; details: string };
    }
  | { ok: true; orderCode: string; waUrl: string };

export async function submitOrder(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const wa = String(formData.get("wa") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "");
  const serviceName = String(formData.get("service_name") ?? "");
  const honeypot = String(formData.get("website") ?? "");
  const values = { name, wa, details };

  // Kolom jebakan untuk bot: manusia tidak melihat/mengisinya.
  if (honeypot) return { error: "Terjadi kesalahan, coba lagi.", values };

  if (name.length < 2 || name.length > 100) {
    return { error: "Nama harus 2 sampai 100 karakter.", values };
  }
  const normalizedWa = normalizeWa(wa);
  if (!/^62\d{8,13}$/.test(normalizedWa)) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890.", values };
  }
  if (details.length > 2000) {
    return { error: "Kebutuhan maksimal 2000 karakter.", values };
  }

  // Maksimal 5 order per IP dalam 10 menit.
  const ip = await getClientIp();
  const limited = rateLimit(`order:ip:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return { error: waitMessage(limited.retryAfterSec), values };
  }

  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("name")
    .eq("id", serviceId)
    .eq("is_active", true)
    .maybeSingle();
  const { data: code, error } = await supabase.rpc("create_order", {
    p_customer_name: name,
    p_customer_wa: normalizedWa,
    p_service_id: serviceId,
    p_details: details || null,
  });

  if (error || !code) {
    return {
      error: "Pesanan belum bisa disimpan. Coba lagi sebentar lagi.",
      values,
    };
  }

  // Jalankan sesudah response, agar Resend tidak menunda redirect pelanggan.
  // sendOrderNotification menangani sendiri error dan konfigurasi yang kosong.
  let notificationEmail: string | null = null;
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_notification_email")
      .maybeSingle();
    notificationEmail = data?.value || null;
  } catch (error) {
    console.error("[order] Gagal membaca email admin dari pengaturan:", error);
  }

  after(() =>
    sendOrderNotification({
      code,
      customerName: name,
      customerWa: normalizedWa,
      serviceName: service?.name ?? serviceName,
      details: details || null,
      notificationEmail,
    }),
  );

  let adminWa = "6281234567890";
  try {
    adminWa = await getAdminWa();
  } catch (error) {
    console.error("[order] Gagal mengambil nomor WA admin, gunakan fallback:", error);
  }
  const lines = [
    "Halo JoyVer, saya ingin memesan:",
    `Layanan: ${serviceName}`,
    `Kode order: ${code}`,
    `Nama: ${name}`,
    details ? `Kebutuhan: ${details}` : null,
  ].filter(Boolean);

  return {
    ok: true,
    orderCode: code,
    waUrl: buildWhatsAppUrl(adminWa, lines.join("\n")),
  };
}
