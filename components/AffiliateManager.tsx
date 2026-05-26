"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Trash2, RefreshCw, Link, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

interface AffiliateLink {
  id: string;
  label: string;
  url: string;
}

export default function AffiliateManager({ accountId, accentColor }: { accountId: string; accentColor: string }) {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/affiliate?accountId=${accountId}`);
    const data = await res.json();
    setLinks(data.links ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [accountId]);

  const handleAdd = async () => {
    if (!url.trim()) { setError("URL wajib diisi"); return; }
    setError(null);
    setSaving(true);
    await fetch("/api/affiliate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, label: label.trim() || url, url: url.trim() }),
    });
    setLabel("");
    setUrl("");
    setShowForm(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/affiliate?accountId=${accountId}&id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
            <ShoppingBag size={14} style={{ color: accentColor }} />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Link Affiliate Shopee</p>
            <p className="text-[10px] text-slate-400">Akan otomatis masuk ke 2 konten softsell saat generate</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(null); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Plus size={12} /> Tambah Link
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div>
            <label className="text-[10px] font-medium text-slate-500 mb-1 block">Nama Produk / Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="cth: Wajan anti lengket Shopee"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium text-slate-500 mb-1 block">URL Affiliate Shopee *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://shope.ee/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg">
              <AlertTriangle size={11} /> {error}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {saving ? <RefreshCw size={11} className="animate-spin" /> : <Plus size={11} />}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(null); setLabel(""); setUrl(""); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Links list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <ShoppingBag size={24} className="mx-auto mb-2 opacity-30" />
          <p className="text-xs">Belum ada link affiliate</p>
          <p className="text-[10px] mt-0.5">Tambahkan link Shopee affiliate kamu</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 group transition-all">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-orange-50 flex-shrink-0">
                <Link size={11} className="text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-700 truncate">{link.label}</p>
                <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
              </div>
              <button
                onClick={() => handleDelete(link.id)}
                disabled={deletingId === link.id}
                className={clsx(
                  "flex-shrink-0 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                  "text-slate-400 hover:text-red-500 hover:bg-red-50"
                )}
              >
                {deletingId === link.id
                  ? <RefreshCw size={11} className="animate-spin" />
                  : <Trash2 size={11} />}
              </button>
            </div>
          ))}
          {links.length < 2 && (
            <p className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg">
              ⚠️ Tambahkan minimal 2 link agar 2 konten affiliate bisa digenerate
            </p>
          )}
        </div>
      )}
    </div>
  );
}
