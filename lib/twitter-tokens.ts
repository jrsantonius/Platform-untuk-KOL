// Server-only — uses Vercel KV. Do NOT import from client components.
import { kv } from "@vercel/kv";

export interface TwitterToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix ms timestamp
  userId: string;
  username: string;
  accountId: string;
}

// ── Token CRUD ────────────────────────────────────────────

export async function loadTokens(): Promise<Record<string, TwitterToken>> {
  const keys = await kv.keys("token:*");
  if (keys.length === 0) return {};
  const values = await Promise.all(keys.map((k) => kv.get<TwitterToken>(k)));
  const result: Record<string, TwitterToken> = {};
  keys.forEach((k, i) => {
    const token = values[i];
    if (token) result[k.replace("token:", "")] = token;
  });
  return result;
}

export async function saveToken(accountId: string, token: TwitterToken): Promise<void> {
  await kv.set(`token:${accountId}`, token);
}

export async function getToken(accountId: string): Promise<TwitterToken | null> {
  return kv.get<TwitterToken>(`token:${accountId}`);
}

export async function removeToken(accountId: string): Promise<void> {
  await kv.del(`token:${accountId}`);
}

// ── PKCE (temporary OAuth state storage) ─────────────────

interface PKCEEntry {
  codeVerifier: string;
  accountId: string;
  createdAt: number;
}

export async function savePKCE(
  state: string,
  data: { codeVerifier: string; accountId: string }
): Promise<void> {
  // Auto-expire after 10 minutes via KV TTL
  await kv.set(`pkce:${state}`, { ...data, createdAt: Date.now() }, { ex: 600 });
}

export async function getPKCE(state: string): Promise<PKCEEntry | null> {
  return kv.get<PKCEEntry>(`pkce:${state}`);
}

export async function deletePKCE(state: string): Promise<void> {
  await kv.del(`pkce:${state}`);
}
