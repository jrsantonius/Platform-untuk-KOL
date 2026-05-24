"use client";

import Sidebar from "@/components/Sidebar";
import { ACCOUNTS } from "@/lib/accounts";
import { Clock, CheckCircle2, Calendar, Zap, Info } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Jadwal & Otomasi</h1>
          <p className="text-slate-500 text-sm mt-1">
            Konten di-generate otomatis setiap hari pukul 00:00 WIB
          </p>
        </div>

        {/* Schedule Info */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 mb-1">Auto-Generate Harian</h2>
              <p className="text-slate-600 text-sm mb-3">
                Setiap hari pukul <span className="font-semibold text-sky-600">00:00 WIB</span>,
                platform akan otomatis generate 8 tweet untuk masing-masing akun (total{" "}
                <span className="font-semibold text-sky-600">{ACCOUNTS.length * 8} tweet/hari</span>).
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg inline-flex">
                <CheckCircle2 size={12} />
                Otomasi aktif
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Cara Kerja</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", title: "00:00 WIB", desc: "Scheduler aktif dan mulai proses generate konten untuk semua akun secara berurutan", icon: <Clock size={16} className="text-sky-500" /> },
              { step: "2", title: "AI Generate", desc: "Claude AI membuat 8 tweet viral per akun sesuai niche dan tren terkini", icon: <Zap size={16} className="text-violet-500" /> },
              { step: "3", title: "Siap Pakai", desc: "Konten tersimpan dan bisa langsung dicopy untuk diposting ke X/Twitter", icon: <CheckCircle2 size={16} className="text-emerald-500" /> },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Jadwal Per Akun</h3>
          </div>
          <div className="space-y-3">
            {ACCOUNTS.map((account, i) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: account.bgColor }}
                  >
                    {account.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{account.displayName}</p>
                    <p className="text-xs text-slate-400">{account.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Urutan generate</p>
                    <p className="text-sm font-semibold text-slate-700">#{i + 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Tweet/hari</p>
                    <p className="text-sm font-semibold" style={{ color: account.color }}>
                      8 tweet
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle2 size={11} />
                    Aktif
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Total: {ACCOUNTS.length} akun × 8 tweet = {ACCOUNTS.length * 8} tweet/hari</span>
            <span>Estimasi waktu generate: ~2-3 menit</span>
          </div>
        </div>

        {/* Setup Note */}
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-sm text-amber-700">
            <span className="font-semibold">Catatan:</span> Auto-generate berjalan selama aplikasi ini aktif di server.
            Untuk penggunaan production, jalankan{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">npm run start</code>{" "}
            dan pastikan server berjalan 24 jam. Scheduler akan trigger generate jam 00:00 WIB setiap hari.
          </p>
        </div>
      </main>
    </div>
  );
}
