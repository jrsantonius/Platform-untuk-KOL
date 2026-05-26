import { NextRequest, NextResponse } from "next/server";
import { getAffiliateLinks, saveAffiliateLinks, AffiliateLink } from "@/lib/affiliate";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

  const links = await getAffiliateLinks(accountId);
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const { accountId, label, url } = await req.json();
  if (!accountId || !url) return NextResponse.json({ error: "accountId dan url wajib diisi" }, { status: 400 });

  const links = await getAffiliateLinks(accountId);
  const newLink: AffiliateLink = {
    id: crypto.randomBytes(6).toString("hex"),
    label: label || url,
    url,
  };
  links.push(newLink);
  await saveAffiliateLinks(accountId, links);

  return NextResponse.json({ success: true, link: newLink });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const linkId = searchParams.get("id");
  if (!accountId || !linkId) return NextResponse.json({ error: "accountId dan id wajib" }, { status: 400 });

  const links = await getAffiliateLinks(accountId);
  const filtered = links.filter((l) => l.id !== linkId);
  await saveAffiliateLinks(accountId, filtered);

  return NextResponse.json({ success: true });
}
