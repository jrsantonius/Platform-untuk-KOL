import { NextRequest, NextResponse } from "next/server";
import type { TweetImage } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const count = Math.min(parseInt(searchParams.get("count") ?? "4"), 4);

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ images: [], error: "PEXELS_API_KEY not set" });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );

    if (!res.ok) {
      return NextResponse.json({ images: [], error: `Pexels error: ${res.status}` });
    }

    const data = await res.json();

    const images: TweetImage[] = (data.photos ?? []).map(
      (photo: {
        src: { large: string; medium: string };
        alt: string;
        photographer: string;
        photographer_url: string;
      }) => ({
        url: photo.src.large,
        thumbUrl: photo.src.medium,
        alt: photo.alt ?? query,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      })
    );

    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json({ images: [], error: String(err) });
  }
}
