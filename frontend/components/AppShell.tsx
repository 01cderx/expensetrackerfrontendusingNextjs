"use client";

import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop, mobile only, shown while the drawer is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      <div className="md:pl-64">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-ink shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg text-ink leading-none truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
        <main className="p-4 sm:p-6 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
