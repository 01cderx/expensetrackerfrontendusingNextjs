"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl italic text-ink mb-1">Expenses</h1>
            <p className="text-ink/50">Every entry, in one ledger.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="bg-forest-600 text-paper px-4 py-2 rounded-sm text-sm hover:bg-forest-700 transition-colors"
            >
              + Add expense
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
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
          <p className="text-ink/40">Loading…</p>
        ) : (
          <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
