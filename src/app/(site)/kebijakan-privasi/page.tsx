import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Cara JoyVer menggunakan dan melindungi informasi pelanggan.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-semibold tracking-widest text-clover-green uppercase">Perlindungan Data</p>
      <h1 className="mt-2 text-4xl font-semibold">Kebijakan Privasi</h1>
      <p className="mt-3 text-sm text-ink/60">Terakhir diperbarui: 25 November 2026</p>

      <div className="mt-8 space-y-7 text-ink/85">
        <section>
          <h2 className="text-xl font-semibold">1. Informasi yang kami kumpulkan</h2>
          <p className="mt-2">
            Saat Anda mengirim permintaan order, kami menerima nama, nomor WhatsApp,
            layanan yang dipilih, dan detail kebutuhan yang Anda tulis. Jika Anda
            mengirim testimoni, kami menyimpan rating dan isi ulasan. Data teknis
            minimum seperti alamat IP dapat dipakai sementara untuk membatasi spam.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Penggunaan informasi</h2>
          <p className="mt-2">
            Informasi digunakan untuk menghubungi Anda, membahas dan mengelola
            pesanan, memberi kabar progres, mengirim notifikasi order kepada admin,
            mencegah penyalahgunaan form, serta menampilkan testimoni yang telah
            disetujui.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. Penyimpanan dan penyedia layanan</h2>
          <p className="mt-2">
            Data order disimpan di Supabase. Notifikasi email admin dikirim melalui
            Resend. Penyedia tersebut memproses data yang diperlukan untuk
            menjalankan layanannya sesuai kebijakan masing-masing. Kami tidak
            menyimpan kata sandi akun pihak lain, kredensial game, atau informasi
            sensitif yang tidak diperlukan untuk pesanan.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Akses dan pengungkapan</h2>
          <p className="mt-2">
            Akses ke data order dibatasi untuk admin JoyVer yang mengelolanya.
            Kami tidak menjual data pribadi. Informasi dapat diungkapkan jika
            diwajibkan hukum atau diperlukan untuk melindungi hak dan keamanan.
            Testimoni hanya ditampilkan setelah persetujuan admin.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Retensi dan permintaan</h2>
          <p className="mt-2">
            Data disimpan selama diperlukan untuk mengelola pesanan dan kewajiban
            terkait, lalu dapat dihapus atau dianonimkan. Untuk meminta akses,
            koreksi, atau penghapusan data, hubungi JoyVer melalui WhatsApp resmi
            dengan menyertakan kode order jika tersedia. Permintaan dapat dibatasi
            jika ada kewajiban hukum atau kebutuhan penyelesaian transaksi.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">6. Pembaruan kebijakan</h2>
          <p className="mt-2">
            Kebijakan ini dapat diperbarui ketika layanan atau proses data berubah.
            Perubahan akan dipublikasikan di halaman ini.
          </p>
        </section>
      </div>
    </main>
  );
}
