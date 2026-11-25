import { Resend } from "resend";

type OrderNotification = {
  code: string;
  customerName: string;
  customerWa: string;
  serviceName: string;
  details: string | null;
  notificationEmail?: string | null;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

/**
 * Kirim pemberitahuan order baru. Fungsi sengaja fail-safe: konfigurasi
 * kosong atau API Resend gagal tidak pernah melempar ke pemanggil.
 */
export async function sendOrderNotification(order: OrderNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = order.notificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey || !from || !to || !siteUrl) {
    console.info("[email] Notifikasi dilewati: konfigurasi Resend belum lengkap.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const orderUrl = new URL(`/admin/orders/${encodeURIComponent(order.code)}`, siteUrl).toString();
    const safe = {
      code: escapeHtml(order.code),
      customerName: escapeHtml(order.customerName),
      customerWa: escapeHtml(order.customerWa),
      serviceName: escapeHtml(order.serviceName),
      details: escapeHtml(order.details || "Tidak ada detail tambahan."),
    };

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Order baru ${order.code} — JoyVer`,
      text: [
        `Order baru: ${order.code}`,
        `Nama pelanggan: ${order.customerName}`,
        `Nomor WhatsApp: +${order.customerWa}`,
        `Layanan: ${order.serviceName}`,
        `Detail kebutuhan: ${order.details || "Tidak ada detail tambahan."}`,
        `Buka order di admin: ${orderUrl}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#12261b;max-width:600px;margin:auto">
          <div style="background:#0B6B3A;color:#FAF9F6;padding:24px;border-radius:16px 16px 0 0">
            <p style="margin:0;color:#FFC83D;font-size:13px;font-weight:bold;letter-spacing:2px">JOYVER · ORDER BARU</p>
            <h1 style="margin:8px 0 0;font-size:28px">${safe.code}</h1>
          </div>
          <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;color:#667085;width:150px">Nama pelanggan</td><td style="padding:10px 0;font-weight:bold">${safe.customerName}</td></tr>
              <tr><td style="padding:10px 0;color:#667085">WhatsApp</td><td style="padding:10px 0"><a href="https://wa.me/${safe.customerWa}" style="color:#0B6B3A">+${safe.customerWa}</a></td></tr>
              <tr><td style="padding:10px 0;color:#667085">Layanan</td><td style="padding:10px 0;font-weight:bold">${safe.serviceName}</td></tr>
              <tr><td style="padding:10px 0;color:#667085;vertical-align:top">Detail kebutuhan</td><td style="padding:10px 0;white-space:pre-wrap">${safe.details}</td></tr>
            </table>
            <a href="${escapeHtml(orderUrl)}" style="display:inline-block;margin-top:18px;background:#FFC83D;color:#0B6B3A;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px">Buka detail order</a>
          </div>
        </div>
      `,
    });

    if (error) console.error("[email] Resend gagal mengirim notifikasi order:", error.message);
  } catch (error) {
    console.error("[email] Gagal mengirim notifikasi order:", error);
  }
}
