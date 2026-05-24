import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAccount } from "@/lib/accounts-server";
import { buildGenerationPrompt } from "@/lib/prompts";
import { saveContent } from "@/lib/storage";
import type { GeneratedTweet } from "@/lib/types";
import { format } from "date-fns";

const client = new Anthropic();

function extractAndParseJSON(raw: string): GeneratedTweet[] | null {
  // Strip markdown code blocks if present
  const stripped = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Try to find JSON array
  const match = stripped.match(/\[[\s\S]*\]/);
  if (!match) return null;

  let jsonStr = match[0];

  // Fix common AI JSON mistakes:
  // 1. Unescaped newlines inside string values
  jsonStr = jsonStr.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
    m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
  );

  // 2. Trailing commas before ] or }
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(jsonStr) as GeneratedTweet[];
  } catch {
    // Last resort: try to parse with relaxed approach by extracting individual objects
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { accountId, date: dateParam } = await req.json();

    const account = getAccount(accountId);
    if (!account) {
      return NextResponse.json({ error: "Account tidak ditemukan" }, { status: 404 });
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return NextResponse.json(
        { error: "API key belum diisi. Isi ANTHROPIC_API_KEY di file .env.local lalu restart server." },
        { status: 401 }
      );
    }

    const date = dateParam ?? format(new Date(), "yyyy-MM-dd");
    const prompt = buildGenerationPrompt(account.niche, date);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const tweets = extractAndParseJSON(rawText);

    if (!tweets || tweets.length === 0) {
      // Log raw response for debugging
      console.error("[generate] Failed to parse JSON. Raw:", rawText.slice(0, 500));
      return NextResponse.json(
        { error: "AI menghasilkan format yang tidak valid. Coba generate ulang." },
        { status: 500 }
      );
    }

    const content = {
      accountId,
      date,
      generatedAt: new Date().toISOString(),
      tweets,
    };

    saveContent(content);

    return NextResponse.json({ success: true, content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isAuth = msg.includes("401") || msg.includes("authentication");
    return NextResponse.json(
      {
        error: isAuth
          ? "API key tidak valid. Cek ANTHROPIC_API_KEY di .env.local lalu restart server."
          : `Gagal generate: ${msg}`,
      },
      { status: isAuth ? 401 : 500 }
    );
  }
}
