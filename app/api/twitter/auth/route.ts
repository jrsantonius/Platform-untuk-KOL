import { NextRequest, NextResponse } from "next/server";
import { savePKCE } from "@/lib/twitter-tokens";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "accountId required" }, { status: 400 });
  }

  const clientId = process.env.TWITTER_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(`${origin}/connect?error=TWITTER_CLIENT_ID belum diisi di environment variables`);
  }

  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("hex");

  await savePKCE(state, { codeVerifier, accountId });

  const callbackUrl =
    process.env.TWITTER_CALLBACK_URL ?? `${origin}/api/twitter/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return NextResponse.redirect(`https://twitter.com/i/oauth2/authorize?${params}`);
}
