"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/expenses", label: "Expenses" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span className="font-display italic text-xl text-forest-700 tracking-tight">
            Ledger
          </span>
          <nav className="hidden sm:flex items-center gap-6">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm pb-1 border-b-2 transition-colors ${
                    active
                      ? "border-forest-600 text-forest-700 font-medium"
                      : "border-transparent text-ink/60 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:inline text-sm text-ink/60">
              {user.name}
            </span>
          )}
          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-sm border border-ink/15 hover:border-clay hover:text-clay transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex items-center gap-5 px-6 pb-3">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm pb-1 border-b-2 ${
                active
                  ? "border-forest-600 text-forest-700 font-medium"
                  : "border-transparent text-ink/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
