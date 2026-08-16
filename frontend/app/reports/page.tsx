"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";
import { Report } from "@/lib/types";

const TrendChart = dynamic(() => import("@/components/TrendChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
      Loading chart…
    </div>
  ),
});

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const CATEGORY_PALETTE = ["#14B8A6", "#F43F5E", "#F59E0B", "#6366F1", "#8B5CF6", "#0EA5E9", "#94A3B8"];

export default function ReportsPage() {
  const now = new Date();
  const [mode, setMode] = useState<"monthly" | "yearly">("monthly");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("year", String(year));
    if (mode === "monthly") params.set("month", String(month));

    const res = await api.get<Report>(`/expenses/reports?${params.toString()}`);
    setReport(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, year, month]);

  const categoryEntries = report ? Object.entries(report.byCategory) : [];
  const maxCategoryAmount = categoryEntries.reduce((max, [, v]) => Math.max(max, v), 0);

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  return (
    <AppShell title="Reports" subtitle="Monthly and yearly breakdowns of income and spending.">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
          <button
            onClick={() => setMode("monthly")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "monthly" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setMode("yearly")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "yearly" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
            }`}
          >
            Yearly
          </button>
        </div>

        {mode === "monthly" && (
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:border-teal-500 outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        )}

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:border-teal-500 outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading || !report ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Income" value={formatCurrency(report.totalIncome)} icon={TrendingUp} tint="teal" />
            <StatCard label="Expenses" value={formatCurrency(report.totalExpense)} icon={TrendingDown} tint="rose" />
            <StatCard label="Net" value={formatCurrency(report.net)} icon={Scale} tint="amber" />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h2 className="font-display text-base text-ink mb-1">
                {mode === "monthly" ? "Daily" : "Monthly"} trend — {report.periodLabel}
              </h2>
              <p className="text-xs text-slate-500 mb-4">Income vs. expenses</p>
              {report.trend.every((t) => t.income === 0 && t.expense === 0) ? (
                <p className="text-sm text-slate-400 py-16 text-center">
                  No transactions in this period.
                </p>
              ) : (
                <TrendChart data={report.trend} formatCurrency={formatCurrency} />
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h2 className="font-display text-base text-ink mb-1">By category</h2>
              <p className="text-xs text-slate-500 mb-4">Expense breakdown for this period</p>
              {categoryEntries.length === 0 ? (
                <p className="text-sm text-slate-400 py-10 text-center">No expenses this period.</p>
              ) : (
                <div className="space-y-3">
                  {categoryEntries
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, amount], idx) => (
                      <div key={name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-ink">{name}</span>
                          <span className="tabular text-slate-500">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${maxCategoryAmount ? (amount / maxCategoryAmount) * 100 : 0}%`,
                              backgroundColor: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
                            }}
                          />
                        </div>
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
