import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  MessageCircle,
  Shield,
  BarChart3,
  Users,
  Clock,
  Zap,
  CheckCircle2,
  Building2,
  Smartphone,
  Globe,
  FileText,
  KeyRound,
  UserCheck,
  Phone,
  Webhook,
  Rocket,
  AlertTriangle,
  Lightbulb,
  Timer,
  Layers,
  Lock,
  BadgeCheck,
  Store,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ============================================================================
   PRIMITIF ILUSTRASI
   Semua ilustrasi di bawah ini adalah "mockup" yang dirender dengan div + Tailwind,
   jadi tidak butuh file gambar. Kalau nanti sudah punya screenshot asli,
   cukup ganti isinya dengan:
     <Image src="/images/tutorial/nama-file.png" alt="..." width={640} height={400} />
   ========================================================================== */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`h-2 rounded-full bg-border ${className}`} />;
}

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-void">
      <div className="flex items-center gap-2 border-b border-border bg-deep px-2.5 py-1.5">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <span className="h-2 w-2 rounded-full bg-green-400/60" />
        </div>
        <span className="truncate text-[9px] text-muted-text">{url}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[160px] rounded-2xl border-2 border-border bg-void p-1.5">
      <div className="rounded-xl bg-deep p-2.5">{children}</div>
    </div>
  );
}

function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="flex h-full flex-col justify-center">
      {children}
      <figcaption className="mt-2 text-center text-[10px] leading-snug text-muted-text">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ---------- Ilustrasi untuk bagian "Yang perlu disiapkan" ---------- */

function IllusMetaAccount() {
  return (
    <BrowserFrame url="business.facebook.com">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-bg text-[10px] font-bold text-primary">
          A
        </div>
        <div className="flex-1 space-y-1.5">
          <Bar className="w-3/4" />
          <Bar className="w-1/2" />
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-primary-border bg-primary-bg px-2 py-1">
        <BadgeCheck className="h-3 w-3 text-primary" />
        <span className="text-[9px] font-semibold text-primary-dim">
          Status: Admin Business Manager
        </span>
      </div>
    </BrowserFrame>
  );
}

function IllusBusinessInfo() {
  return (
    <BrowserFrame url="business.facebook.com/settings">
      <div className="space-y-1.5">
        {["Nama legal bisnis", "Alamat", "Email bisnis", "Website"].map((field) => (
          <div
            key={field}
            className="flex items-center gap-2 rounded-md border border-border px-2 py-1"
          >
            <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
            <span className="text-[9px] text-muted-text">{field}</span>
            <Bar className="ml-auto w-8" />
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

function IllusNewNumber() {
  return (
    <PhoneFrame>
      <div className="text-center">
        <Smartphone className="mx-auto h-5 w-5 text-primary" />
        <p className="mt-1.5 text-[9px] font-bold text-heading">+62 812-3456-7890</p>
        <div className="mt-2 rounded-md border border-dashed border-border px-1.5 py-1">
          <p className="text-[8px] leading-snug text-muted-text">
            Belum terpasang di aplikasi WhatsApp
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function IllusOtpAccess() {
  return (
    <PhoneFrame>
      <div className="text-center">
        <p className="text-[8px] text-muted-text">SMS dari Meta</p>
        <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-heading">123 456</p>
        <div className="mt-2 flex justify-center gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="h-4 w-3 rounded-sm border border-primary-border bg-primary-bg"
            />
          ))}
        </div>
        <p className="mt-2 text-[8px] text-primary">Kode verifikasi diterima</p>
      </div>
    </PhoneFrame>
  );
}

function IllusDocuments() {
  return (
    <div className="rounded-lg border border-border bg-void p-3">
      <div className="space-y-1.5">
        {["Akta perusahaan / NIB", "NPWP perusahaan", "KTP penanggung jawab"].map((doc) => (
          <div
            key={doc}
            className="flex items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-[9px] text-muted-text">{doc}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[8px] text-muted-text">
        Disiapkan hanya jika diminta Meta
      </p>
    </div>
  );
}

function IllusWebsite() {
  return (
    <BrowserFrame url="https://bisnis-anda.com">
      <div className="space-y-2">
        <Bar className="w-1/3" />
        <div className="h-9 rounded-md border border-primary-border bg-primary-bg" />
        <div className="flex gap-2">
          <Bar className="w-2/3" />
          <Bar className="w-1/4" />
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ---------- Ilustrasi untuk langkah integrasi ---------- */

function IllusSignUp() {
  return (
    <BrowserFrame url="waofficial.app/register">
      <div className="space-y-1.5">
        <div className="rounded-md border border-border px-2 py-1 text-[9px] text-muted-text">
          Nama perusahaan
        </div>
        <div className="rounded-md border border-border px-2 py-1 text-[9px] text-muted-text">
          Email kerja
        </div>
        <div className="rounded-md bg-primary px-2 py-1 text-center text-[9px] font-semibold text-white">
          Buat Akun
        </div>
      </div>
    </BrowserFrame>
  );
}

function IllusConnectButton() {
  return (
    <BrowserFrame url="waofficial.app/dashboard/whatsapp">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold text-heading">Nomor WhatsApp</span>
        <span className="rounded bg-primary px-2 py-1 text-[8px] font-bold text-white">
          + Connect Account
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-7 rounded-md border border-dashed border-border" />
        <Bar className="w-1/2" />
      </div>
    </BrowserFrame>
  );
}

function IllusFacebookAuth() {
  return (
    <BrowserFrame url="facebook.com/dialog/oauth">
      <div className="text-center">
        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-[11px] font-bold text-white">
          f
        </div>
        <p className="mt-2 text-[9px] font-semibold text-heading">
          WaOfficial ingin mengakses:
        </p>
        <div className="mt-2 space-y-1 text-left">
          {["WhatsApp Business Account", "Nomor telepon bisnis"].map((scope) => (
            <div key={scope} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
              <span className="text-[9px] text-muted-text">{scope}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-md bg-[#1877F2] py-1 text-[9px] font-semibold text-white">
          Lanjutkan sebagai Admin
        </div>
      </div>
    </BrowserFrame>
  );
}

function IllusWabaWizard() {
  return (
    <BrowserFrame url="Meta Embedded Signup">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= 2 ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
      <p className="mt-2.5 text-[9px] font-semibold text-heading">
        Buat WhatsApp Business Account
      </p>
      <div className="mt-2 space-y-1.5">
        <Bar className="w-full" />
        <Bar className="w-2/3" />
      </div>
      <div className="mt-2 rounded-md bg-primary py-1 text-center text-[9px] font-semibold text-white">
        Selesai
      </div>
    </BrowserFrame>
  );
}

function IllusVerifyNumber() {
  return (
    <PhoneFrame>
      <p className="text-[8px] text-muted-text">Verifikasi nomor</p>
      <p className="mt-1 text-[9px] font-bold text-heading">+62 812-3456-7890</p>
      <div className="mt-2 flex justify-between gap-1">
        {["1", "2", "3", "4", "5", "6"].map((d) => (
          <span
            key={d}
            className="flex h-5 w-4 items-center justify-center rounded-sm border border-primary-border bg-primary-bg text-[8px] font-bold text-primary-dim"
          >
            {d}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[8px] text-primary">Kode terkirim via SMS</p>
    </PhoneFrame>
  );
}

function IllusWebhook() {
  return (
    <div className="rounded-lg border border-border bg-void p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 rounded-md border border-border px-2 py-1.5 text-center">
          <p className="text-[9px] font-semibold text-heading">Meta</p>
          <p className="text-[8px] text-muted-text">Cloud API</p>
        </div>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="flex-1 rounded-md border border-primary-border bg-primary-bg px-2 py-1.5 text-center">
          <p className="text-[9px] font-semibold text-primary-dim">WaOfficial</p>
          <p className="text-[8px] text-muted-text">Webhook</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1">
        <Zap className="h-3 w-3 text-primary" />
        <span className="text-[8px] font-semibold text-muted-text">
          Dikonfigurasi otomatis oleh sistem
        </span>
      </div>
    </div>
  );
}

function IllusConnected() {
  return (
    <BrowserFrame url="waofficial.app/dashboard/whatsapp">
      <div className="flex items-center gap-2 rounded-md border border-primary-border bg-primary-bg px-2 py-1.5">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[9px] font-semibold text-primary-dim">Connected</span>
        <span className="ml-auto text-[8px] text-muted-text">+62 812-3456-7890</span>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="flex gap-1.5">
          <span className="rounded bg-primary-bg px-1.5 py-0.5 text-[8px] text-primary-dim">
            Template
          </span>
          <span className="rounded bg-primary-bg px-1.5 py-0.5 text-[8px] text-primary-dim">
            Kontak
          </span>
        </div>
        <Bar className="w-2/3" />
      </div>
    </BrowserFrame>
  );
}

function IllusScale() {
  return (
    <div className="rounded-lg border border-border bg-void p-3">
      <div className="flex h-16 items-end gap-1.5">
        {[35, 50, 65, 82, 100].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-t bg-primary/70"
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[8px] text-muted-text">
        <span>250</span>
        <span>1K</span>
        <span>10K</span>
        <span>100K</span>
      </div>
      <p className="mt-1.5 text-center text-[8px] text-muted-text">
        Limit penerima naik otomatis per tier
      </p>
    </div>
  );
}

/* ========================================================================== */

export default function HomePage() {
  /* ---------- Data: apa yang perlu disiapkan ---------- */
  const persiapan = [
    {
      icon: UserCheck,
      title: "Akun Meta & akses admin",
      desc: "Anda butuh akun Facebook pribadi yang aktif dan berstatus admin di Meta Business Manager perusahaan.",
      steps: [
        "Buka business.facebook.com, login dengan akun Facebook Anda.",
        "Belum punya Business Manager? Klik “Buat Akun” — gratis.",
        "Cek menu Pengguna → pastikan nama Anda ada di daftar Admin.",
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
      illustration: <IllusWebsite />,
      caption: "Website sederhana pun cukup, yang penting aktif",
    },
  ];

  /* ---------- Data: checklist ringkas ---------- */
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

  /* ---------- Data: langkah integrasi ---------- */
  const langkah = [
    {
      title: "Daftar & buat perusahaan Anda",
      desc: "Langkah paling awal: buat akun di WaOfficial, lalu lengkapi profil perusahaan (nama, alamat, kontak). Data ini yang nanti dipakai untuk mendaftarkan bisnis Anda ke Meta.",
      note: "Belum perlu menyentuh apa pun milik Meta di langkah ini.",
      illustration: <IllusSignUp />,
      caption: "Halaman pendaftaran akun WaOfficial",
    },
    {
      title: "Klik “Connect Account” di menu WhatsApp",
      desc: "Setelah login ke dashboard, buka menu WhatsApp lalu tekan tombol Connect Account. Sebuah jendela popup resmi milik Meta (Embedded Signup) akan terbuka — bukan form buatan kami.",
      note: "Kalau popup diblokir, izinkan popup untuk situs ini lalu klik ulang.",
      illustration: <IllusConnectButton />,
      caption: "Tombol Connect Account di dashboard WaOfficial",
    },
    {
      title: "Login & izinkan akses lewat Facebook",
      desc: "Masuk dengan akun Facebook Anda di dalam popup tersebut, lalu pilih Meta Business Account yang akan dipakai (atau buat baru). Anda akan diminta menyetujui beberapa izin akses.",
      note: "Password Facebook Anda diketik langsung di halaman Meta — tidak pernah melewati server kami.",
      illustration: <IllusFacebookAuth />,
      caption: "Dialog izin akses resmi dari Facebook",
    },
    {
      title: "Buat WhatsApp Business Account (WABA)",
      desc: "Meta akan memandu Anda membuat WABA baru lewat wizard beberapa langkah. Ikuti saja sampai selesai — tidak ada konfigurasi teknis yang perlu Anda ketik sendiri.",
      note: "Satu WABA bisa menampung beberapa nomor WhatsApp.",
      illustration: <IllusWabaWizard />,
      caption: "Wizard pembuatan WABA dari Meta",
    },
    {
      title: "Daftarkan & verifikasi nomor telepon",
      desc: "Masukkan nomor WhatsApp khusus Anda, pilih metode verifikasi (SMS atau panggilan suara), lalu masukkan 6 digit kode OTP yang Anda terima.",
      note: "Masukkan kode secepatnya — kode OTP punya masa berlaku singkat.",
      illustration: <IllusVerifyNumber />,
      caption: "Input kode OTP untuk memverifikasi nomor",
    },
    {
      title: "Webhook terkonfigurasi otomatis",
      desc: "Tidak ada yang perlu Anda setting. Platform kami otomatis mendaftarkan URL webhook, subscription, dan event pesan ke Meta — sehingga pesan masuk langsung tampil di dashboard Anda.",
      note: "Inilah bagian yang biasanya paling rumit kalau dikerjakan manual.",
      illustration: <IllusWebhook />,
      caption: "Koneksi webhook diatur otomatis oleh sistem",
    },
    {
      title: "Status “Connected” — siap dipakai",
      desc: "Nomor Anda kini tampil dengan status Connected di dashboard. Anda sudah bisa membuat template pesan, mengelola kontak, dan mulai percakapan bisnis.",
      note: "Balasan ke pelanggan bisa dikirim bebas dalam jendela 24 jam sejak pesan masuk.",
      illustration: <IllusConnected />,
      caption: "Nomor tampil dengan status Connected",
    },
    {
      title: "Naik tier & scale (opsional)",
      desc: "Setelah App Review Meta selesai di sisi platform, limit pengiriman Anda naik bertahap dari 250 penerima per hari menjadi 100.000+ penerima per hari, tergantung tier.",
      note: "Semakin rapi kualitas pesan Anda, semakin cepat limit naik.",
      illustration: <IllusScale />,
      caption: "Kenaikan limit pengiriman per tier",
    },
  ];

  /* ---------- Data: FAQ ---------- */
  const faq = [
    {
      q: "Saya tidak paham teknologi. Apakah ini sulit?",
      a: "Tidak. Seluruh proses berjalan lewat tampilan yang diklik seperti mengisi formulir biasa. Meta yang memandu langkahnya, dan bagian paling teknis (webhook, token, endpoint) sudah kami urus otomatis. Anda hanya perlu menyiapkan data bisnis dan nomor telepon.",
    },
    {
      q: "Apakah nomor WhatsApp saya yang sekarang bisa dipakai?",
      a: "Bisa, tapi nomor tersebut harus “dilepas” dulu dari aplikasi WhatsApp atau WhatsApp Business di HP Anda. Setelah terhubung ke Cloud API, nomor itu tidak lagi dipakai lewat aplikasi HP — semua percakapan berpindah ke dashboard WaOfficial.",
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
      a: "Tidak. Riwayat chat tetap tersimpan di perangkat Anda, tetapi tidak ikut tersinkron ke platform. Percakapan baru setelah nomor terhubung akan tercatat di dashboard WaOfficial.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <header className="border-b border-border bg-void">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-heading">WaOfficial</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#integrasi" className="hidden text-sm font-medium text-subtle hover:text-heading sm:block">
              Tutorial
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

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
                <Zap className="h-3 w-3" />
                Built for WhatsApp Business
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl lg:text-6xl">
                Manage your WhatsApp Business{" "}
                <span className="text-primary">like a PRO</span>
              </h1>
              <p className="mt-6 text-lg text-subtle leading-relaxed">
                One dashboard to connect, manage, and scale your WhatsApp Business conversations.
                Track contacts, automate messages, and grow your customer relationships effortlessly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── FITUR ───────────────────────── */}
        <section className="bg-deep py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-heading">Everything you need</h2>
              <p className="mt-3 text-subtle">Powerful features to streamline your WhatsApp Business operations</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MessageCircle,
                  title: "Multi-Account Management",
                  desc: "Connect multiple WhatsApp Business accounts and manage them all from one centralized dashboard.",
                },
                {
                  icon: Users,
                  title: "Contact Management",
                  desc: "Organize and segment your contacts with tags, custom fields, and smart lists for targeted messaging.",
                },
                {
                  icon: BarChart3,
                  title: "Analytics & Insights",
                  desc: "Track message delivery rates, response times, and conversation metrics to optimize your outreach.",
                },
                {
                  icon: Shield,
                  title: "Team Collaboration",
                  desc: "Assign conversations to team members, set roles and permissions, and work together seamlessly.",
                },
                {
                  icon: Clock,
                  title: "Message Templates",
                  desc: "Create and manage approved message templates for consistent, professional customer communication.",
                },
                {
                  icon: Zap,
                  title: "Webhook Integration",
                  desc: "Receive real-time notifications for incoming messages and integrate with your existing tools.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="card">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-heading">{feature.title}</h3>
                    <p className="text-sm text-muted-text">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════ TUTORIAL INTEGRASI META ══════════════════ */}
        <section id="integrasi" className="bg-deep py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* ---------- Header tutorial ---------- */}
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
                <KeyRound className="h-3 w-3" />
                Panduan Lengkap untuk Pemula
              </div>
              <h2 className="text-3xl font-extrabold text-heading sm:text-4xl">
                Hubungkan WhatsApp Business Anda dalam hitungan menit
              </h2>
              <p className="mt-4 text-subtle leading-relaxed">
                WaOfficial memakai{" "}
                <strong className="text-heading">Meta Embedded Signup</strong> resmi untuk
                menghubungkan WhatsApp Business Account (WABA) Anda. Tidak perlu paham istilah API,
                tidak perlu mengatur server — cukup ikuti panduan di bawah ini.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  <Timer className="h-3.5 w-3.5 text-primary" />
                  ± 15–30 menit
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  8 langkah sederhana
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  Tanpa coding
                </span>
              </div>
            </div>

            {/* ---------- 0. Kenalan dulu ---------- */}
            <div className="mt-20">
              <div className="mx-auto max-w-3xl text-center">
                <h3 className="text-2xl font-extrabold text-heading">
                  Kenalan dulu: apa bedanya WhatsApp biasa, WhatsApp Business, dan WhatsApp API?
                </h3>
                <p className="mt-3 text-subtle leading-relaxed">
                  Sebelum mulai, penting untuk tahu posisi Anda. Banyak orang bingung karena ketiganya
                  sama-sama bernama “WhatsApp”.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                  <h4 className="text-base font-bold text-heading">WhatsApp biasa</h4>
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
                  <h4 className="text-base font-bold text-heading">WhatsApp Business App</h4>
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
                  <h4 className="text-base font-bold text-heading">
                    WhatsApp Business API <span className="text-primary">via WaOfficial</span>
                  </h4>
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
                  <h4 className="text-base font-bold text-heading">
                    Analogi sederhana biar gampang dibayangkan
                  </h4>
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
            </div>

            {/* ---------- 1. Yang perlu disiapkan ---------- */}
            <div className="mt-24">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-semibold text-subtle">
                  Langkah 1 dari 2
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-heading sm:text-3xl">
                  Yang perlu Anda siapkan
                </h3>
                <p className="mt-3 text-subtle leading-relaxed">
                  Ada 6 hal yang harus siap sebelum mulai. Tidak semuanya wajib di hari pertama —
                  tapi semakin lengkap, semakin cepat prosesnya selesai.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {persiapan.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="card flex flex-col gap-5 sm:flex-row">
                      <div className="flex-1">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-bg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="text-base font-bold text-heading">{item.title}</h4>
                        </div>
                        <p className="text-sm text-muted-text leading-relaxed">{item.desc}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary-dim">
                          Cara menyiapkan
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-muted-text">
                          {item.steps.map((s) => (
                            <li key={s} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span className="leading-relaxed">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full shrink-0 sm:w-[190px]">
                        <Figure caption={item.caption}>{item.illustration}</Figure>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checklist cetak */}
              <div className="card mt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-heading">
                      Checklist cepat — centang sebelum mulai
                    </h4>
                    <p className="text-xs text-muted-text">
                      Siapkan semuanya dulu supaya proses connect tidak terputus di tengah jalan.
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-text">
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Peringatan nomor */}
              <div className="card mt-6 flex flex-col gap-4 border-yellow-500/40 sm:flex-row sm:items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-heading">
                    Paling sering bikin gagal: nomor sudah dipakai WhatsApp
                  </h4>
                  <p className="mt-2 text-sm text-muted-text leading-relaxed">
                    Kalau nomor yang mau Anda daftarkan masih aktif di aplikasi WhatsApp atau
                    WhatsApp Business di HP, proses verifikasi akan gagal. Solusinya: buka aplikasi
                    WhatsApp di HP → Setelan → Akun →{" "}
                    <strong className="text-heading">Hapus akun saya</strong>, lalu tunggu beberapa
                    menit sebelum mendaftarkan nomor tersebut di WaOfficial. Riwayat chat di HP Anda
                    tidak akan hilang karena penghapusan akun.
                  </p>
                </div>
              </div>
            </div>

            {/* ---------- 2. Langkah integrasi ---------- */}
            <div className="mt-24">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-semibold text-subtle">
                  Langkah 2 dari 2
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-heading sm:text-3xl">
                  Langkah integrasi, satu per satu
                </h3>
                <p className="mt-3 text-subtle leading-relaxed">
                  Ikuti urutan berikut dari dashboard WaOfficial Anda. Setiap langkah disertai
                  gambaran tampilan yang akan Anda lihat.
                </p>
              </div>

              <div className="mt-12">
                {langkah.map((step, i) => (
                  <div key={step.title} className="flex gap-4 sm:gap-6">
                    {/* Kolom nomor + garis penghubung */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-10 sm:w-10">
                        {i + 1}
                      </div>
                      {i < langkah.length - 1 && (
                        <div className="mt-3 w-px flex-1 bg-border" />
                      )}
                    </div>

                    {/* Konten langkah */}
                    <div className="flex-1 pb-8">
                      <div className="card flex flex-col gap-6 lg:flex-row lg:items-center">
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-heading sm:text-lg">
                            {step.title}
                          </h4>
                          <p className="mt-2 text-sm text-muted-text leading-relaxed">
                            {step.desc}
                          </p>
                          <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-void px-3 py-2">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="text-xs text-muted-text leading-relaxed">
                              {step.note}
                            </span>
                          </div>
                        </div>
                        <div className="w-full shrink-0 lg:w-[230px]">
                          <Figure caption={step.caption}>{step.illustration}</Figure>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Info tambahan ---------- */}
            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                    <Webhook className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base font-bold text-heading">Kenapa aman & resmi?</h4>
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
                  <h4 className="text-base font-bold text-heading">Tidak punya nomor khusus?</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-text">
                  {[
                    "Nomor ini akan diturunkan/dihapus dari aplikasi WhatsApp biasa sebelum didaftarkan ke Cloud API.",
                    "Bisa juga gunakan nomor virtual/tetap (fixed line) atau nomor baru dari operator seluler.",
                    "Satu nomor = satu WABA. Anda bisa menghubungkan beberapa nomor berbeda ke satu akun WaOfficial.",
                    "Pindah nomor ke Cloud API tidak menghilangkan riwayat chat di perangkat Anda, namun riwayat tidak ikut tersinkron ke platform.",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---------- FAQ ---------- */}
            <div className="mt-20">
              <div className="mx-auto max-w-3xl text-center">
                <h3 className="text-2xl font-extrabold text-heading sm:text-3xl">
                  Pertanyaan yang sering ditanyakan
                </h3>
                <p className="mt-3 text-subtle">
                  Belum ketemu jawabannya? Hubungi tim support kami lewat menu bantuan di dashboard.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-3xl space-y-3">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="card group cursor-pointer [&::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex list-none items-center justify-between gap-4">
                      <span className="text-sm font-bold text-heading sm:text-base " style={{ color: "var(--text-color)" }}>
                        {item.q}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-text transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-text leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* ---------- CTA setelah tutorial ---------- */}
            <div className="card mt-16 flex flex-col items-center gap-5 border-primary-border bg-primary-bg text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-heading">
                  Sudah siap? Mulai dari langkah pertama sekarang
                </h4>
                <p className="mx-auto mt-2 max-w-xl text-sm text-subtle leading-relaxed">
                  Buat akun, lengkapi profil perusahaan, lalu hubungkan WhatsApp Business Anda.
                  Butuh bantuan? Tim kami siap mendampingi sampai nomor Anda berstatus Connected.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="w-full gap-2 sm:w-auto">
                    Mulai Integrasi Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Masuk ke Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── CTA AKHIR ───────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="card text-center">
              <h2 className="text-3xl font-extrabold text-heading">Ready to get started?</h2>
              <p className="mx-auto mt-4 max-w-lg text-subtle">
                Join thousands of businesses using WaOfficial to manage their WhatsApp Business communications.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-deep py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-heading">WaOfficial</span>
            </div>
            <p className="text-sm text-muted-text">
              2024 WaOfficialManagement. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}