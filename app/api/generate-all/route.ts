import { NextRequest, NextResponse } from "next/server";
import { getAllAccounts } from "@/lib/accounts-server";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const { date: dateParam } = await req.json().catch(() => ({}));
  const date = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const baseUrl = new URL(req.url).origin;

  const allAccounts = await getAllAccounts();
  const results = await Promise.allSettled(
    allAccounts.map((account) =>
      fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: account.id, date }),
      }).then((r) => r.json())
    )
  );

  const summary = results.map((r, i) => ({
    accountId: allAccounts[i].id,
    success: r.status === "fulfilled",
    error: r.status === "rejected" ? String(r.reason) : undefined,
  }));

  return NextResponse.json({ success: true, date, summary });
}
