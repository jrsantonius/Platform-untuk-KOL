import { NextRequest, NextResponse } from "next/server";
import { getPKCE, deletePKCE, saveToken } from "@/lib/twitter-tokens";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/connect?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/connect?error=Parameter tidak lengkap`);
  }

  const pkce = getPKCE(state);
  if (!pkce) {
    return NextResponse.redirect(`${origin}/connect?error=State tidak valid atau expired, coba lagi`);
  }

  const clientId = process.env.TWITTER_CLIENT_ID!;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
  const callbackUrl = process.env.TWITTER_CALLBACK_URL ?? `${origin}/api/twitter/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: callbackUrl,
      code_verifier: pkce.codeVerifier,
    }),
  });

  const tokenData = await tokenRes.json();
  deletePKCE(state);

  if (!tokenData.access_token) {
    const errMsg = tokenData.error_description ?? tokenData.error ?? "Gagal dapat token";
    return NextResponse.redirect(`${origin}/connect?error=${encodeURIComponent(errMsg)}`);
  }

  // Get user info
  const userRes = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  saveToken(pkce.accountId, {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? "",
    expiresAt: Date.now() + (tokenData.expires_in ?? 7200) * 1000,
    userId: userData.data?.id ?? "",
    username: userData.data?.username ?? "",
    accountId: pkce.accountId,
  });

  return NextResponse.redirect(`${origin}/connect?success=${encodeURIComponent(pkce.accountId)}`);
}
