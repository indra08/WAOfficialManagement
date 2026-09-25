"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  Smartphone,
  FileText,
  Zap,
} from "lucide-react";

/* ============================================================================
   Shared illustration primitives & components
   Used by both the landing-page teaser and the /tutorial page.
   All are "mockup" SVG-free visuals using divs + Tailwind so no image assets needed.
   ========================================================================== */

export function Bar({ className = "" }: { className?: string }) {
  return <div className={`h-2 rounded-full bg-border ${className}`} />;
}

export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
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

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[160px] rounded-2xl border-2 border-border bg-void p-1.5">
      <div className="rounded-xl bg-deep p-2.5">{children}</div>
    </div>
  );
}

export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex h-full flex-col justify-center">
      {children}
      <figcaption className="mt-2 text-center text-[10px] leading-snug text-muted-text">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ---------- Ilustrasi: Persiapan ---------- */

export function IllusMetaAccount() {
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
        <CheckCircle2 className="h-3 w-3 text-primary" />
        <span className="text-[9px] font-semibold text-primary-dim">
          Status: Admin Business Manager
        </span>
      </div>
    </BrowserFrame>
  );
}

export function IllusBusinessInfo() {
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

export function IllusNewNumber() {
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

export function IllusOtpAccess() {
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

export function IllusDocuments() {
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

export function IllusWebsite() {
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

/* ---------- Ilustrasi: Langkah integrasi ---------- */

export function IllusSignUp() {
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

export function IllusConnectButton() {
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

export function IllusFacebookAuth() {
  return (
    <BrowserFrame url="facebook.com/dialog/oauth">
      <div className="text-center">
        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-[11px] font-bold text-white">
          f
        </div>
        <p className="mt-2 text-[9px] font-semibold text-heading">
          Whatsapp Official Management ingin mengakses:
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

export function IllusWabaWizard() {
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

export function IllusVerifyNumber() {
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

export function IllusWebhook() {
  return (
    <div className="rounded-lg border border-border bg-void p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 rounded-md border border-border px-2 py-1.5 text-center">
          <p className="text-[9px] font-semibold text-heading">Meta</p>
          <p className="text-[8px] text-muted-text">Cloud API</p>
        </div>
        <Zap className="h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="flex-1 rounded-md border border-primary-border bg-primary-bg px-2 py-1.5 text-center">
          <p className="text-[9px] font-semibold text-primary-dim">Whatsapp Official Management</p>
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

export function IllusConnected() {
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

export function IllusScale() {
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
