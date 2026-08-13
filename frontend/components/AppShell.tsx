"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-8">
          <div>
            <h1 className="font-display text-lg text-ink leading-none">{title}</h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action}
        </header>
        <main className="p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
