"use server";

import { redirect } from "next/navigation";
import { getAdminWa } from "@/lib/data";
import { buildWhatsAppUrl, normalizeWa } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type OrderFormState = {
  error?: string;
  values?: { name: string; wa: string; details: string };
};

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

  const supabase = await createClient();
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

  const adminWa = await getAdminWa();
  const lines = [
    "Halo JoyVer, saya ingin memesan:",
    `Layanan: ${serviceName}`,
    `Kode order: ${code}`,
    `Nama: ${name}`,
    details ? `Kebutuhan: ${details}` : null,
  ].filter(Boolean);

  redirect(buildWhatsAppUrl(adminWa, lines.join("\n")));
}
