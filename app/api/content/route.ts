import { NextRequest, NextResponse } from "next/server";
import { loadContent, loadAllContentForDate } from "@/lib/storage";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const date = searchParams.get("date") ?? format(new Date(), "yyyy-MM-dd");

  if (accountId) {
    const content = await loadContent(accountId, date);
    return NextResponse.json({ content });
  }

  const all = await loadAllContentForDate(date);
  return NextResponse.json({ contents: all });
}
