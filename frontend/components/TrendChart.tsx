"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendPoint } from "@/lib/types";

export default function TrendChart({
  data,
  formatCurrency,
}: {
  data: TrendPoint[];
  formatCurrency: (n: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" width={40} />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        <Bar dataKey="income" name="Income" fill="#14B8A6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
