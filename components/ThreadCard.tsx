"use client";

import { useState } from "react";
import type { GeneratedTweet } from "@/lib/types";
import { Copy, Check, ChevronDown, ChevronUp, Hash } from "lucide-react";
import { clsx } from "clsx";
import ImageSection from "./ImageSection";

interface ThreadCardProps {
  tweet: GeneratedTweet;
  index: number;
  accentColor: string;
  accountId?: string;
}

export default function ThreadCard({ tweet, index, accentColor, accountId }: ThreadCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const parts = tweet.threadParts ?? [];

  const handleCopyPart = async (text: string, i: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    const allText = [tweet.content, ...parts].join("\n\n");
    await navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="tweet-card bg-white rounded-2xl border-2 shadow-sm col-span-2" style={{ borderColor: `${accentColor}30` }}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {index + 1}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Hash size={10} /> Thread • {parts.length} bagian
            </span>
            <span className="text-[10px] font-semibold text-red-600">🔥 Viral</span>
          </div>
          <button
            onClick={handleCopyAll}
            className={clsx(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              copiedAll ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            )}
          >
            {copiedAll ? <Check size={12} /> : <Copy size={12} />}
            {copiedAll ? "Tersalin!" : "Copy Semua"}
          </button>
        </div>

        {/* Thread intro */}
        <p className="text-slate-800 font-semibold text-sm leading-relaxed">{tweet.content}</p>

        {/* Cover image for thread */}
        <ImageSection imageQuery={tweet.imageQuery} maxImages={2} />


      </div>

      {/* Expand/collapse */}
      <div className="border-t border-slate-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-all"
        >
          <span>{expanded ? "Sembunyikan thread" : `Lihat semua ${parts.length} bagian thread`}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Thread parts */}
      {expanded && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {parts.map((part, i) => (
            <div key={i} className="px-4 py-3 hover:bg-slate-50 transition-all group">
              {/* Part header */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: accentColor }}
                  >
                    {i + 1}
                  </span>
                  {i < parts.length - 1 && (
                    <div className="w-0.5 h-3 rounded-full" style={{ backgroundColor: `${accentColor}40` }} />
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{part}</p>
                <button
                  onClick={() => handleCopyPart(part, i)}
                  className={clsx(
                    "flex-shrink-0 p-1.5 rounded-lg text-xs transition-all opacity-0 group-hover:opacity-100",
                    copiedIndex === i ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400 hover:text-slate-600"
                  )}
                >
                  {copiedIndex === i ? <Check size={11} /> : <Copy size={11} />}
                </button>
              </div>

              {/* Image search link per thread part */}
              {tweet.imageQuery && (
                <div className="ml-8">
                  <ImageSection imageQuery={`${tweet.imageQuery} part ${i + 1}`} maxImages={1} compact />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
