// Server-only. Do NOT import from client components.
import { redis } from "./redis";
import { DEFAULT_ACCOUNTS } from "./accounts";
import type { Account } from "./accounts";

export async function loadCustomAccounts(): Promise<Account[]> {
  const accounts = await redis.get<Account[]>("custom-accounts");
  return accounts ?? [];
}

export async function saveCustomAccounts(accounts: Account[]): Promise<void> {
  await redis.set("custom-accounts", accounts);
}

export async function getAllAccounts(): Promise<Account[]> {
  const custom = await loadCustomAccounts();
  return [...DEFAULT_ACCOUNTS, ...custom];
}

export async function getAccount(id: string): Promise<Account | undefined> {
  const all = await getAllAccounts();
  return all.find((a) => a.id === id);
}
