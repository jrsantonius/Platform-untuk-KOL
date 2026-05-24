// Server-only — uses fs. Do NOT import from client components.
import fs from "fs";
import path from "path";

export interface TwitterToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix ms timestamp
  userId: string;
  username: string;
  accountId: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const TOKENS_FILE = path.join(DATA_DIR, "twitter-tokens.json");
const PKCE_FILE = path.join(DATA_DIR, "twitter-pkce.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Token CRUD ────────────────────────────────────────────

export function loadTokens(): Record<string, TwitterToken> {
  ensureDir();
  if (!fs.existsSync(TOKENS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8")); } catch { return {}; }
}

export function saveToken(accountId: string, token: TwitterToken): void {
  ensureDir();
  const tokens = loadTokens();
  tokens[accountId] = token;
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export function getToken(accountId: string): TwitterToken | null {
  return loadTokens()[accountId] ?? null;
}

export function removeToken(accountId: string): void {
  ensureDir();
  const tokens = loadTokens();
  delete tokens[accountId];
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// ── PKCE (temporary OAuth state storage) ─────────────────

interface PKCEEntry { codeVerifier: string; accountId: string; createdAt: number; }

function loadPKCE(): Record<string, PKCEEntry> {
  ensureDir();
  if (!fs.existsSync(PKCE_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PKCE_FILE, "utf-8")); } catch { return {}; }
}

export function savePKCE(state: string, data: { codeVerifier: string; accountId: string }): void {
  const pkce = loadPKCE();
  pkce[state] = { ...data, createdAt: Date.now() };
  // Clean up old entries (> 10 min)
  for (const key of Object.keys(pkce)) {
    if (Date.now() - pkce[key].createdAt > 10 * 60 * 1000) delete pkce[key];
  }
  fs.writeFileSync(PKCE_FILE, JSON.stringify(pkce, null, 2));
}

export function getPKCE(state: string): PKCEEntry | null {
  return loadPKCE()[state] ?? null;
}

export function deletePKCE(state: string): void {
  const pkce = loadPKCE();
  delete pkce[state];
  fs.writeFileSync(PKCE_FILE, JSON.stringify(pkce, null, 2));
}
