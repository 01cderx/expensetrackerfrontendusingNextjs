"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Wallet, TrendingDown, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";
import { Expense, ExpenseSummary } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

const PALETTE = ["#14B8A6", "#F43F5E", "#F59E0B", "#6366F1", "#8B5CF6", "#0EA5E9", "#94A3B8"];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [recent, setRecent] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          api.get("/expenses/summary"),
          api.get("/expenses?page=0&size=6"),
        ]);
        setSummary(summaryRes.data);
        setRecent(expensesRes.data.content);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = summary
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  const avgExpense =
    recent.length > 0 && summary
      ? summary.totalAllTime / Math.max(recent.length, 1)
      : 0;

  return (
    <AppShell
      title={`Welcome back, ${user?.name?.split(" ")[0] ?? ""} 👋`}
      subtitle="Here's where your money went."
      action={
        <Link
          href="/expenses"
          className="flex items-center gap-2 bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={16} /> Add expense
        </Link>
      }
    >
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Total spent all time"
              value={formatCurrency(summary?.totalAllTime ?? 0)}
              icon={Wallet}
              tint="teal"
            />
            <StatCard
              label="Spent this month"
              value={formatCurrency(summary?.totalThisMonth ?? 0)}
              icon={TrendingDown}
              tint="rose"
            />
            <StatCard
              label="Categories in use"
              value={String(Object.keys(summary?.byCategory ?? {}).length)}
              icon={Calendar}
              tint="amber"
            />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h2 className="font-display text-base text-ink mb-1">By category</h2>
              <p className="text-xs text-slate-500 mb-4">Share of total spend</p>
              {chartData.length === 0 ? (
                <p className="text-sm text-slate-400 py-10 text-center">
                  No expenses recorded yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {chartData.map((_, idx) => (
                        <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-100">
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 className="font-display text-base text-ink mb-1">
                    Recent expenses
                  </h2>
                  <p className="text-xs text-slate-500">Your latest entries</p>
                </div>
                <Link
                  href="/expenses"
                  className="text-xs text-teal-600 font-medium hover:underline"
                >
                  View all
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="px-6 pb-6 text-sm text-slate-400">Nothing logged yet.</p>
              ) : (
                <div className="pb-2">
                  {recent.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between px-6 py-3 border-b border-slate-50 last:border-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium shrink-0"
                          style={{
                            backgroundColor: `${e.categoryColor || "#94A3B8"}1A`,
                            color: e.categoryColor || "#64748B",
                          }}
                        >
                          {e.title.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">
                            {e.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {e.categoryName ?? "Uncategorized"} · {e.date}
                          </p>
                        </div>
                      </div>
                      <span className="tabular text-sm font-medium text-rose shrink-0">
                        −{formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
