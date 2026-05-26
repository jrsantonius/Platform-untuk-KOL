"use client";

import { useState } from "react";
import type { GeneratedTweet } from "@/lib/types";
import { Copy, Check, TrendingUp, Zap, MessageCircle, Info, Heart, Star } from "lucide-react";
import { clsx } from "clsx";
import ImageSection from "./ImageSection";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  hot_take: { label: "Hot Take", icon: <Zap size={10} />, color: "bg-orange-100 text-orange-600" },
  tips: { label: "Tips", icon: <Star size={10} />, color: "bg-blue-100 text-blue-600" },
  meme: { label: "Meme", icon: <MessageCircle size={10} />, color: "bg-pink-100 text-pink-600" },
  question: { label: "Pertanyaan", icon: <MessageCircle size={10} />, color: "bg-teal-100 text-teal-600" },
  info: { label: "Info", icon: <Info size={10} />, color: "bg-sky-100 text-sky-600" },
  relatable: { label: "Relatable", icon: <Heart size={10} />, color: "bg-rose-100 text-rose-600" },
  promo: { label: "Promo", icon: <TrendingUp size={10} />, color: "bg-green-100 text-green-600" },
  story: { label: "Story", icon: <Star size={10} />, color: "bg-amber-100 text-amber-600" },
};

const ENGAGEMENT_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "text-amber-600" },
  medium: { label: "Medium", color: "text-slate-500" },
  viral: { label: "🔥 Viral", color: "text-red-600 font-semibold" },
};

interface ContentCardProps {
  tweet: GeneratedTweet;
  index: number;
  accentColor: string;
  accountId?: string;
}

export default function ContentCard({ tweet, index, accentColor, accountId }: ContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tweet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeConf = TYPE_CONFIG[tweet.type] ?? { label: tweet.type, icon: <Star size={10} />, color: "bg-slate-100 text-slate-600" };
  const engConf = ENGAGEMENT_CONFIG[tweet.estimatedEngagement] ?? { label: tweet.estimatedEngagement, color: "text-slate-500" };
  const charCount = tweet.content.length;
  const charPercent = Math.min((charCount / 280) * 100, 100);

  return (
    <div className="tweet-card bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:border-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </span>
          <span className={clsx("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", typeConf.color)}>
            {typeConf.icon} {typeConf.label}
          </span>
          <span className={clsx("text-[10px] font-medium", engConf.color)}>{engConf.label}</span>
        </div>
        <button
          onClick={handleCopy}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            copied ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          )}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Content */}
      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{tweet.content}</p>

      {/* Images */}
      <ImageSection imageQuery={tweet.imageQuery} maxImages={4} />

      {/* Char count */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full", charPercent > 90 ? "bg-red-400" : charPercent > 70 ? "bg-amber-400" : "bg-emerald-400")}
            style={{ width: `${charPercent}%` }}
          />
        </div>
        <span className={clsx("text-[10px] font-medium tabular-nums", charPercent > 90 ? "text-red-500" : "text-slate-400")}>
          {charCount}/280
        </span>
      </div>


    </div>
  );
}
