"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import type { Account } from "@/lib/accounts";
import {
  Link2, Link2Off, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, Info,
} from "lucide-react";
import { clsx } from "clsx";

interface TokenStatus {
  connected: boolean;
  username: string;
  userId: string;
  expiresAt: number;
}

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const successId = searchParams.get("success");
  const errorMsg = searchParams.get("error");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [status, setStatus] = useState<Record<string, TokenStatus>>({});
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (successId) {
      setBanner({ type: "success", msg: `Akun "${successId}" berhasil terkoneksi ke X! ✅` });
    } else if (errorMsg) {
      setBanner({ type: "error", msg: `Error OAuth: ${errorMsg}` });
    }
  }, [successId, errorMsg]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accsRes, statusRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/twitter/status"),
      ]);
      const accsData = await accsRes.json();
      const statusData = await statusRes.json();
      setAccounts(accsData.accounts ?? []);
      setStatus(statusData.status ?? {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleConnect = (accountId: string) => {
    setConnectingId(accountId);
    // Redirect to OAuth flow; page will reload on callback
    window.location.href = `/api/twitter/auth?accountId=${accountId}`;
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm(`Putuskan koneksi X untuk "${accountId}"?`)) return;
    setDisconnectingId(accountId);
    await fetch(`/api/twitter/disconnect?accountId=${accountId}`, { method: "DELETE" });
    setDisconnectingId(null);
    loadData();
  };

  const connectedCount = Object.keys(status).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-black">𝕏</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Koneksi X / Twitter</h1>
              <p className="text-slate-500 text-sm">Login semua akun X untuk posting langsung dari platform ini</p>
            </div>
          </div>
        </div>

        {/* Banner */}
        {banner && (
          <div
            className={clsx(
              "flex items-start gap-2.5 px-4 py-3 rounded-xl mb-6 text-sm",
              banner.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            )}
          >
            {banner.type === "success" ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />}
            <span>{banner.msg}</span>
            <button onClick={() => setBanner(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Akun", value: accounts.length, color: "text-slate-700" },
            { label: "Terkoneksi", value: connectedCount, color: "text-emerald-600" },
            { label: "Belum Connect", value: accounts.length - connectedCount, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className={clsx("text-3xl font-bold", s.color)}>{loading ? "–" : s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Account cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((acc) => {
              const connected = !!status[acc.id];
              const tokenInfo = status[acc.id];
              const isExpired = tokenInfo && tokenInfo.expiresAt < Date.now();

              return (
                <div
                  key={acc.id}
                  className={clsx(
                    "bg-white rounded-2xl border shadow-sm p-4 flex items-center justify-between gap-4 transition-all",
                    connected && !isExpired ? "border-emerald-200" : "border-slate-100"
                  )}
                >
                  {/* Account info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: acc.bgColor }}
                    >
                      {acc.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800 text-sm">{acc.displayName}</p>
                        {connected && !isExpired && (
                          <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                            Terkoneksi
                          </span>
                        )}
                        {isExpired && (
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Token expired</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{acc.username} · {acc.niche}</p>
                      {connected && tokenInfo && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Login sebagai <span className="font-medium text-sky-600">@{tokenInfo.username}</span>
                          {!isExpired && ` · token aktif sampai ${new Date(tokenInfo.expiresAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {connected && !isExpired ? (
                      <>
                        <button
                          onClick={() => handleConnect(acc.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all"
                        >
                          <RefreshCw size={12} /> Re-connect
                        </button>
                        <button
                          onClick={() => handleDisconnect(acc.id)}
                          disabled={disconnectingId === acc.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
                        >
                          {disconnectingId === acc.id
                            ? <RefreshCw size={12} className="animate-spin" />
                            : <Link2Off size={12} />}
                          Putus Koneksi
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(acc.id)}
                        disabled={connectingId === acc.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 shadow-sm transition-all disabled:opacity-60"
                      >
                        {connectingId === acc.id
                          ? <RefreshCw size={13} className="animate-spin" />
                          : <Link2 size={13} />}
                        {connectingId === acc.id ? "Mengarahkan..." : isExpired ? "Connect Ulang" : "Connect X"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Setup instructions */}
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} className="text-slate-400" />
            <h3 className="font-semibold text-sm">Setup Twitter API (wajib untuk pertama kali)</h3>
          </div>
          <p className="text-slate-400 text-xs mb-4">Isi credential di <code className="bg-slate-700 px-1.5 py-0.5 rounded">.env.local</code> lalu restart server:</p>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1 mb-4">
            <p className="text-slate-500"># .env.local — Twitter/X OAuth 2.0</p>
            <p>TWITTER_CLIENT_ID=your_client_id</p>
            <p>TWITTER_CLIENT_SECRET=your_client_secret</p>
            <p>TWITTER_CALLBACK_URL=http://localhost:3000/api/twitter/callback</p>
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <p>1. Buka <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline inline-flex items-center gap-0.5">developer.twitter.com <ExternalLink size={10} /></a> → buat app baru</p>
            <p>2. Di <strong className="text-slate-300">User authentication settings</strong> aktifkan OAuth 2.0</p>
            <p>3. Set <strong className="text-slate-300">Type of App</strong>: Web App</p>
            <p>4. Tambahkan Callback URL: <code className="bg-slate-700 px-1 rounded">http://localhost:3000/api/twitter/callback</code></p>
            <p>5. Scope yang dibutuhkan: <code className="bg-slate-700 px-1 rounded">tweet.read tweet.write users.read offline.access</code></p>
            <p>6. Copy <strong className="text-slate-300">Client ID</strong> dan <strong className="text-slate-300">Client Secret</strong> ke .env.local</p>
          </div>
        </div>
      </main>
    </div>
  );
}
