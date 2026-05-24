import { NextRequest, NextResponse } from "next/server";
import { removeToken } from "@/lib/twitter-tokens";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "accountId required" }, { status: 400 });
  }

  removeToken(accountId);
  return NextResponse.json({ success: true });
}
