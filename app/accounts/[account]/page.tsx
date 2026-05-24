"use client";

export const dynamic = "force-dynamic";

import { use, useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ContentCard from "@/components/ContentCard";
import ThreadCard from "@/components/ThreadCard";
import type { Account } from "@/lib/accounts";
import type { DailyContent } from "@/lib/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { RefreshCw, Sparkles, Twitter, Copy, CheckCheck, Clock, AlertTriangle, X } from "lucide-react";
import { clsx } from "clsx";

export default function AccountPage({
  params,
}: {
  params: Promise<{ account: string }>;
}) {
  const { account: accountId } = use(params);
  const today = format(new Date(), "yyyy-MM-dd");

  const [account, setAccount] = useState<Account | null>(null);
  const [content, setContent] = useState<DailyContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copyAll, setCopyAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    const res = await fetch(`/api/content?accountId=${accountId}&date=${today}`);
    const data = await res.json();
    setContent(data.content ?? null);
  }, [accountId, today]);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.accounts as Account[])?.find((a) => a.id === accountId);
        setAccount(found ?? null);
      })
      .catch(() => {});
    loadContent();
  }, [loadContent]);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, date: today }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Gagal generate konten.");
      } else {
        setContent(data.content);
      }
    } catch {
      setErrorMsg("Koneksi gagal. Pastikan server berjalan dan coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyAll = async () => {
    if (!content) return;
    const allTweets = content.tweets.map((t, i) => `[${i + 1}] ${t.content}`).join("\n\n---\n\n");
    await navigator.clipboard.writeText(allTweets);
    setCopyAll(true);
    setTimeout(() => setCopyAll(false), 2000);
  };

  if (!account) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm">Memuat akun...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div
            className="rounded-2xl p-6 mb-6 border"
            style={{ backgroundColor: account.bgColor, borderColor: `${account.color}22` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white"
                >
                  {account.emoji}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{account.displayName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Twitter size={12} style={{ color: account.color }} />
                    <span className="text-sm font-medium" style={{ color: account.color }}>
                      {account.username}
                    </span>
                    <span className="text-slate-400 text-xs">• {account.description}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {content && (
                  <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {copyAll ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copyAll ? "Tersalin!" : "Copy Semua"}
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
                    generating
                      ? "bg-white/70 text-slate-400 cursor-not-allowed"
                      : "text-white shadow-lg"
                  )}
                  style={
                    !generating
                      ? { backgroundColor: account.color, boxShadow: `0 4px 14px ${account.color}40` }
                      : {}
                  }
                >
                  {generating ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {generating ? "Generating..." : content ? "Regenerate" : "Generate Konten"}
                </button>
              </div>
            </div>

            {content && (
              <div className="flex items-center gap-4 mt-5 pt-4 border-t" style={{ borderColor: `${account.color}22` }}>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={11} />
                  Dibuat: {format(new Date(content.generatedAt), "HH:mm, d MMM", { locale: id })}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Sparkles size={11} />
                  {content.tweets.length} tweet siap posting
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color: account.color }}>
                  {content.tweets.filter((t) => t.estimatedEngagement === "viral").length} viral potential
                </div>
              </div>
            )}
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-2">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 flex-1">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Date badge */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Konten Hari Ini</h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        {generating ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-40" />
            ))}
          </div>
        ) : content ? (
          <div className="grid grid-cols-2 gap-4">
            {content.tweets.map((tweet, i) =>
              tweet.isThread ? (
                <ThreadCard key={i} tweet={tweet} index={i} accentColor={account.color} />
              ) : (
                <ContentCard key={i} tweet={tweet} index={i} accentColor={account.color} />
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4"
              style={{ backgroundColor: account.bgColor }}
            >
              {account.emoji}
            </div>
            <h3 className="text-slate-700 font-semibold mb-1">Belum ada konten hari ini</h3>
            <p className="text-slate-400 text-sm mb-5">
              Klik Generate untuk membuat 8 tweet viral untuk akun ini
            </p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg"
              style={{ backgroundColor: account.color, boxShadow: `0 4px 14px ${account.color}40` }}
            >
              <Sparkles size={14} />
              Generate Konten Sekarang
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
