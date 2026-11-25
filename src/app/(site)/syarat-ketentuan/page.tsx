import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat pemesanan dan penggunaan layanan JoyVer.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-semibold tracking-widest text-clover-green uppercase">Informasi Layanan</p>
      <h1 className="mt-2 text-4xl font-semibold">Syarat & Ketentuan</h1>
      <p className="mt-3 text-sm text-ink/60">Terakhir diperbarui: 25 November 2026</p>

      <div className="mt-8 space-y-7 text-ink/85">
        <section>
          <h2 className="text-xl font-semibold">1. Pemesanan dan kesepakatan</h2>
          <p className="mt-2">
            Form di website adalah permintaan awal, bukan konfirmasi bahwa pesanan
            sudah diterima. Pesanan dianggap disepakati setelah pelanggan dan JoyVer
            mengonfirmasi ruang lingkup, harga final, jadwal, dan hal penting lainnya
            melalui WhatsApp.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Harga dan pembayaran</h2>
          <p className="mt-2">
            Harga katalog merupakan harga mulai dari dan dapat berubah sesuai
            kebutuhan, bahan, tingkat kesulitan, serta ruang lingkup pekerjaan.
            Metode, jadwal, dan ketentuan pembayaran disepakati melalui WhatsApp
            sebelum pekerjaan dimulai. Website JoyVer saat ini tidak memproses
            pembayaran secara langsung.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Pengerjaan dan revisi</h2>
          <p className="mt-2">
            Jadwal pengerjaan, bahan atau informasi yang perlu disediakan pelanggan,
            jumlah revisi, dan bentuk hasil akhir ditentukan saat kesepakatan dibuat.
            Perubahan permintaan di luar kesepakatan awal dapat memengaruhi harga
            dan waktu pengerjaan.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Pembatalan dan pengembalian dana</h2>
          <p className="mt-2">
            Ketentuan pembatalan dan pengembalian dana dibicarakan dan disepakati
            sebelum pembayaran. Jika pesanan dibatalkan setelah pekerjaan atau
            pengadaan bahan dimulai, penyelesaian biaya mengikuti kesepakatan
            berdasarkan pekerjaan dan biaya yang sudah dikeluarkan.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Penggunaan layanan yang bertanggung jawab</h2>
          <p className="mt-2">
            JoyVer hanya menawarkan layanan yang legal dan tidak menerima permintaan
            yang melanggar hukum, hak pihak lain, aturan akademik, atau ketentuan
            platform. JoyVer dapat menolak atau menghentikan permintaan yang tidak
            sesuai.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">6. Kontak dan perubahan</h2>
          <p className="mt-2">
            Pertanyaan atau perubahan pesanan disampaikan melalui WhatsApp resmi
            JoyVer. Syarat ini dapat diperbarui; versi yang berlaku adalah yang
            ditampilkan di halaman ini.
          </p>
        </section>
      </div>
    </main>
  );
}
