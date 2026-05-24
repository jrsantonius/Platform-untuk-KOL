// Client-safe — no fs/path imports

export type Niche =
  | "kuliner"
  | "game"
  | "mahasiswa"
  | "dating"
  | "promo"
  | "cowok"
  | "otomotif"
  | string;

export interface Account {
  id: string;
  username: string;
  displayName: string;
  niche: Niche;
  color: string;
  bgColor: string;
  emoji: string;
  description: string;
  isCustom?: boolean;
}

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "txtdrkuliner",
    username: "@txtdrkuliner",
    displayName: "txtdr kuliner",
    niche: "kuliner",
    color: "#f97316",
    bgColor: "#fff7ed",
    emoji: "🍜",
    description: "Kuliner & food review",
  },
  {
    id: "txtdrgame",
    username: "@txtdrgame",
    displayName: "txtdr game",
    niche: "game",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    emoji: "🎮",
    description: "Gaming & esports",
  },
  {
    id: "txtdrmahasiswa",
    username: "@txtdrmahasiswa",
    displayName: "txtdr mahasiswa",
    niche: "mahasiswa",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    emoji: "📚",
    description: "Kehidupan mahasiswa",
  },
  {
    id: "txtdaridating",
    username: "@txtdaridating",
    displayName: "txtdari dating",
    niche: "dating",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    emoji: "💕",
    description: "Relationship & dating",
  },
  {
    id: "txtdaripromo",
    username: "@txtdaripromo",
    displayName: "txtdari promo",
    niche: "promo",
    color: "#10b981",
    bgColor: "#ecfdf5",
    emoji: "🏷️",
    description: "Promo & deals terbaik",
  },
  {
    id: "txtdaricowok",
    username: "@txtdaricowok",
    displayName: "txtdari cowok",
    niche: "cowok",
    color: "#64748b",
    bgColor: "#f8fafc",
    emoji: "💪",
    description: "Konten khusus pria",
  },
  {
    id: "txtdrotomotif",
    username: "@txtdrotomotif",
    displayName: "txtdr otomotif",
    niche: "otomotif",
    color: "#ef4444",
    bgColor: "#fef2f2",
    emoji: "🚗",
    description: "Otomotif & kendaraan",
  },
];

export const ACCOUNTS = DEFAULT_ACCOUNTS;

export function getDefaultAccount(id: string): Account | undefined {
  return DEFAULT_ACCOUNTS.find((a) => a.id === id);
}
