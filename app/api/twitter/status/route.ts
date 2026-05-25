import { NextResponse } from "next/server";
import { loadTokens } from "@/lib/twitter-tokens";

export const dynamic = "force-dynamic";

export async function GET() {
  const tokens = await loadTokens();

  const status: Record<string, { connected: boolean; username: string; userId: string; expiresAt: number }> = {};

  for (const [accountId, token] of Object.entries(tokens)) {
    status[accountId] = {
      connected: true,
      username: token.username,
      userId: token.userId,
      expiresAt: token.expiresAt,
    };
  }

  return NextResponse.json({ status });
}
