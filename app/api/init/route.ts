import { NextRequest, NextResponse } from "next/server";
import { startScheduler } from "@/lib/scheduler";

let initialized = false;

export async function GET(req: NextRequest) {
  if (!initialized) {
    const baseUrl = new URL(req.url).origin;
    startScheduler(baseUrl);
    initialized = true;
  }
  return NextResponse.json({ status: "ok" });
}
