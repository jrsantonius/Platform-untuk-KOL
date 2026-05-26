// Server-only. Do NOT import from client components.
import { redis } from "./redis";

export interface AffiliateLink {
  id: string;
  label: string; // nama produk / deskripsi singkat
  url: string;   // link Shopee affiliate
}

export async function getAffiliateLinks(accountId: string): Promise<AffiliateLink[]> {
  const links = await redis.get<AffiliateLink[]>(`affiliate:${accountId}`);
  return links ?? [];
}

export async function saveAffiliateLinks(accountId: string, links: AffiliateLink[]): Promise<void> {
  await redis.set(`affiliate:${accountId}`, links);
}
