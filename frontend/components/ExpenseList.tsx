"use client";

import { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white/60 border border-dashed border-ink/20 rounded-sm p-10 text-center">
        <p className="font-display italic text-lg text-ink/60">
          No expenses yet.
        </p>
        <p className="text-sm text-ink/40 mt-1">
          Add your first one above to start the ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 border border-ink/10 rounded-sm">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="ledger-row flex items-center justify-between gap-4 px-6 py-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: expense.categoryColor || "#8FB3A0" }}
            />
            <div className="min-w-0">
              <p className="font-medium truncate">{expense.title}</p>
              <p className="text-xs text-ink/50">
                {formatDate(expense.date)}
                {expense.categoryName ? ` · ${expense.categoryName}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="tabular font-medium text-clay">
              −{formatCurrency(expense.amount)}
            </span>
            <button
              onClick={() => onEdit(expense)}
              className="text-xs text-ink/50 hover:text-forest-700"
            >
              Edit
            </button>
            <button
              onClick={() => expense.id && onDelete(expense.id)}
              className="text-xs text-ink/50 hover:text-clay"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
