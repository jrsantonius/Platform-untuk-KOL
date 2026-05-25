import { NextResponse } from "next/server";

// Scheduler now handled by Vercel Cron (vercel.json)
export async function GET() {
  return NextResponse.json({ status: "ok", scheduler: "vercel-cron" });
}
