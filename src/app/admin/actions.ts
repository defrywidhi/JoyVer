"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, slugify, uploadImage } from "@/lib/admin";
import { getClientIp, rateLimit, waitMessage } from "@/lib/rate-limit";
import { ORDER_STATUS_LABEL } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optStr = (fd: FormData, key: string) => str(fd, key) || null;
const num = (fd: FormData, key: string, fallback = 0) => {
  const v = Number(str(fd, key));
  return Number.isFinite(v) ? v : fallback;
};
const msg = (e: unknown) => (e instanceof Error ? e.message : "Terjadi kesalahan.");

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Email dan password wajib diisi." };

  const ip = await getClientIp();
  const limited = rateLimit(`login:ip:${ip}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return { error: waitMessage(limited.retryAfterSec) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau password salah." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun ini bukan admin." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------
// Order
// ---------------------------------------------------------------

export async function updateOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status");
  if (!(status in ORDER_STATUS_LABEL)) return { error: "Status tidak valid." };

  const priceRaw = str(fd, "final_price");
  const finalPrice = priceRaw === "" ? null : Number(priceRaw);
  if (finalPrice !== null && (!Number.isFinite(finalPrice) || finalPrice < 0)) {
    return { error: "Harga final tidak valid." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      final_price: finalPrice,
      assigned_to: optStr(fd, "assigned_to"),
      admin_notes: optStr(fd, "admin_notes"),
    })
    .eq("id", id);
  if (error) return { error: "Gagal menyimpan order." };

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: "Order diperbarui." };
}

export async function addOrderUpdate(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const orderId = str(fd, "order_id");
  const note = optStr(fd, "note");
  const linkUrl = optStr(fd, "link_url");

  if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
    return { error: "Tautan harus diawali http:// atau https://" };
  }

  try {
    const imageUrl = await uploadImage(supabase, "progress-photos", fd.get("image"));
    if (!note && !linkUrl && !imageUrl) {
      return { error: "Isi catatan, tautan, atau foto." };
    }
    const { error } = await supabase.from("order_updates").insert({
      order_id: orderId,
      note,
      link_url: linkUrl,
      image_url: imageUrl,
      is_visible_to_customer: fd.get("visible") === "on",
    });
    if (error) return { error: "Gagal menambah progres." };
  } catch (e) {
    return { error: msg(e) };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: "Progres ditambahkan." };
}

export async function deleteOrderUpdate(fd: FormData) {
  const { supabase } = await requireAdmin();
  const orderId = str(fd, "order_id");
  await supabase.from("order_updates").delete().eq("id", str(fd, "id"));
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteOrder(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("orders").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

// ---------------------------------------------------------------
// Kategori
// ---------------------------------------------------------------

export async function saveCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return { error: "Nama wajib diisi." };

  const row = {
    name,
    slug: slugify(str(fd, "slug") || name),
    description: optStr(fd, "description"),
    sort_order: num(fd, "sort_order"),
    is_active: fd.get("is_active") === "on",
  };
  if (!row.slug) return { error: "Slug tidak valid." };

  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) {
    return {
      error: error.code === "23505" ? "Slug sudah dipakai." : "Gagal menyimpan kategori.",
    };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/", "layout");
  return { success: "Tersimpan." };
}

export async function deleteCategory(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("categories").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/kategori");
}

// ---------------------------------------------------------------
// Layanan
// ---------------------------------------------------------------

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const categoryId = str(fd, "category_id");
  const price = num(fd, "price_from", -1);

  if (!name) return { error: "Nama wajib diisi." };
  if (!categoryId) return { error: "Pilih kategori." };
  if (price < 0) return { error: "Harga awal tidak valid." };

  try {
    const uploaded = await uploadImage(supabase, "service-images", fd.get("image"));
    const row = {
      category_id: categoryId,
      name,
      slug: slugify(str(fd, "slug") || name),
      short_description: optStr(fd, "short_description"),
      description: optStr(fd, "description"),
      price_from: price,
      image_url: uploaded ?? optStr(fd, "current_image"),
      sort_order: num(fd, "sort_order"),
      is_active: fd.get("is_active") === "on",
    };
    if (!row.slug) return { error: "Slug tidak valid." };

    const { error } = id
      ? await supabase.from("services").update(row).eq("id", id)
      : await supabase.from("services").insert(row);
    if (error) {
      return {
        error: error.code === "23505" ? "Slug sudah dipakai." : "Gagal menyimpan layanan.",
      };
    }
  } catch (e) {
    return { error: msg(e) };
  }

  revalidatePath("/", "layout");
  redirect("/admin/layanan");
}

export async function deleteService(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/layanan");
  if (error) redirect("/admin/layanan?error=dipakai");
}

// ---------------------------------------------------------------
// Tim
// ---------------------------------------------------------------

export async function saveTeamMember(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return { error: "Nama wajib diisi." };

  const skills = str(fd, "skills")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const uploaded = await uploadImage(supabase, "team-photos", fd.get("photo"));
    const row = {
      name,
      role_title: optStr(fd, "role_title"),
      bio: optStr(fd, "bio"),
      skills,
      photo_url: uploaded ?? optStr(fd, "current_photo"),
      sort_order: num(fd, "sort_order"),
      is_active: fd.get("is_active") === "on",
    };
    const { error } = id
      ? await supabase.from("team_members").update(row).eq("id", id)
      : await supabase.from("team_members").insert(row);
    if (error) return { error: "Gagal menyimpan anggota tim." };
  } catch (e) {
    return { error: msg(e) };
  }

  revalidatePath("/", "layout");
  redirect("/admin/tim");
}

export async function deleteTeamMember(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("team_members").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/tim");
}

// ---------------------------------------------------------------
// Testimoni
// ---------------------------------------------------------------

export async function setTestimonialApproval(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("testimonials")
    .update({ is_approved: str(fd, "approve") === "1" })
    .eq("id", str(fd, "id"));
  revalidatePath("/admin/testimoni");
  revalidatePath("/", "layout");
}

export async function deleteTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/testimoni");
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------
// Pengaturan
// ---------------------------------------------------------------

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const wa = str(fd, "admin_wa").replace(/\D/g, "");
  const normalized = wa.startsWith("0") ? "62" + wa.slice(1) : wa.startsWith("8") ? "62" + wa : wa;
  if (!/^62\d{8,13}$/.test(normalized)) {
    return { error: "Nomor WhatsApp tidak valid. Contoh: 081234567890." };
  }
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "admin_wa", value: normalized });
  if (error) return { error: "Gagal menyimpan pengaturan." };

  revalidatePath("/", "layout");
  return { success: "Pengaturan tersimpan." };
}
