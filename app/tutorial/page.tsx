"use client";

import Link from "next/link";
import "@/app/globals.css";
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Building2,
  Smartphone,
  Phone,
  FileText,
  Globe,
  KeyRound,
  UserCheck,
  Webhook,
  Rocket,
  Lightbulb,
  AlertTriangle,
  Timer,
  Layers,
  Lock,
  ChevronDown,
  Store,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Figure,
  IllusMetaAccount,
  IllusBusinessInfo,
  IllusNewNumber,
  IllusOtpAccess,
  IllusDocuments,
  IllusWebsite,
  IllusConnectButton,
  IllusFacebookAuth,
  IllusVerifyNumber,
  IllusWebhook,
  IllusConnected,
} from "@/components/tutorial/illustrations";

/* ================================================================
   DATA
=============================================================== */

const persiapan = [
  {
    icon: UserCheck,
    title: "Akun Meta & akses admin",
    desc: "Anda butuh akun Facebook pribadi yang aktif dan berstatus admin di Meta Business Manager perusahaan.",
    steps: [
      "Buka <strong>business.facebook.com</strong>, login dengan akun Facebook Anda.",
      'Belum punya Business Manager? Klik "Buat Akun" — gratis.',
      "Cek menu Pengguna → pastikan nama Anda ada di daftar Admin.",
    ],
    links: [
      { url: "https://business.facebook.com", label: "👉 Business Manager" },
      { url: "https://developers.facebook.com/docs/whatsapp/business-management-api/get-started", label: "Panduan buat Business Manager" },
    ],
    illustration: <IllusMetaAccount />,
    caption: "Tampilan Meta Business Manager saat Anda sudah jadi Admin",
  },
  {
    icon: Building2,
    title: "Informasi bisnis yang lengkap",
    desc: "Nama legal bisnis, alamat, email bisnis, dan website. Data ini dipakai Meta untuk memverifikasi bahwa bisnis Anda nyata.",
    steps: [
      "Tulis nama bisnis sama persis dengan dokumen legal (PT/CV/UD).",
      "Gunakan email domain perusahaan bila ada, jangan email pribadi.",
      "Selesaikan Business Verification di Meta Business Manager.",
    ],
    links: [
      { url: "https://business.facebook.com/settings", label: "👉 Pengaturan Bisnis" },
      { url: "https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#business-verification", label: "Panduan Business Verification" },
    ],
    illustration: <IllusBusinessInfo />,
    caption: "Formulir data bisnis yang perlu diisi di Meta",
  },
  {
    icon: Smartphone,
    title: "Nomor WhatsApp khusus",
    desc: "Satu nomor telepon yang BELUM pernah dipakai di aplikasi WhatsApp maupun WhatsApp Business.",
    steps: [
      "Kalau nomor lama sudah dipakai WhatsApp, hapus akun WhatsApp-nya dulu.",
      "Bisa pakai nomor baru, nomor virtual, atau nomor kantor (fixed line).",
      "Pastikan nomor bisa menerima SMS atau telepon masuk.",
    ],
    links: [
      { url: "https://www.whatsapp.com/business/managemanage", label: "Info nomor WhatsApp Business" },
    ],
    illustration: <IllusNewNumber />,
    caption: "Nomor ini belum terpasang di aplikasi WhatsApp mana pun",
  },
  {
    icon: Phone,
    title: "Akses verifikasi OTP",
    desc: "Anda harus bisa menerima SMS atau panggilan telepon ke nomor tersebut untuk mengambil kode verifikasi dari Meta.",
    steps: [
      "Siapkan HP yang memegang nomor tersebut saat proses pendaftaran.",
      "Jangan tinggalkan halaman — kode biasanya berlaku hanya beberapa menit.",
      "Kalau SMS tidak masuk, pilih opsi verifikasi lewat panggilan suara.",
    ],
    links: [],
    illustration: <IllusOtpAccess />,
    caption: "Kode OTP 6 digit dikirim Meta untuk memverifikasi nomor",
  },
  {
    icon: FileText,
    title: "Dokumen bisnis (opsional)",
    desc: "Dokumen legal seperti akta perusahaan, NIB, atau NPWP. Tidak selalu diminta, tapi siapkan agar proses review lancar.",
    steps: [
      "Siapkan scan/foto dokumen yang jelas dan tidak terpotong.",
      "Nama di dokumen harus sama dengan nama bisnis di Meta.",
      "Dokumen diperlukan jika Meta meminta Business Verification.",
    ],
    links: [
      { url: "https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#business-verification", label: "Syarat verifikasi bisnis Meta" },
    ],
    illustration: <IllusDocuments />,
    caption: "Dokumen yang biasanya diminta Meta",
  },
  {
    icon: Globe,
    title: "Website bisnis yang aktif",
    desc: "Website mempercepat persetujuan dan menaikkan kredibilitas di mata Meta. Ini sangat membantu proses review.",
    steps: [
      "Pastikan website menampilkan nama bisnis yang jelas.",
      "Cantumkan kontak dan alamat yang sama dengan data di Meta.",
      "Belum punya website? Halaman profil media sosial resmi juga membantu.",
    ],
    links: [],
    illustration: <IllusWebsite />,
    caption: "Website sederhana pun cukup, yang penting aktif",
  },
];

const checklist = [
  "Akun Facebook aktif & terdaftar sebagai Admin",
  "Meta Business Manager sudah dibuat",
  "Nama, alamat & email bisnis sudah siap",
  "Nomor telepon baru yang belum dipakai WhatsApp",
  "HP siap menerima SMS / panggilan kode OTP",
  "Dokumen legal bisnis (NIB / NPWP / akta)",
  "Website atau media sosial bisnis yang aktif",
  "Waktu luang ± 15–30 menit tanpa gangguan",
];

const langkah = [
  {
    title: "Masuk ke menu WhatsApp di dashboard",
    desc: "Setelah login, lihat sidebar di sebelah kiri layar. Klik menu \"WhatsApp\" — Anda akan dibawa ke halaman pengaturan koneksi WhatsApp Anda, yang saat ini masih kosong.",
    note: "Menu WhatsApp ini adalah pintu utama semua aktivitas koneksi dan percakapan.",
    illustration: <IllusConnectButton />,
    caption: "Menu WhatsApp di sidebar dashboard Whatsapp Official Management",
    links: [{ url: "/dashboard/whatsapp", label: "👉 Buka halaman WhatsApp" }],
  },
  {
    title: "Klik tombol Connect Account",
    desc: "Di halaman WhatsApp, tekan tombol biru \"Connect Account\" di pojok kanan atas. Sebuah jendela popup resmi milik Meta (Embedded Signup) akan terbuka di layar Anda.",
    note: "Popup ini berasal dari Meta, bukan Whatsapp Official Management — jadi password Anda aman 100%.",
    illustration: <IllusConnectButton />,
    caption: "Tombol Connect Account di halaman WhatsApp dashboard",
    links: [],
  },
  {
    title: "Login Facebook & pilih Business Account",
    desc: "Di dalam popup Meta, masukkan akun Facebook Anda. Pilih Business Account yang ingin dipakai untuk WhatsApp Business, atau buat baru lewat wizard Meta.",
    note: "Ini langkah pertama yang dilakukan di sisi Meta, langsung di popup resmi mereka.",
    illustration: <IllusFacebookAuth />,
    caption: "Dialog login Facebook & pilihan Business Account",
    links: [{ url: "https://business.facebook.com", label: "👉 Buka Business Manager" }],
  },
  {
    title: "Lengkapi data bisnis di wizard Meta",
    desc: "Isi formulir bisnis sesuai arahan: nama perusahaan, deskripsi, kategori bisnis, alamat, dan website. Meta membutuhkan data ini untuk verifikasi identitas bisnis Anda.",
    note: "Semua data ini akan ditampilkan oleh Meta di template pesan kepada pelanggan Anda.",
    illustration: <IllusBusinessInfo />,
    caption: "Wizard pengisian data bisnis Meta Embedded Signup",
    links: [],
  },
  {
    title: "Daftarkan nomor telepon",
    desc: "Masukkan nomor WhatsApp yang ingin dihubungkan. Meta akan mengirim kode OTP melalui SMS atau panggilan suara ke nomor tersebut.",
    note: "Gunakan nomor yang masih aktif bisa menerima SMS. Nomor lama yang sudah pakai WhatsApp harus dihapus dulu di HP.",
    illustration: <IllusVerifyNumber />,
    caption: "Form input nomor telepon + OTP verification",
    links: [{ url: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#set-up-a-phone-number", label: "👉 Panduan verifikasi nomor Meta" }],
  },
  {
    title: "Verifikasi OTP & selesaikan setup",
    desc: "Masukkan kode 6 digit yang diterima. Setelah itu, WABA (WhatsApp Business Account) Anda otomatis terdaftar dan terhubung.",
    note: "Tidak ada konfigurasi server yang perlu dilakukan — webhook dan token disetel otomatis.",
    illustration: <IllusOtpAccess />,
    caption: "Input kode OTP untuk verifikasi nomor",
    links: [],
  },
  {
    title: "Webhook aktif — pesan masuk terdeteksi",
    desc: "Secara otomatis, webhook Anda sudah terdaftar di Meta. Setiap pesan masuk dari pelanggan akan diteruskan ke dashboard Whatsapp Official Management dalam hitungan detik.",
    note: "Inilah bagian paling teknis yang kami urus sepenuhnya untuk Anda.",
    illustration: <IllusWebhook />,
    caption: "Koneksi webhook disetel otomatis oleh sistem",
    links: [{ url: "https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks", label: "👉 Dokumentasi webhook Meta" }],
  },
  {
    title: "WhatsApp Connected — siap digunakan!",
    desc: "Nomor Anda kini tampil di halaman WhatsApp dengan status Connected. Sekarang Anda bisa mulai melakukan percakapan, membuat template pesan, dan mengelola kontak pelanggan.",
    note: "Anda punya jendela 24 jam untuk membalas pesan masuk secara gratis sebelum masuk ke kategori template berbayar.",
    illustration: <IllusConnected />,
    caption: "Status Connected di halaman WhatsApp dashboard",
    links: [],
  },
];

/* Fitur yang tersedia setelah terhubung */
const fiturSetelahConnected = [
  {
    href: "/dashboard/whatsapp",
    icon: MessageCircle,
    title: "WhatsApp Dashboard",
    desc: "Kelola semua koneksi nomor WhatsApp, cek status, dan putuskan koneksi jika diperlukan.",
  },
  {
    href: "/dashboard/conversations",
    icon: MessageSquare,
    title: "Conversations",
    desc: "Lihat semua percakapan dengan pelanggan, balas pesan, dan lacak riwayat obrolan.",
  },
  {
    href: "/dashboard/templates",
    icon: FileText,
    title: "Templates",
    desc: "Buat template pesan persetujuan Meta untuk komunikasi di luar jendela 24 jam.",
  },
  {
    href: "/dashboard/contacts",
    icon: Users,
    title: "Contacts",
    desc: "Kelola daftar kontak pelanggan dan riwayat interaksi mereka.",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    title: "Settings",
    desc: "Pengaturan akun, tim, billing, dan preferensi notifikasi.",
  },
  {
    href: "/",
    icon: LayoutDashboard,
    title: "Dashboard Utama",
    desc: "Overview ringkas: statistik pesan, aktivitas terbaru, dan quick actions.",
  },
];

const faq = [
  {
    q: "Saya tidak paham teknologi. Apakah ini sulit?",
    a: "Tidak. Seluruh proses berjalan lewat tampilan yang diklik seperti mengisi formulir biasa. Meta yang memandu langkahnya, dan bagian paling teknis (webhook, token, endpoint) sudah kami urus otomatis. Anda hanya perlu menyiapkan data bisnis dan nomor telepon.",
  },
  {
    q: "Apakah nomor WhatsApp saya yang sekarang bisa dipakai?",
    a: "Bisa, tapi nomor tersebut harus \"dilepas\" dulu dari aplikasi WhatsApp atau WhatsApp Business di HP Anda. Setelah terhubung ke Cloud API, nomor itu tidak lagi dipakai lewat aplikasi HP — semua percakapan berpindah ke dashboard Whatsapp Official Management.",
  },
  {
    q: "Apakah password Facebook saya aman?",
    a: "Aman. Karena memakai Embedded Signup resmi Meta, Anda login langsung di halaman milik Facebook/Meta di dalam popup. Password Anda tidak pernah diketik di server kami dan tidak pernah kami simpan.",
  },
  {
    q: "Berapa lama prosesnya sampai bisa dipakai?",
    a: "Rata-rata 15–30 menit untuk pendaftaran akun, koneksi WABA, dan verifikasi nomor. Business Verification (jika diminta Meta) biasanya memerlukan 1–3 hari kerja.",
  },
  {
    q: "Bagaimana kalau nomor saya ditolak Meta?",
    a: "Biasanya karena nomor sudah pernah terdaftar di WhatsApp, nomor tidak bisa menerima SMS/telepon, atau data bisnis tidak konsisten. Cek kembali daftar persiapan di atas, lalu ulangi proses connect. Tim support kami siap membantu lewat menu bantuan di dashboard.",
  },
  {
    q: "Apakah riwayat chat lama saya ikut pindah?",
    a: "Tidak. Riwayat chat tetap tersimpan di perangkat Anda, tetapi tidak ikut tersinkron ke platform. Percakapan baru setelah nomor terhubung akan tercatat di dashboard Whatsapp Official Management.",
  },
];

/* ================================================================
   COMPONENT
=============================================================== */

export default function TutorialPage() {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      {/* ── Navbar ── */}
      <header className="border-b border-border bg-void">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-heading">Whatsapp Official Management</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/register"
              className="text-sm font-medium text-subtle hover:text-heading"
            >
              Daftar Gratis
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">
                Sign in
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero tutorial ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
            <KeyRound className="h-3 w-3" />
            Panduan Lengkap untuk Pemula
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl lg:text-5xl">
            Hubungkan WhatsApp Business{" "}
            <span className="text-primary">dalam hitungan menit</span>
          </h1>
          <p className="mt-6 text-subtle leading-relaxed sm:text-lg">
            Ikuti panduan langkah demi langkah dari dashboard Whatsapp Official Management. Mulai dari menu WhatsApp,
            klik Connect, hingga semua fitur yang bisa Anda gunakan setelah nomor terhubung.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
              <Timer className="h-3.5 w-3.5 text-primary" />
              ± 15–30 menit
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
              <Layers className="h-3.5 w-3.5 text-primary" />
              8 langkah
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Tanpa coding
            </span>
          </div>
        </div>
      </section>

      <main className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* ── Link Cepat ── */}
          <section className="mb-16">
            <div className="card">
              <h3 className="text-base font-bold text-heading mb-4">
                🔗 Link Penting & Halaman Aplikasi
              </h3>
              <p className="mb-4 text-sm text-muted-text">
                Klik salah satu di bawah untuk langsung menuju halaman yang dibutuhkan.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { url: "https://business.facebook.com", label: "Meta Business Manager", sub: "Setup bisnis & verifikasi" },
                  { url: "/dashboard/whatsapp", label: "WhatsApp Dashboard", sub: "Halaman koneksi utama" },
                  { url: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started", label: "Cloud API Docs", sub: "Dokumentasi resmi Meta" },
                  { url: "/dashboard/conversations", label: "Conversations", sub: "Percakapan dengan pelanggan" },
                  { url: "/dashboard/templates", label: "Templates", sub: "Template pesan persetujuan Meta" },
                  { url: "/dashboard/contacts", label: "Contacts", sub: "Daftar kontak pelanggan" },
                  { url: "https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks", label: "Webhook Docs", sub: "Panduan konfigurasi webhook" },
                  { url: "/dashboard/settings", label: "Settings", sub: "Pengaturan akun & tim" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target={l.url.startsWith("http") ? "_blank" : undefined}
                    rel={l.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary-border hover:bg-primary-bg"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
                    <div>
                      <p className="text-sm font-semibold text-heading">{l.label}</p>
                      <p className="text-xs text-muted-text">{l.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ── Kenalan dulu ── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                Apa bedanya WhatsApp biasa, Business App, dan Business API?
              </h2>
              <p className="mt-3 text-subtle leading-relaxed">
                Sebelum mulai, penting tahu posisi Anda. Ketiganya sering membingungkan.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Kartu 1 */}
              <div className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-void">
                    <MessageCircle className="h-5 w-5 text-muted-text" />
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-muted-text">
                    Gratis
                  </span>
                </div>
                <h3 className="text-base font-bold text-heading">WhatsApp biasa</h3>
                <p className="mt-1 text-xs text-muted-text">Cocok untuk ngobrol pribadi</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-text">
                  {[
                    "Satu nomor = satu HP",
                    "Tidak ada fitur bisnis",
                    "Tidak bisa diakses tim",
                    "Tidak bisa kirim pesan massal",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kartu 2 */}
              <div className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-void">
                    <Store className="h-5 w-5 text-muted-text" />
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-muted-text">
                    Gratis
                  </span>
                </div>
                <h3 className="text-base font-bold text-heading">WhatsApp Business App</h3>
                <p className="mt-1 text-xs text-muted-text">Cocok untuk UMKM / toko kecil</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-text">
                  {[
                    "Masih terikat 1 HP",
                    "Balas chat manual satu per satu",
                    "Belum bisa banyak admin",
                    "Katalog & pesan cepat sederhana",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kartu 3 — highlighted */}
              <div className="card border-primary-border bg-primary-bg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  <span className="rounded-full border border-primary-border bg-void px-3 py-1 text-[11px] font-semibold text-primary-dim">
                    Yang Anda pakai
                  </span>
                </div>
                <h3 className="text-base font-bold text-heading">
                  WhatsApp Business API{" "}
                  <span className="text-primary">via Whatsapp Official Management</span>
                </h3>
                <p className="mt-1 text-xs text-muted-text">Untuk bisnis yang serius</p>
                <ul className="mt-4 space-y-2 text-sm text-subtle">
                  {[
                    "Banyak admin, banyak nomor, satu dashboard",
                    "Template pesan & otomatisasi",
                    "Terhubung ke sistem / CRM Anda",
                    "Limit kirim hingga 100.000+ pesan per hari",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Analogi */}
            <div className="card mt-8 flex flex-col gap-4 border-primary-border sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-bg">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-heading">
                  Analogi sederhana biar gampang dibayangkan
                </h3>
                <p className="mt-2 text-sm text-muted-text leading-relaxed">
                  <strong className="text-heading">WhatsApp biasa</strong> itu seperti HP pribadi
                  Anda. <strong className="text-heading">WhatsApp Business App</strong> seperti HP
                  satu-satunya yang dipakai jaga toko — kalau Anda pergi, toko ikut tutup. Sedangkan{" "}
                  <strong className="text-heading">WhatsApp Business API</strong> seperti{" "}
                  <em>nomor kantor</em> dengan beberapa ekstensi: siapa pun dari tim bisa mengangkat,
                  ada sistem pencatatan otomatis, dan nomornya tidak menempel di satu HP saja.
                </p>
              </div>
            </div>
          </section>

          {/* ── Langkah 1: Persiapan ── */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <span className="rounded-full border border-primary-border bg-primary-bg px-3 py-1 text-xs font-semibold text-primary-dim">
                Langkah 1 dari 2
              </span>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                Yang perlu Anda siapkan
              </h2>
              <p className="mt-3 text-subtle leading-relaxed">
                Ada 6 hal yang harus siap sebelum mulai. Tidak semuanya wajib di hari pertama —
                tapi semakin lengkap, semakin cepat prosesnya selesai.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {persiapan.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Kiri: teks + link */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-bg">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="text-sm font-bold text-heading">{item.title}</h3>
                        </div>
                        <p className="mb-3 text-xs text-muted-text leading-relaxed">{item.desc}</p>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary-dim">
                          Cara menyiapkan
                        </p>
                        <ul className="mb-3 space-y-1.5 text-xs text-muted-text">
                          {item.steps.map((s) => (
                            <li key={s} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                              <span className="leading-snug">{s}</span>
                            </li>
                          ))}
                        </ul>
                        {item.links.length > 0 && (
                          <div className="mt-3 border-t border-border pt-3">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary-dim">
                              Link Pendukung
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.links.map((l) => (
                                <a
                                  key={l.url}
                                  href={l.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-md border border-border bg-void px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50"
                                >
                                  <span>{l.label}</span>
                                  <ArrowRight className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Kanan: ilustrasi */}
                      <div className="sm:w-[200px] shrink-0 flex items-center justify-center">
                        <Figure caption={item.caption}>{item.illustration}</Figure>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Langkah 2: Integrasi ── */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <span className="rounded-full border border-primary-border bg-primary-bg px-3 py-1 text-xs font-semibold text-primary-dim">
                Langkah 2 dari 2
              </span>
            </div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                Prosedur integrasi, satu per satu
              </h2>
              <p className="mt-3 text-subtle leading-relaxed">
                Ikuti urutan berikut dari dashboard Whatsapp Official Management Anda. Setiap langkah disertai
                link ke halaman relevan agar Anda bisa langsung mencobanya.
              </p>
            </div>

            <div>
              {langkah.map((step, i) => (
                <div key={step.title} className="flex gap-4 sm:gap-6">
                  {/* Nomor langkah + garis */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-10 sm:w-10">
                      {i + 1}
                    </div>
                    {i < langkah.length - 1 && (
                      <div className="mt-3 w-px flex-1 bg-border" />
                    )}
                  </div>

                  {/* Konten */}
                  <div className="flex-1 pb-8">
                    <div className="card flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-heading sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-text leading-relaxed">
                          {step.desc}
                        </p>
                        <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-void px-3 py-2">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="text-xs text-muted-text leading-relaxed">
                            {step.note}
                          </span>
                        </div>
                        {step.links && step.links.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.links.map((l) => (
                              <a
                                key={l.url}
                                href={l.url}
                                target={l.url.startsWith("http") ? "_blank" : undefined}
                                rel={l.url.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-void px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50"
                              >
                                <span>{l.label}</span>
                                <ArrowRight className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full shrink-0 lg:w-[200px]">
                        <Figure caption={step.caption}>{step.illustration}</Figure>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Setelah terhubung ── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                Setelah terhubung — apa saja yang bisa dilakukan?
              </h2>
              <p className="mt-3 text-subtle leading-relaxed">
                Nomor Anda sudah Connected? Berikut halaman-halaman di dashboard yang bisa Anda gunakan:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fiturSetelahConnected.map((f) => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.title}
                    href={f.href}
                    className="card group flex flex-col gap-2 transition-colors hover:border-primary-border"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-bg group-hover:bg-primary">
                      <Icon className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-heading">{f.title}</h4>
                    <p className="text-xs text-muted-text leading-relaxed">{f.desc}</p>
                    <span className="mt-auto pt-2 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Buka halaman →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Peringatan umum ── */}
          <section className="mb-20">
            <div className="card border-orange-200 bg-orange-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <h3 className="text-base font-bold text-heading">
                    Paling sering bikin gagal: nomor sudah dipakai WhatsApp
                  </h3>
                  <p className="mt-2 text-sm text-muted-text leading-relaxed">
                    Kalau nomor yang mau Anda daftarkan masih aktif di aplikasi WhatsApp atau
                    WhatsApp Business di HP, proses verifikasi akan gagal. Solusinya: buka aplikasi
                    WhatsApp di HP → Setelan → Akun →{" "}
                    <strong className="text-heading">Hapus akun saya</strong>, lalu tunggu beberapa
                    menit sebelum mendaftarkan nomor tersebut di Whatsapp Official Management. Riwayat chat di HP Anda
                    tidak akan hilang karena penghapusan akun.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Info tambahan ── */}
          <section className="mb-20 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                  <Webhook className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-heading">Kenapa aman & resmi?</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-text">
                {[
                  "Menggunakan Cloud API resmi Meta — bukan WhatsApp mod/unofficial.",
                  "Token akses Anda disimpan terenkripsi dan tidak pernah dibagikan.",
                  "Embedded Signup berarti password Facebook Anda tidak pernah menyentuh server kami.",
                  "Penuhi kebijakan Meta: pesan masuk dapat dibalas dalam jendela 24 jam, template pesan wajib disetujui Meta.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-heading">Tidak punya nomor khusus?</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-text">
                {[
                  "Nomor ini akan diturunkan/dihapus dari aplikasi WhatsApp biasa sebelum didaftarkan ke Cloud API.",
                  "Bisa juga gunakan nomor virtual/tetap (fixed line) atau nomor baru dari operator seluler.",
                  "Satu nomor = satu WABA. Anda bisa menghubungkan beberapa nomor berbeda ke satu akun Whatsapp Official Management.",
                  "Pindah nomor ke Cloud API tidak menghilangkan riwayat chat di perangkat Anda, namun riwayat tidak ikut tersinkron ke platform.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Checklist ── */}
          <section className="mb-20">
            <div className="card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-heading">Checklist sebelum memulai</h3>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                Pertanyaan yang sering ditanyakan
              </h2>
              <p className="mt-3 text-subtle">
                Belum ketemu jawabannya? Hubungi tim support kami lewat menu bantuan di dashboard.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="card group cursor-pointer [&::-webkit-details-marker]:hidden"
                >
                  <summary className="flex list-none items-center justify-between gap-4">
                    <span
                      className="text-sm font-bold sm:text-base"
                      style={{ color: "#000000" }}
                    >
                      {item.q}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-text leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ── CTA akhir ── */}
          <div className="card flex flex-col items-center gap-5 border-primary-border bg-primary-bg text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-heading">
                Sudah siap? Mulai integrasi sekarang
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-subtle leading-relaxed">
                Buat akun, lengkapi profil perusahaan, lalu buka menu WhatsApp dan klik
                Connect Account. Butuh bantuan? Tim kami siap mendampingi sampai nomor Anda
                berstatus Connected.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button variant="primary" size="lg" className="gap-2">
                  Mulai Integrasi Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-deep py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-heading">Whatsapp Official Management</span>
            </Link>
            <p className="text-sm text-muted-text">
              © 2026 Whatsapp Official Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
