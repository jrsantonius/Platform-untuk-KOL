import { NextRequest, NextResponse } from "next/server";
import { getAllAccounts } from "@/lib/accounts-server";
import { format } from "date-fns";

// Called by Vercel Cron every day at 00:00 WIB (17:00 UTC)
export async function GET(req: NextRequest) {
  // Protect endpoint with a secret token
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = format(new Date(), "yyyy-MM-dd");
  const baseUrl = new URL(req.url).origin;
  const allAccounts = await getAllAccounts();

  console.log(`[Cron] Starting daily generation for ${date}, ${allAccounts.length} accounts`);

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
    success: r.status === "fulfilled" && r.value?.success,
    error: r.status === "rejected" ? String(r.reason) : r.value?.error,
  }));

  console.log(`[Cron] Done:`, summary);
  return NextResponse.json({ success: true, date, summary });
}
