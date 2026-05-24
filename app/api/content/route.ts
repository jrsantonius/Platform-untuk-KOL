import { NextRequest, NextResponse } from "next/server";
import { loadContent, loadAllContentForDate } from "@/lib/storage";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const date = searchParams.get("date") ?? format(new Date(), "yyyy-MM-dd");

  if (accountId) {
    const content = loadContent(accountId, date);
    return NextResponse.json({ content });
  }

  const all = loadAllContentForDate(date);
  return NextResponse.json({ contents: all });
}
