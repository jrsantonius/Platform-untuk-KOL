"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import type { Account } from "@/lib/accounts";
import type { DailyContent } from "@/lib/types";
import Link from "next/link";
import {
  RefreshCw,
  Sparkles,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { clsx } from "clsx";

export default function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contents, setContents] = useState<DailyContent[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatingAccount, setGeneratingAccount] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadContents = useCallback(async () => {
    const res = await fetch(`/api/content?date=${today}`);
    const data = await res.json();
    setContents(data.contents ?? []);
  }, [today]);

  useEffect(() => {
    loadContents();
    fetch("/api/accounts").then((r) => r.json()).then((d) => setAccounts(d.accounts ?? [])).catch(() => {});
  }, [loadContents]);

  const handleGenerateAll = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      for (const account of accounts) {
        setGeneratingAccount(account.id);
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: account.id, date: today }),
        });
        if (!res.ok) {
          const data = await res.json();
          setErrorMsg(data.error ?? "Gagal generate salah satu akun.");
          break;
        }
        await loadContents();
      }
      setLastUpdated(format(new Date(), "HH:mm:ss"));
    } catch {
      setErrorMsg("Koneksi gagal. Coba lagi.");
    } finally {
      setGenerating(false);
      setGeneratingAccount(null);
    }
  };

  const handleGenerateSingle = async (accountId: string) => {
    setGeneratingAccount(accountId);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, date: today }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Gagal generate konten.");
      } else {
        await loadContents();
        setLastUpdated(format(new Date(), "HH:mm:ss"));
      }
    } catch {
      setErrorMsg("Koneksi gagal. Coba lagi.");
    } finally {
      setGeneratingAccount(null);
    }
  };

  const getContentForAccount = (accountId: string) =>
    contents.find((c) => c.accountId === accountId);

  const totalGenerated = accounts.filter((a) => getContentForAccount(a.id)).length;
  const totalTweets = contents.reduce((sum, c) => sum + (c.tweets?.length ?? 0), 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500 text-sm mt-1">
                {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
              </p>
            </div>
            <button
              onClick={handleGenerateAll}
              disabled={generating}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm",
                generating
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-sky-200"
              )}
            >
              {generating ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} />
              )}
              {generating
                ? `Generating ${generatingAccount ?? ""}...`
                : "Generate Semua Akun"}
            </button>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 flex-1">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <StatCard
              label="Akun Aktif"
              value={`${totalGenerated}/${accounts.length}`}
              sub="sudah punya konten hari ini"
              icon={<CheckCircle2 size={18} className="text-emerald-500" />}
              color="emerald"
            />
            <StatCard
              label="Total Tweet"
              value={String(totalTweets)}
              sub={`target ${accounts.length * 8} tweet/hari`}
              icon={<FileText size={18} className="text-sky-500" />}
              color="sky"
            />
            <StatCard
              label="Auto-Generate"
              value="00:00 WIB"
              sub={lastUpdated ? `Update terakhir: ${lastUpdated}` : "Setiap hari otomatis"}
              icon={<Clock size={18} className="text-violet-500" />}
              color="violet"
            />
          </div>
        </div>

        {/* Account Grid */}
        <div className="grid grid-cols-1 gap-4">
          {accounts.map((account) => {
            const content = getContentForAccount(account.id);
            const isGenerating = generatingAccount === account.id;

            return (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all hover:shadow-md"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm"
                        style={{ backgroundColor: account.bgColor }}
                      >
                        {account.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 text-sm">
                            {account.displayName}
                          </h3>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: account.bgColor,
                              color: account.color,
                            }}
                          >
                            {account.username}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {account.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {content ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                          <CheckCircle2 size={12} />
                          {content.tweets.length} tweet siap
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <AlertCircle size={12} />
                          Belum di-generate
                        </div>
                      )}
                      <button
                        onClick={() => handleGenerateSingle(account.id)}
                        disabled={isGenerating || (generating && generatingAccount !== account.id)}
                        className={clsx(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          isGenerating
                            ? "bg-sky-50 text-sky-500 cursor-wait"
                            : "bg-sky-50 text-sky-600 hover:bg-sky-100"
                        )}
                      >
                        {isGenerating ? (
                          <RefreshCw size={11} className="animate-spin" />
                        ) : (
                          <Sparkles size={11} />
                        )}
                        {isGenerating ? "Generating..." : content ? "Regenerate" : "Generate"}
                      </button>
                      <Link
                        href={`/accounts/${account.id}`}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
                      >
                        Lihat <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Tweet preview */}
                  {content && content.tweets.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {content.tweets.slice(0, 4).map((tweet, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-lg p-2.5 text-[11px] text-slate-600 leading-relaxed line-clamp-2"
                        >
                          {tweet.content}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {icon}
      </div>
      <p className={clsx("text-2xl font-bold text-slate-800")}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
