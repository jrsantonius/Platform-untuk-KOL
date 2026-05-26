// Server-only. Do NOT import from client components.
import { redis } from "./redis";

export interface TwitterToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  username: string;
  accountId: string;
}

export async function loadTokens(): Promise<Record<string, TwitterToken>> {
  const keys = await redis.keys("token:*");
  if (keys.length === 0) return {};
  const values = await Promise.all(keys.map((k) => redis.get<TwitterToken>(k)));
  const result: Record<string, TwitterToken> = {};
  keys.forEach((k, i) => {
    const token = values[i];
    if (token) result[k.replace("token:", "")] = token;
  });
  return result;
}

export async function saveToken(accountId: string, token: TwitterToken): Promise<void> {
  await redis.set(`token:${accountId}`, token);
}

export async function getToken(accountId: string): Promise<TwitterToken | null> {
  return redis.get<TwitterToken>(`token:${accountId}`);
}

export async function removeToken(accountId: string): Promise<void> {
  await redis.del(`token:${accountId}`);
}

// ── PKCE ─────────────────────────────────────────────────

interface PKCEEntry { codeVerifier: string; accountId: string; createdAt: number; }

export async function savePKCE(state: string, data: { codeVerifier: string; accountId: string }): Promise<void> {
  await redis.set(`pkce:${state}`, { ...data, createdAt: Date.now() }, { ex: 600 });
}

export async function getPKCE(state: string): Promise<PKCEEntry | null> {
  return redis.get<PKCEEntry>(`pkce:${state}`);
}

export async function deletePKCE(state: string): Promise<void> {
  await redis.del(`pkce:${state}`);
}
