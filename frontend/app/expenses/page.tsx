"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import api from "@/lib/api";
import { Category, Expense, PagedResponse } from "@/lib/types";

const PAGE_SIZE = 15;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadData = async (targetPage = page) => {
    setLoading(true);
    const [expensesRes, categoriesRes] = await Promise.all([
      api.get<PagedResponse<Expense>>(`/expenses?page=${targetPage}&size=${PAGE_SIZE}`),
      api.get(categoriesEndpoint()),
    ]);
    setExpenses(expensesRes.data.content);
    setTotalPages(expensesRes.data.totalPages);
    setTotalElements(expensesRes.data.totalElements);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  const categoriesEndpoint = () => "/categories";

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCreateOrUpdate = async (expense: Expense) => {
    if (editing?.id) {
      await api.put(`/expenses/${editing.id}`, expense);
    } else {
      await api.post("/expenses", expense);
    }
    setShowForm(false);
    setEditing(null);
    // After adding/editing, jump back to page 0 so the change is visible
    // (list is sorted newest-first).
    setPage(0);
    await loadData(0);
  };

  const handleEdit = (expense: Expense) => {
    setEditing(expense);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    await loadData(page);
  };

  return (
    <AppShell
      title="Expenses"
      subtitle={`${totalElements} total entr${totalElements === 1 ? "y" : "ies"}`}
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
        <>
          <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-500">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
