"use client";

import { useState } from "react";
import { Send, Check, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { clsx } from "clsx";

interface PostButtonProps {
  accountId: string;
  content: string;
  isThread?: boolean;
  threadParts?: string[];
  /** compact = small inline button (for cards), default = regular button */
  compact?: boolean;
}

type PostState = "idle" | "posting" | "success" | "error";

export default function PostButton({ accountId, content, isThread, threadParts, compact }: PostButtonProps) {
  const [state, setState] = useState<PostState>("idle");
  const [tweetUrl, setTweetUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePost = async () => {
    if (state === "posting") return;
    setState("posting");
    setErrorMsg(null);
    setTweetUrl(null);

    try {
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, content, isThread, threadParts }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Gagal posting. Coba lagi.");
        setState("error");
        return;
      }

      setTweetUrl(data.url);
      setState("success");
      // Reset after 10 seconds so user can post again if needed
      setTimeout(() => setState("idle"), 10000);
    } catch (err) {
      setErrorMsg(`Error: ${String(err)}`);
      setState("error");
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handlePost}
          disabled={state === "posting" || state === "success"}
          className={clsx(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            state === "success"
              ? "bg-emerald-50 text-emerald-600"
              : state === "error"
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : state === "posting"
              ? "bg-sky-50 text-sky-500 cursor-not-allowed"
              : "bg-sky-50 text-sky-600 hover:bg-sky-100"
          )}
          title={errorMsg ?? undefined}
        >
          {state === "posting" && <Loader2 size={11} className="animate-spin" />}
          {state === "success" && <Check size={11} />}
          {state === "error" && <AlertCircle size={11} />}
          {state === "idle" && <Send size={11} />}
          {state === "posting" ? "Posting..." : state === "success" ? "Terposting!" : state === "error" ? "Gagal" : "Post ke X"}
        </button>
        {state === "success" && tweetUrl && (
          <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-500 hover:underline flex items-center gap-0.5">
            Lihat <ExternalLink size={9} />
          </a>
        )}
        {state === "error" && errorMsg && (
          <span className="text-[10px] text-red-500 max-w-[160px] truncate" title={errorMsg}>{errorMsg}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handlePost}
        disabled={state === "posting" || state === "success"}
        className={clsx(
          "flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-full",
          state === "success"
            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
            : state === "error"
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            : state === "posting"
            ? "bg-sky-100 text-sky-500 border border-sky-200 cursor-not-allowed"
            : "bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
        )}
      >
        {state === "posting" && <Loader2 size={14} className="animate-spin" />}
        {state === "success" && <Check size={14} />}
        {state === "error" && <AlertCircle size={14} />}
        {state === "idle" && <Send size={14} />}
        {state === "posting"
          ? isThread ? "Posting thread..." : "Memposting..."
          : state === "success"
          ? "Berhasil diposting!"
          : state === "error"
          ? "Gagal, coba lagi"
          : isThread
          ? "Post Thread ke X"
          : "Post ke X"}
      </button>

      {state === "success" && tweetUrl && (
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-sky-500 hover:text-sky-700 hover:underline"
        >
          Lihat tweet <ExternalLink size={11} />
        </a>
      )}

      {state === "error" && errorMsg && (
        <p className="text-xs text-red-500 text-center leading-relaxed">{errorMsg}</p>
      )}
    </div>
  );
}
