import type { Metadata } from "next";
import "./globals.css";
import SchedulerInit from "@/components/SchedulerInit";

export const metadata: Metadata = {
  title: "KOL Platform — Manage & Generate Viral Content",
  description: "Platform untuk memantau dan generate konten viral harian untuk akun X KOL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen antialiased">
        <SchedulerInit />
        {children}
      </body>
    </html>
  );
}
