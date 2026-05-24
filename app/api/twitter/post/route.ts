import { NextRequest, NextResponse } from "next/server";
import { getToken, saveToken } from "@/lib/twitter-tokens";

async function refreshToken(accountId: string) {
  const token = getToken(accountId);
  if (!token?.refreshToken) return null;

  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
  });

  const data = await res.json();
  if (!data.access_token) return null;

  const updated = {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    expiresAt: Date.now() + (data.expires_in ?? 7200) * 1000,
  };
  saveToken(accountId, updated);
  return updated;
}

async function getValidToken(accountId: string) {
  const token = getToken(accountId);
  if (!token) return null;
  // Refresh if expires within 5 minutes
  if (token.expiresAt - Date.now() < 5 * 60 * 1000) {
    return await refreshToken(accountId);
  }
  return token;
}

async function postTweet(text: string, accessToken: string, replyToId?: string) {
  const body: Record<string, unknown> = { text };
  if (replyToId) body.reply = { in_reply_to_tweet_id: replyToId };

  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  const { accountId, content, isThread, threadParts } = await req.json();

  const token = await getValidToken(accountId);
  if (!token) {
    return NextResponse.json(
      { error: "Akun belum terkoneksi atau token expired. Silakan connect ulang di halaman Koneksi X." },
      { status: 401 }
    );
  }

  try {
    if (isThread && Array.isArray(threadParts) && threadParts.length > 0) {
      const allParts = [content, ...threadParts];
      let lastId: string | undefined;
      const tweetIds: string[] = [];

      for (const part of allParts) {
        const result = await postTweet(part, token.accessToken, lastId);
        if (!result.data?.id) {
          return NextResponse.json(
            { error: `Gagal post bagian ${tweetIds.length + 1}: ${result.detail ?? result.title ?? "Unknown"}` },
            { status: 500 }
          );
        }
        lastId = result.data.id;
        tweetIds.push(result.data.id);
        // Delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 600));
      }

      return NextResponse.json({
        success: true,
        tweetIds,
        url: `https://twitter.com/i/web/status/${tweetIds[0]}`,
      });
    } else {
      const result = await postTweet(content, token.accessToken);
      if (!result.data?.id) {
        return NextResponse.json(
          { error: `Gagal post: ${result.detail ?? result.title ?? "Unknown"}` },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        tweetId: result.data.id,
        url: `https://twitter.com/i/web/status/${result.data.id}`,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: `Error: ${String(err)}` }, { status: 500 });
  }
}
