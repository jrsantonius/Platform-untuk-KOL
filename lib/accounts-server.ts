// Server-only — uses fs/path. Do NOT import this from client components.
import fs from "fs";
import path from "path";
import { DEFAULT_ACCOUNTS } from "./accounts";
import type { Account } from "./accounts";

const CUSTOM_ACCOUNTS_FILE = path.join(process.cwd(), "data", "custom-accounts.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function loadCustomAccounts(): Account[] {
  ensureDataDir();
  if (!fs.existsSync(CUSTOM_ACCOUNTS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(CUSTOM_ACCOUNTS_FILE, "utf-8")) as Account[];
  } catch {
    return [];
  }
}

export function saveCustomAccounts(accounts: Account[]): void {
  ensureDataDir();
  fs.writeFileSync(CUSTOM_ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), "utf-8");
}

export function getAllAccounts(): Account[] {
  return [...DEFAULT_ACCOUNTS, ...loadCustomAccounts()];
}

export function getAccount(id: string): Account | undefined {
  return getAllAccounts().find((a) => a.id === id);
}
