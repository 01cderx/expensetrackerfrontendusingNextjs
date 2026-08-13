"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import api from "@/lib/api";
import { Category, Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [expensesRes, categoriesRes] = await Promise.all([
      api.get("/expenses"),
      api.get("/categories"),
    ]);
    setExpenses(expensesRes.data);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (expense: Expense) => {
    if (editing?.id) {
      await api.put(`/expenses/${editing.id}`, expense);
    } else {
      await api.post("/expenses", expense);
    }
    setShowForm(false);
    setEditing(null);
    await loadData();
  };

  const handleEdit = (expense: Expense) => {
    setEditing(expense);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    await loadData();
  };

  return (
    <AppShell
      title="Expenses"
      subtitle="Every entry, in one place."
      action={
        !showForm && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={16} /> Add expense
          </button>
        )
      }
    >
      {showForm && (
        <div className="mb-6">
          <ExpenseForm
            categories={categories}
            initial={editing}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </AppShell>
  );
}
