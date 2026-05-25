import { NextRequest, NextResponse } from "next/server";
import {
  getAllAccounts,
  loadCustomAccounts,
  saveCustomAccounts,
} from "@/lib/accounts-server";
import type { Account } from "@/lib/accounts";

export const dynamic = "force-dynamic";

export async function GET() {
  const accounts = await getAllAccounts();
  return NextResponse.json({ accounts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, username, displayName, niche, color, bgColor, emoji, description } = body;

  if (!id || !username || !displayName || !niche) {
    return NextResponse.json({ error: "Field wajib: id, username, displayName, niche" }, { status: 400 });
  }

  const existing = await getAllAccounts();
  if (existing.find((a) => a.id === id)) {
    return NextResponse.json({ error: "ID akun sudah ada" }, { status: 409 });
  }

  const newAccount: Account = {
    id,
    username: username.startsWith("@") ? username : `@${username}`,
    displayName,
    niche,
    color: color ?? "#6366f1",
    bgColor: bgColor ?? "#eef2ff",
    emoji: emoji ?? "✨",
    description: description ?? niche,
    isCustom: true,
  };

  const customs = await loadCustomAccounts();
  customs.push(newAccount);
  await saveCustomAccounts(customs);

  return NextResponse.json({ success: true, account: newAccount });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

  const customs = await loadCustomAccounts();
  const filtered = customs.filter((a) => a.id !== id);

  if (filtered.length === customs.length) {
    return NextResponse.json({ error: "Akun tidak ditemukan atau bukan akun custom" }, { status: 404 });
  }

  await saveCustomAccounts(filtered);
  return NextResponse.json({ success: true });
}
