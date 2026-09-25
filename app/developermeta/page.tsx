import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Komponen Mockup untuk Tampilan Browser ---
const MockupWindow = ({ children, src, alt }: { children?: React.ReactNode; src: string; alt: string }) => (
  <div className="rounded-lg border border-border bg-deep overflow-hidden shadow-xl mt-6">
    <div className="flex items-center gap-2 border-b border-border bg-void px-4 py-2">
      <div className="h-3 w-3 rounded-full bg-red-500"></div>
      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
      <span className="ml-2 text-xs text-muted-text font-mono">developers.facebook.com</span>
    </div>
    <div className="p-2 bg-void">
      {/* Menggunakan tag img standar. Jika menggunakan next/image, sesuaikan dengan dimensi asli */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto rounded-md border border-border/50"
      />
    </div>
  </div>
);

export default function WhatsAppTutorialPage() {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      {/* ───────────────────────── HEADER ───────────────────────── */}
      <header className="border-b border-border bg-void sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-heading">Whatsapp Official Management</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/tutorial" className="hidden text-sm font-medium text-subtle hover:text-heading sm:block">
              Setup
            </Link>
            <Link href="/login" className="text-sm font-medium text-subtle hover:text-heading">
              Sign in
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="relative overflow-hidden py-20 sm:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
                <Zap className="h-3 w-3" />
                Panduan Integrasi Meta
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl">
                Cara Mendaftar WhatsApp Business API Official
              </h1>
              <p className="mt-6 text-lg text-subtle leading-relaxed">
                Ikuti panduan langkah demi langkah untuk membuat aplikasi di Meta for Developers
                dan menghubungkannya dengan sistem Whatsapp Official Management Anda.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────────────── TUTORIAL STEPS ───────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            {/* STEP 1 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-border bg-void text-primary font-bold text-lg">
                1
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Membuat Aplikasi Baru</h3>
                <p className="text-subtle mb-4">
                  Buka <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Meta for Developers</a>, lalu klik tombol "Buat Aplikasi". Akan muncul popup pemberitahuan sistem baru, klik "Buat aplikasi". Isi nama aplikasi (misal: InsanTech) dan email kontak aplikasi Anda.
                </p>
                <div className="space-y-4">
                  <MockupWindow src="/1.webp" alt="Popup Pemberitahuan Sistem Baru" />
                  <MockupWindow src="/2.webp" alt="Form Buat Aplikasi" />
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                2
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Tambahkan Kasus Penggunaan</h3>
                <p className="text-subtle mb-4">
                  Pilih kasus penggunaan yang sesuai. Untuk integrasi WhatsApp, pilih opsi <strong>"Terhubung dengan pelanggan melalui WhatsApp"</strong>. Anda juga bisa memilih opsi lain yang sesuai dengan kebutuhan bisnis Anda, lalu klik "Berikutnya".
                </p>
                <MockupWindow src="/3.webp" alt="Pilih Kasus Penggunaan" />
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                3
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Hubungkan Portofolio Bisnis</h3>
                <p className="text-subtle mb-4">
                  Hubungkan portofolio bisnis Anda. Jika Anda belum memilikinya, Anda bisa membuatnya terlebih dahulu di Business Manager. Jika sudah ada, pilih dari dropdown yang tersedia.
                </p>
                <MockupWindow src="/4.webp" alt="Pilih Portofolio Bisnis" />
              </div>
            </div>

            {/* STEP 4 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                4
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Persyaratan & Gambaran Umum</h3>
                <p className="text-subtle mb-4">
                  Tinjau persyaratan penerbitan (biasanya kosong untuk tahap awal). Selanjutnya, Anda akan melihat gambaran umum aplikasi yang akan dibuat. Pastikan semua data sudah benar, setujui Ketentuan Platform Meta, dan klik "Berikutnya".
                </p>
                <div className="space-y-4">
                  <MockupWindow src="/5.webp" alt="Persyaratan Penerbitan" />
                  <MockupWindow src="/6.webp" alt="Gambaran Umum Aplikasi" />
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                5
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Akses Dasbor Aplikasi</h3>
                <p className="text-subtle mb-4">
                  Setelah aplikasi berhasil dibuat, Anda akan diarahkan ke halaman Dasbor Aplikasi. Pilih aplikasi yang baru saja Anda buat (misal: InsanTech) untuk masuk ke dalam menu pengaturan.
                </p>
                <MockupWindow src="/7.webp" alt="Dasbor Aplikasi Saya" />
              </div>
            </div>

            {/* STEP 6 */}
            <div className="relative flex gap-6 pb-12">
              <div className="absolute left-6 top-10 h-full w-px bg-border"></div>
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                6
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Sesuaikan Kasus Penggunaan WhatsApp</h3>
                <p className="text-subtle mb-4">
                  Di dalam dasbor, masuk ke menu <strong>WhatsApp &gt; Sesuaikan</strong>. Pilih "Hubungkan di WhatsApp" dari menu dropdown. Tinjau ringkasan yang muncul dan klik "Lanjutkan".
                </p>
                <MockupWindow src="/8.webp" alt="Sesuaikan Kasus Penggunaan WhatsApp" />
              </div>
            </div>

            {/* STEP 7 */}
            <div className="relative flex gap-6 pb-12">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-void text-subtle font-bold text-lg">
                7
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-heading mb-2">Uji Coba API (Testing)</h3>
                <p className="text-subtle mb-4">
                  Anda akan mendapatkan <strong>Nomor telepon uji</strong>. Untuk menguji coba, Anda perlu membuat <strong>Token akses</strong>, menambahkan <strong>Nomor telepon penerima</strong>, dan menggunakan contoh perintah <code>cURL</code> yang disediakan untuk mengirim pesan uji.
                </p>
                <div className="space-y-4">
                  <MockupWindow src="/9.webp" alt="Langkah 1 Cobalah - Setup Awal" />
                  <MockupWindow src="/10.webp" alt="Kirim Pesan Uji Coba" />
                  <MockupWindow src="/11.webp" alt="Popup Tambah Nomor Penerima" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ───────────────────────── CTA AKHIR ───────────────────────── */}
        <section className="py-24 border-t border-border bg-deep/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="card text-center max-w-3xl mx-auto border-border bg-deep">
              <h2 className="text-3xl font-extrabold text-heading">Siap untuk memulai?</h2>
              <p className="mx-auto mt-4 max-w-lg text-subtle">
                Bergabunglah dengan ribuan bisnis yang menggunakan Whatsapp Official Management untuk mengelola komunikasi WhatsApp Business mereka.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Buat Akun Gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tutorial">
                  <Button variant="secondary" size="lg">
                    Lihat Tutorial Lainnya
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}