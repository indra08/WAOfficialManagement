"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Settings,
  Link2,
  Unlink,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface WhatsAppStatus {
  connected: boolean;
  phoneNumberId: string | null;
  businessAccountId: string | null;
  phoneNr: string | null;
  accountStatus: "inactive" | "active" | "pending_review" | "disabled";
  qualityRating: string | null;
  tier: string | null;
  lastSyncedAt: string | null;
  hasPendingSignup: boolean;
  pendingSignupCreatedAt: string | null;
  webhookVerifyToken: string | null;
}

interface WhatsAppApp {
  id?: string;
  quality_rating?: string;
  status?: string;
  messaging_capacity?: string;
  tier?: string;
  display_phone_number?: string;
  error?: { message?: string; type?: string; code?: number };
}

/* ── Status badge helper ───────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: WhatsAppStatus["accountStatus"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    inactive: { label: "Belum Terhubung", cls: "border-neutral-200 bg-neutral-50 text-neutral-600" },
    active: { label: "Aktif", cls: "border-green-200 bg-green-50 text-green-700" },
    pending_review: { label: "Menunggu Review Meta", cls: "border-amber-200 bg-amber-50 text-amber-700" },
    disabled: { label: "Nonaktif", cls: "border-red-200 bg-red-50 text-red-600" },
  };
  const { label, cls } = map[status] ?? map.inactive;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status === "active" && <CheckCircle2 className="h-3 w-3" />}
      {status === "disabled" && <XCircle className="h-3 w-3" />}
      {status === "pending_review" && <AlertTriangle className="h-3 w-3" />}
      {status === "inactive" && <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */

export default function WhatsAppPage() {
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [appData, setAppData] = useState<WhatsAppApp | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  /* Meta credentials form state */
  const [metaAppId, setMetaAppId] = useState("");
  const [metaAppSecret, setMetaAppSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [credError, setCredError] = useState<string | null>(null);

  /* Direct connect state */
  const [connectMethod, setConnectMethod] = useState<"oauth" | "direct">("oauth");
  const [directToken, setDirectToken] = useState("");
  const [directPhoneId, setDirectPhoneId] = useState("");
  const [directBizId, setDirectBizId] = useState("");
  const [directLoading, setDirectLoading] = useState(false);

  /* Trial / test message state */
  const [trialPhone, setTrialPhone] = useState("");
  const [trialMsg, setTrialMsg] = useState("");
  const [trialType, setTrialType] = useState<"text" | "template">("text");
  const [sendingLoading, setSendingLoading] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);

  /* Read query params */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("connectError");
    if (err) {
      setConnectError(decodeURIComponent(err));
      const url = new URL(window.location.href);
      url.searchParams.delete("connectError");
      window.history.replaceState({}, "", url.toString());
    }
    const connected = params.get("connected");
    if (connected === "true") {
      setTimeout(() => fetchStatus(), 500);
    }
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/whatsapp/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(data);
      if (data.connected) fetchAppData();
    } catch {
      setErrorMsg("Gagal memuat status WhatsApp");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAppData() {
    try {
      const res = await fetch("/api/whatsapp/app");
      if (!res.ok) return;
      setAppData(await res.json());
    } catch {
      /* ignore */
    }
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setCredError(null);
    setConnectError(null);
    if (!metaAppId.trim() || !metaAppSecret.trim()) {
      setCredError("Meta App ID dan App Secret wajib diisi.");
      return;
    }
    setConnectLoading(true);
    try {
      const res = await fetch("/api/whatsapp/embedded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metaAppId: metaAppId.trim(), metaAppSecret: metaAppSecret.trim() }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        if (res.status === 409) {
          setConnectError("WhatsApp sudah terhubung. Putuskan dulu sebelum menghubungkan yang baru.");
          return;
        }
        setConnectError(json?.error ?? `HTTP ${res.status}`);
        return;
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setConnectError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("Yakin ingin memutuskan koneksi WhatsApp? Semua percakapan historical akan tetap tersimpan.")) return;
    setDisconnectLoading(true);
    try {
      const res = await fetch("/api/whatsapp/connect", { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setErrorMsg(json?.error ?? `HTTP ${res.status}`);
        return;
      }
      setStatus(null);
      setAppData(null);
    } catch {
      setErrorMsg("Gagal memutus koneksi");
    } finally {
      setDisconnectLoading(false);
    }
  }

  async function handleDirectConnect(e: React.FormEvent) {
    e.preventDefault();
    setCredError(null);
    setConnectError(null);
    if (!directToken.trim()) {
      setCredError("Access Token wajib diisi.");
      return;
    }
    setDirectLoading(true);
    try {
      const res = await fetch("/api/whatsapp/direct-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: directToken.trim(),
          phoneNumberId: directPhoneId.trim() || null,
          businessAccountId: directBizId.trim() || null,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setConnectError(json?.error ?? `HTTP ${res.status}`);
        return;
      }
      await fetchStatus();
      setDirectToken("");
      setDirectPhoneId("");
      setDirectBizId("");
    } catch {
      setConnectError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setDirectLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([fetchStatus()]);
    setRefreshing(false);
  }

  async function handleSendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    setSendResult(null);
    setCredError(null);
    if (!trialPhone.trim() || !trialMsg.trim()) {
      setCredError("Nomor telepon dan pesan wajib diisi.");
      return;
    }
    setSendingLoading(true);
    try {
      const res = await fetch("/api/whatsapp/test/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: trialPhone.trim().replace(/\s/g, ""),
          message: trialType === "text"
            ? { body: trialMsg.trim() }
            : { name: trialMsg.trim(), language: "en_US", components: [] },
          messageType: trialType,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSendResult({ ok: false, msg: json.error ?? `HTTP ${res.status}` });
      } else {
        setSendResult({ ok: true, msg: "Pesan berhasil dikirim! Periksa HP tujuan." });
      }
    } catch {
      setSendResult({ ok: false, msg: "Kesalahan jaringan. Periksa koneksi dan coba lagi." });
    } finally {
      setSendingLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            WhatsApp Integration
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola koneksi WhatsApp Business API perusahaan Anda.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error toasts */}
      {(errorMsg || connectError) && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">
              {connectError ? "Gagal menghubungkan WhatsApp" : errorMsg}
            </p>
            <p className="mt-1 text-xs text-red-600">
              {connectError ? connectError : "Silakan coba lagi atau hubungi dukungan."}
            </p>
          </div>
          <button onClick={() => { setErrorMsg(null); setConnectError(null); }} className="ml-auto text-red-400 hover:text-red-600">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Connected state ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : status?.connected && appData ? (
        <>
          {/* Connection card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-neutral-900">WhatsApp Connected</h2>
                    <StatusBadge status={status.accountStatus} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {status.phoneNr ?? "Nomor tidak tersedia"} &middot; ID: {status.phoneNumberId ?? "-"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                    {appData.quality_rating && (
                      <span>Quality: <span className="font-medium text-neutral-700">{appData.quality_rating}</span></span>
                    )}
                    {appData.tier && (
                      <span>Tier: <span className="font-medium text-neutral-700">{appData.tier}</span></span>
                    )}
                    {appData.messaging_capacity && (
                      <span>Capacity: <span className="font-medium text-neutral-700">{appData.messaging_capacity}</span></span>
                    )}
                    {status.lastSyncedAt && (
                      <span>Last sync: <span className="font-medium text-neutral-700">{new Date(status.lastSyncedAt).toLocaleString("id-ID")}</span></span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleDisconnect}
                  disabled={disconnectLoading}
                >
                  {disconnectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
                  Disconnect
                </Button>
              </div>
            </div>

            {/* Feature grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-3">
              {[
                { icon: MessageCircle, label: "Conversations", desc: "Kelola semua percakapan pelanggan", href: "/dashboard/conversations" },
                { icon: Link2, label: "Templates", desc: "Buat template pesan persetujuan Meta", href: "/dashboard/templates" },
                { icon: Settings, label: "Settings", desc: "Pengaturan webhook & preferensi", href: "/dashboard/settings" },
              ].map((f) => (
                <a
                  key={f.label}
                  href={f.href}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <f.icon className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{f.label}</p>
                    <p className="text-xs text-neutral-500">{f.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Trial: send test message */}
            <div className="mt-6 border-t border-neutral-100 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-neutral-900">Trial — Kirim Pesan Uji</h3>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Menggunakan <strong>WA Access Token</strong> yang tersimpan untuk mengirim pesan langsung ke nomor tujuan.
                Phone Number ID sudah terisi otomatis dari koneksi Anda ({status.phoneNumberId ?? "—"}).
              </p>
              <form onSubmit={handleSendTestMessage} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Nomor telepon penerima (dengan kode negara)</label>
                  <input
                    type="text"
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    placeholder="+86 13800138000"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Jenis pesan</label>
                  <div className="flex gap-3">
                    {(["text", "template"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTrialType(t)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                          trialType === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                        }`}
                      >
                        {t === "text" ? "Teks" : "Template"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {trialType === "text" ? "Isi pesan" : "Nama template (contoh: hello_world)"}
                  </label>
                  <input
                    type="text"
                    value={trialMsg}
                    onChange={(e) => setTrialMsg(e.target.value)}
                    placeholder={trialType === "text" ? "Ketik pesan uji di sini" : "hello_world"}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {credError && <p className="text-xs text-red-600">{credError}</p>}
                {sendResult && (
                  <p className={`text-xs ${sendResult.ok ? "text-green-600" : "text-red-600"}`}>
                    {sendResult.msg}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={sendingLoading || !trialPhone.trim() || !trialMsg.trim()}
                  variant="secondary"
                  className="gap-2"
                >
                  {sendingLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  {sendingLoading ? "Mengirim…" : "Kirim Pesan Uji"}
                </Button>
              </form>
            </div>
          </div>

          {/* Webhook token info */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-800">Webhook Terverifikasi</p>
                <p className="mt-1 text-xs text-blue-600 leading-relaxed">
                  Token verifikasi webhook Anda:<br/>
                  <code className="mt-1 block break-all rounded bg-white px-2 py-1 text-xs font-mono text-neutral-700 border border-blue-200">
                    {status.webhookVerifyToken ?? "—"}
                  </code>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Keamanan terjamin</p>
              <p className="mt-1 text-xs text-blue-600 leading-relaxed">
                Koneksi ini menggunakan Meta Cloud API resmi. Token akses disimpan di database dan hanya digunakan untuk keperluan komunikasi WhatsApp bisnis.
                Anda dapat memutuskan koneksi kapan saja melalui tombol Disconnect di atas.
              </p>
            </div>
          </div>
        </>
      ) : (
        /* ── Not connected state ────────────────────────────────────────── */
        <div className="space-y-6">

          {/* Step 1: Connection method + credentials */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">1</div>
              <h2 className="text-base font-semibold text-neutral-900">Hubungkan WhatsApp Anda</h2>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-6 bg-neutral-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => { setConnectMethod("oauth"); setCredError(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  connectMethod === "oauth"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Via Meta OAuth
              </button>
              <button
                onClick={() => { setConnectMethod("direct"); setCredError(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  connectMethod === "direct"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Langsung / Manual
              </button>
            </div>

            {connectMethod === "oauth" ? (
              /* ── OAuth Form ── */
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label htmlFor="metaAppId" className="block text-sm font-medium text-neutral-700 mb-1">
                    Meta App ID
                  </label>
                  <input
                    id="metaAppId"
                    type="text"
                    value={metaAppId}
                    onChange={(e) => setMetaAppId(e.target.value)}
                    placeholder="Contoh: 123456789012345"
                    className="w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="metaAppSecret" className="block text-sm font-medium text-neutral-700 mb-1">
                    Meta App Secret
                  </label>
                  <div className="relative max-w-md">
                    <input
                      id="metaAppSecret"
                      type={showSecret ? "text" : "password"}
                      value={metaAppSecret}
                      onChange={(e) => { setMetaAppSecret(e.target.value); setCredError(""); }}
                      placeholder="Klik 'Show' untuk melihat secret"
                      className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 ${
                        metaAppSecret.length > 50
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-neutral-300 focus:border-primary focus:ring-primary"
                      }`}
                      autoComplete="off"
                    />
                    <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {metaAppSecret.length > 50 && (
                    <p className="mt-1 text-xs text-red-500">
                      ⚠️ Panjang terlalu banyak — App Secret biasanya 32 karakter. Pastikan menyalin dari Settings → Basic, bukan Access Token.
                    </p>
                  )}
                </div>

                {credError && <p className="text-sm text-red-600">{credError}</p>}

                <Button type="submit" disabled={connectLoading || !metaAppId.trim() || !metaAppSecret.trim()} className="gap-2">
                  {connectLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  {connectLoading ? "Memproses..." : "Lanjutkan ke Meta"}
                </Button>

                <p className="mt-4 text-xs text-neutral-500">
                  Kredensial hanya disimpan di database lokal Anda dan digunakan untuk proses otorisasi Meta Embedded Signup. Data tidak dibagikan ke pihak ketiga.
                </p>
              </form>
            ) : (
              /* ── Direct / Manual Form ── */
              <form onSubmit={handleDirectConnect} className="space-y-4">
                <p className="text-sm text-neutral-500">
                  Salin kredensial langsung dari{' '}
                  <a href="https://developers.facebook.com/docs/whatsapp/business-platform/tools/cloud-api/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Meta Developer Console
                  </a>{' '}
                  atau command prompt yang tersedia di halaman Trial Meta.
                </p>

                <div>
                  <label htmlFor="directToken" className="block text-sm font-medium text-neutral-700 mb-1">
                    WA Access Token
                  </label>
                  <input
                    id="directToken"
                    type="password"
                    value={directToken}
                    onChange={(e) => { setDirectToken(e.target.value); setCredError(""); }}
                    placeholder="EAAO..."
                    className="w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="directPhoneId" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number ID <span className="text-neutral-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    id="directPhoneId"
                    type="text"
                    value={directPhoneId}
                    onChange={(e) => setDirectPhoneId(e.target.value)}
                    placeholder="Contoh: 1298613423338421"
                    className="w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="directBizId" className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Account ID <span className="text-neutral-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    id="directBizId"
                    type="text"
                    value={directBizId}
                    onChange={(e) => setDirectBizId(e.target.value)}
                    placeholder="Contoh: 1103580015938302"
                    className="w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    autoComplete="off"
                  />
                </div>

                {credError && <p className="text-sm text-red-600">{credError}</p>}

                <Button type="submit" disabled={directLoading || !directToken.trim()} className="gap-2">
                  {directLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  {directLoading ? "Menyimpan..." : "Hubungkan Sekarang"}
                </Button>

                <p className="mt-4 text-xs text-neutral-500">
                  Token disimpan aman di database lokal. Tidak dikirim ke server manapun selain endpoint Meta Graph API.
                </p>
              </form>
            )}
          </div>

          {/* Step 2: What happens */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">2</div>
              <h3 className="text-base font-semibold text-neutral-900">Yang akan terjadi</h3>
            </div>
            <ol className="space-y-2 text-sm text-neutral-600 ml-11">
              {[
                "Anda akan diarahkan ke halaman resmi Meta untuk login Facebook.",
                "Pilih Business Account yang ingin dihubungkan.",
                "Isi data bisnis sesuai arahan di wizard Meta.",
                "Masukkan nomor WhatsApp yang ingin dipakai.",
                "Selesai! Dashboard otomatis diperbarui setelah terhubung.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Prerequisites */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Syarat koneksi</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                {[
                  "Akun Facebook personal aktif",
                  "Meta Business Manager yang sudah dibuat",
                  "Nomor telepon yang belum terdaftar di WhatsApp biasa",
                  "Kemampuan menerima SMS/telepon (untuk OTP)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Info penting</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                {[
                  "Proses terhubung rata-rata 5–15 menit",
                  "Meta yang mengelola verifikasi, bukan kami",
                  "Token aman — tersimpan di database",
                  "Dapat diputus kapan saja dari halaman ini",
                ].map((item) => (
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Setup guide */}
          <SetupGuide />
        </div>
      )}
    </div>
  );
}

/* ── Setup Guide (Meta App configuration) ──────────────────────────────────── */

interface SetupStep {
  num: string;
  title: string;
  desc: React.ReactElement;
  imgs: readonly string[];
  imgalts: readonly string[];
}

const SETUP_STEPS: SetupStep[] = [
  {
    num: "1",
    title: "Buat Aplikasi di Meta for Developers",
    desc: (
      <>
        Buka{" "}
        <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
          developers.facebook.com
        </a>{" "}
        → klik <strong>Buat Aplikasi</strong> → pilih tipe <em>Business</em>, beri nama (misal &quot;Whatsapp Official Management&quot;), lalu buat.
      </>
    ),
    imgs: ["/1.webp", "/2.webp"],
    imgalts: ["Popup Pemberitahuan Sistem Baru", "Form Buat Aplikasi"],
  },
  {
    num: "2",
    title: "Tambah Kasus Penggunaan WhatsApp",
    desc: (
      <>
        Pilih kasus penggunaan <strong>&quot;Terhubung dengan pelanggan melalui WhatsApp&quot;</strong>, lalu klik <strong>Berikutnya</strong>.
      </>
    ),
    imgs: ["/3.webp"],
    imgalts: ["Pilih Kasus Penggunaan"],
  },
  {
    num: "3",
    title: "Hubungkan Portofolio Bisnis",
    desc: (
      <>
        Hubungkan Business Portfolio Anda. Belum punya? Buat di{" "}
        <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
          business.facebook.com
        </a>{" "}
        terlebih dahulu, lalu pilih dari dropdown.
      </>
    ),
    imgs: ["/4.webp"],
    imgalts: ["Pilih Portofolio Bisnis"],
  },
  {
    num: "4",
    title: "Tinjau Persyaratan & Buat Aplikasi",
    desc: (
      <>
        Tinjau persyaratan penerbitan (biasanya kosong untuk tahap awal), setujui Ketentuan Platform Meta, lalu klik <strong>Berikutnya</strong>.
      </>
    ),
    imgs: ["/5.webp", "/6.webp"],
    imgalts: ["Persyaratan Penerbitan", "Gambaran Umum Aplikasi"],
  },
  {
    num: "5",
    title: "Sesuaikan Kasus Penggunaan WhatsApp",
    desc: (
      <>
        Di dasbor aplikasi, masuk menu <strong>WhatsApp → Sesuaikan kasus penggunaan</strong> → pilih <strong>Hubungkan di WhatsApp</strong> → <strong>Lanjutkan</strong>.
      </>
    ),
    imgs: ["/7.webp", "/8.webp"],
    imgalts: ["Dasbor Aplikasi Saya", "Sesuaikan Kasus Penggunaan WhatsApp"],
  },
  {
    num: "6",
    title: "Klaim Nomor Telepon Uji WhatsApp",
    desc: (
      <>
        Meta memberikan nomor telepon uji (format +1 xxx-xxx-xxxx). Klik <strong>Klaim</strong> untuk mengaktifkan nomor ini sebagai nomor pengirim uji.
      </>
    ),
    imgs: [],
    imgalts: [],
  },
  {
    num: "7",
    title: "Salin Kredensial & Hubungkan ke Dashboard",
    desc: (
      <>
        Masuk <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-primary underline">Facebook Developers Dashboard</a> → pilih app →{" "}
        <strong>Settings → Basic</strong>. Salin <strong>App ID</strong> dan <strong>App Secret</strong>.
        <br />
        Untuk access token & Phone Number ID, buka halaman <strong>Langkah 1. Coba!</strong> di dasbor WhatsApp → klik <strong>Buat token</strong> → salin ketiga nilai tersebut.
        <br />
        Masukkan kredensial di form di bawah, lalu klik <strong>Hubungkan Sekarang</strong>.
      </>
    ),
    imgs: ["/9.webp", "/10.webp", "/11.webp"],
    imgalts: ["Langkah 1 Cobalah - Setup Awal", "Kirim Pesan Uji Coba", "Popup Tambah Nomor Penerima"],
  },
];

function SetupGuide() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-3 p-5 border-b border-neutral-100">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Panduan Lengkap Setup Meta Developer</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Ikuti 7 langkah di bawah ini sebelum mengisi form koneksi di bawah.</p>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-8 bottom-0 w-px bg-neutral-200" />

          <div className="space-y-8">
            {SETUP_STEPS.map((item) => (
              <div key={item.num} className="flex gap-4">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {item.num}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                  {item.imgs.length > 0 && (
                    <div className={`mt-3 space-y-3 ${item.imgs.length > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}`}>
                      {item.imgs.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={item.imgalts[i]}
                          className="w-full h-auto rounded-md border border-neutral-200 shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-orange-50 border border-orange-200 p-4">
          <p className="text-xs font-semibold text-orange-800 mb-1">💡 Tips</p>
          <p className="text-xs text-orange-700 leading-relaxed">
            Simpan semua kredensial (App ID, App Secret, Access Token, Phone Number ID, Business Account ID)
            sebelum melanjutkan. Anda akan membutuhkannya di form koneksi di bawah.
          </p>
        </div>
      </div>
    </div>
  );
}
