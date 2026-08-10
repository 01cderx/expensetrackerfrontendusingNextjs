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
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";
import { Expense, ExpenseSummary } from "@/lib/types";

const PALETTE = ["#2F6650", "#C15F3C", "#C9A24B", "#5B7FA6", "#8A5B9B", "#4A9B8E", "#8FB3A0"];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function DashboardPage() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [recent, setRecent] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          api.get("/expenses/summary"),
          api.get("/expenses"),
        ]);
        setSummary(summaryRes.data);
        setRecent(expensesRes.data.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = summary
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl italic text-ink mb-1">Overview</h1>
        <p className="text-ink/50 mb-8">Where your money has gone, at a glance.</p>

        {loading ? (
          <p className="text-ink/40">Loading…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <StatCard
                label="Total spent all time"
                value={formatCurrency(summary?.totalAllTime ?? 0)}
                accent="forest"
              />
              <StatCard
                label="Spent this month"
                value={formatCurrency(summary?.totalThisMonth ?? 0)}
                accent="clay"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/60 border border-ink/10 rounded-sm p-6">
                <h2 className="font-display text-lg text-forest-700 mb-4">
                  By category
                </h2>
                {chartData.length === 0 ? (
                  <p className="text-sm text-ink/40">
                    No expenses recorded yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {chartData.map((_, idx) => (
                          <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white/60 border border-ink/10 rounded-sm">
                <h2 className="font-display text-lg text-forest-700 px-6 pt-6 pb-4">
                  Recent expenses
                </h2>
                {recent.length === 0 ? (
                  <p className="px-6 pb-6 text-sm text-ink/40">Nothing logged yet.</p>
                ) : (
                  recent.map((e) => (
                    <div key={e.id} className="ledger-row flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-ink/40">{e.date}</p>
                      </div>
                      <span className="tabular text-sm text-clay">
                        −{formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
