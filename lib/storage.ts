// Server-only — uses Vercel KV. Do NOT import from client components.
import { kv } from "@vercel/kv";
import type { GeneratedTweet, DailyContent } from "./types";

export type { GeneratedTweet, DailyContent };

export async function saveContent(content: DailyContent): Promise<void> {
  await kv.set(`content:${content.accountId}:${content.date}`, content);
  // Track known dates in a set for easy lookup
  await kv.sadd("dates", content.date);
}

export async function loadContent(accountId: string, date: string): Promise<DailyContent | null> {
  return kv.get<DailyContent>(`content:${accountId}:${date}`);
}

export async function loadAllContentForDate(date: string): Promise<DailyContent[]> {
  const keys = await kv.keys(`content:*:${date}`);
  if (keys.length === 0) return [];
  const values = await Promise.all(keys.map((k) => kv.get<DailyContent>(k)));
  return values.filter(Boolean) as DailyContent[];
}

export async function getAvailableDates(): Promise<string[]> {
  const dates = await kv.smembers("dates");
  return (dates as string[]).sort().reverse();
}
