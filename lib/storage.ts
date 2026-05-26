// Server-only. Do NOT import from client components.
import { redis } from "./redis";
import type { GeneratedTweet, DailyContent } from "./types";

export type { GeneratedTweet, DailyContent };

export async function saveContent(content: DailyContent): Promise<void> {
  await redis.set(`content:${content.accountId}:${content.date}`, content);
  await redis.sadd("dates", content.date);
}

export async function loadContent(accountId: string, date: string): Promise<DailyContent | null> {
  return redis.get<DailyContent>(`content:${accountId}:${date}`);
}

export async function loadAllContentForDate(date: string): Promise<DailyContent[]> {
  const keys = await redis.keys(`content:*:${date}`);
  if (keys.length === 0) return [];
  const values = await Promise.all(keys.map((k) => redis.get<DailyContent>(k)));
  return values.filter(Boolean) as DailyContent[];
}

export async function getAvailableDates(): Promise<string[]> {
  const dates = await redis.smembers("dates");
  return (dates as string[]).sort().reverse();
}
