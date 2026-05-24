import fs from "fs";
import path from "path";
import type { GeneratedTweet, DailyContent } from "./types";

export type { GeneratedTweet, DailyContent };

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(accountId: string, date: string): string {
  return path.join(DATA_DIR, `${accountId}_${date}.json`);
}

export function saveContent(content: DailyContent): void {
  ensureDir();
  const filePath = getFilePath(content.accountId, content.date);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
}

export function loadContent(accountId: string, date: string): DailyContent | null {
  ensureDir();
  const filePath = getFilePath(accountId, date);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as DailyContent;
  } catch {
    return null;
  }
}

export function loadAllContentForDate(date: string): DailyContent[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(`_${date}.json`));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, f), "utf-8");
    return JSON.parse(raw) as DailyContent;
  });
}

export function getAvailableDates(): string[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const dates = new Set<string>();
  for (const f of files) {
    const parts = f.replace(".json", "").split("_");
    if (parts.length >= 2) dates.add(parts[parts.length - 1]);
  }
  return Array.from(dates).sort().reverse();
}
