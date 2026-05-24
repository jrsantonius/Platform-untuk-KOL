"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Account } from "@/lib/accounts";
import { LayoutDashboard, Settings, Zap, Calendar, Link2 } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts ?? []))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col min-h-screen fixed left-0 top-0 z-30 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">KOL Platform</p>
            <p className="text-xs text-slate-400 mt-0.5">Viral Content Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        <div className="mb-5">
          <SidebarLink href="/" icon={<LayoutDashboard size={15} />} label="Dashboard" active={pathname === "/"} />
          <SidebarLink href="/connect" icon={<Link2 size={15} />} label="Koneksi X" active={pathname === "/connect"} />
          <SidebarLink href="/schedule" icon={<Calendar size={15} />} label="Jadwal & Otomasi" active={pathname === "/schedule"} />
          <SidebarLink href="/settings" icon={<Settings size={15} />} label="Pengaturan" active={pathname === "/settings"} />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">
            Akun ({accounts.length})
          </p>
          <div className="space-y-0.5">
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className={clsx(
                  "sidebar-link flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm group",
                  pathname === `/accounts/${account.id}`
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: account.bgColor }}>
                  {account.emoji}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-xs truncate leading-none mb-0.5">{account.displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{account.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
          <p className="text-[10px] text-slate-400">Auto-generate aktif • 00:00 WIB</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "sidebar-link flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm mb-0.5",
        active ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      )}
    >
      <span className={active ? "text-sky-600" : "text-slate-400"}>{icon}</span>
      {label}
    </Link>
  );
}
