"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import type { Account } from "@/lib/accounts";
import {
  Settings, Key, Save, CheckCircle2, Eye, EyeOff,
  Plus, Trash2, AlertTriangle, RefreshCw, User,
} from "lucide-react";
import { clsx } from "clsx";

const EMOJI_OPTIONS = ["✨", "🔥", "💎", "🚀", "🎯", "📱", "💡", "🎨", "🏆", "🌟", "💼", "🎪", "🍕", "🎵", "⚡"];
const COLOR_OPTIONS = [
  { color: "#6366f1", bg: "#eef2ff", label: "Indigo" },
  { color: "#f97316", bg: "#fff7ed", label: "Orange" },
  { color: "#8b5cf6", bg: "#f5f3ff", label: "Purple" },
  { color: "#3b82f6", bg: "#eff6ff", label: "Blue" },
  { color: "#ec4899", bg: "#fdf2f8", label: "Pink" },
  { color: "#10b981", bg: "#ecfdf5", label: "Green" },
  { color: "#ef4444", bg: "#fef2f2", label: "Red" },
  { color: "#f59e0b", bg: "#fffbeb", label: "Amber" },
  { color: "#14b8a6", bg: "#f0fdfa", label: "Teal" },
  { color: "#64748b", bg: "#f8fafc", label: "Slate" },
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [pexelsKey, setPexelsKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savedApi, setSavedApi] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: "", username: "", displayName: "", niche: "", emoji: "✨",
    color: "#6366f1", bgColor: "#eef2ff", description: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("anthropic_api_key") ?? "";
    const storedPexels = localStorage.getItem("pexels_api_key") ?? "";
    setApiKey(stored);
    setPexelsKey(storedPexels);
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(data.accounts ?? []);
    setLoadingAccounts(false);
  };

  const handleSaveKeys = () => {
    localStorage.setItem("anthropic_api_key", apiKey);
    localStorage.setItem("pexels_api_key", pexelsKey);
    setSavedApi(true);
    setTimeout(() => setSavedApi(false), 2000);
  };

  const handleAddAccount = async () => {
    setFormError(null);
    if (!form.id || !form.username || !form.displayName || !form.niche) {
      setFormError("ID, username, nama tampilan, dan niche wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Gagal tambah akun."); return; }
      setShowForm(false);
      setForm({ id: "", username: "", displayName: "", niche: "", emoji: "✨", color: "#6366f1", bgColor: "#eef2ff", description: "" });
      loadAccounts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus akun ini? Data konten yang sudah di-generate tidak akan terhapus.")) return;
    setDeletingId(id);
    await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    loadAccounts();
  };

  const selectedColor = COLOR_OPTIONS.find((c) => c.color === form.color);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi platform KOL</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* API Keys */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key size={16} className="text-slate-400" />
              <h3 className="font-semibold text-slate-700">API Keys</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Anthropic API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-api..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 pr-10"
                  />
                  <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Dari console.anthropic.com → API Keys</p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Pexels API Key <span className="text-slate-400 font-normal">(opsional, untuk gambar tweet)</span>
                </label>
                <input
                  type="password"
                  value={pexelsKey}
                  onChange={(e) => setPexelsKey(e.target.value)}
                  placeholder="Pexels API key..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
                <p className="text-xs text-slate-400 mt-1">Dari pexels.com/api — gratis, 200 req/jam</p>
              </div>

              <button
                onClick={handleSaveKeys}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-all"
              >
                {savedApi ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {savedApi ? "Tersimpan!" : "Simpan Keys"}
              </button>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <h3 className="font-semibold text-slate-700">Manajemen Akun</h3>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-xs font-semibold hover:bg-sky-100 transition-all"
              >
                <Plus size={13} /> Tambah Akun
              </button>
            </div>

            {/* Add Account Form */}
            {showForm && (
              <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-600 mb-2">Akun Baru</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">ID Akun *</label>
                    <input
                      type="text"
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                      placeholder="cth: txtdrtechno"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Username X *</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="@txtdrtechno"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Nama Tampilan *</label>
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                      placeholder="txtdr techno"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Niche / Topik *</label>
                    <input
                      type="text"
                      value={form.niche}
                      onChange={(e) => setForm({ ...form, niche: e.target.value })}
                      placeholder="teknologi, crypto, dll"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Deskripsi</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Teknologi & gadget terkini"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Emoji</label>
                    <div className="flex flex-wrap gap-1">
                      {EMOJI_OPTIONS.map((em) => (
                        <button
                          key={em}
                          onClick={() => setForm({ ...form, emoji: em })}
                          className={clsx("w-7 h-7 rounded-lg text-sm flex items-center justify-center", form.emoji === em ? "bg-sky-100 ring-2 ring-sky-400" : "bg-white border border-slate-200 hover:bg-slate-50")}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Warna Aksen</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setForm({ ...form, color: c.color, bgColor: c.bg })}
                        title={c.label}
                        className={clsx("w-7 h-7 rounded-full border-2 transition-all", form.color === c.color ? "border-slate-400 scale-110" : "border-transparent")}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: form.bgColor }}>
                    {form.emoji}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{form.displayName || "Nama Akun"}</p>
                    <p className="text-[10px] font-medium" style={{ color: form.color }}>{form.username || "@username"}</p>
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertTriangle size={12} /> {formError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleAddAccount}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-all disabled:opacity-50"
                  >
                    {saving ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                    {saving ? "Menyimpan..." : "Tambah Akun"}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setFormError(null); }}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Account list */}
            {loadingAccounts ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: acc.bgColor }}>
                        {acc.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{acc.displayName}</p>
                        <p className="text-xs font-medium" style={{ color: acc.color }}>{acc.username}</p>
                      </div>
                      {acc.isCustom && (
                        <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">custom</span>
                      )}
                    </div>
                    {acc.isCustom && (
                      <button
                        onClick={() => handleDelete(acc.id)}
                        disabled={deletingId === acc.id}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        {deletingId === acc.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} className="text-slate-400" />
              <h3 className="font-semibold text-slate-700">Informasi Platform</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Model AI", value: "Claude Sonnet 4.6" },
                { label: "Konten per akun/hari", value: "8 konten (6 tweet + 2 thread panjang)" },
                { label: "Gambar per konten", value: "Maks 4 foto (via Pexels API)" },
                { label: "Schedule generate", value: "00:00 WIB otomatis" },
                { label: "Bahasa konten", value: "Bahasa Indonesia gaul, tanpa hashtag" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* .env setup */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-3 text-sm">Setup di .env.local (rekomendasi)</h3>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1">
              <p className="text-slate-500"># .env.local</p>
              <p>ANTHROPIC_API_KEY=sk-ant-api-...</p>
              <p>PEXELS_API_KEY=your-pexels-key</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
