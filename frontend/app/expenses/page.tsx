"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Debounce search input so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 0 whenever a filter changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, typeFilter, categoryFilter]);

  const loadData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(PAGE_SIZE));
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);

    const [expensesRes, categoriesRes] = await Promise.all([
      api.get<PagedResponse<Expense>>(`/expenses?${params.toString()}`),
      api.get("/categories"),
    ]);
    setExpenses(expensesRes.data.content ?? []);
    setTotalPages(expensesRes.data.totalPages ?? 0);
    setTotalElements(expensesRes.data.totalElements ?? 0);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, typeFilter, categoryFilter]);

  const handleCreateOrUpdate = async (expense: Expense) => {
    if (editing?.id) {
      await api.put(`/expenses/${editing.id}`, expense);
    } else {
      await api.post("/expenses", expense);
    }
    setShowForm(false);
    setEditing(null);
    setPage(0);
    await loadData();
  };

  const handleEdit = (expense: Expense) => {
    setEditing(expense);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    await api.delete(`/expenses/${id}`);
    await loadData();
  };

  const hasActiveFilters = search || typeFilter || categoryFilter;

  return (
    <AppShell
      title="Transactions"
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
            <Plus size={16} /> Add
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

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:border-teal-500 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:border-teal-500 outline-none"
        >
          <option value="">All types</option>
          <option value="EXPENSE">Expenses</option>
          <option value="INCOME">Income</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:border-teal-500 outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : expenses.length === 0 && hasActiveFilters ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-slate-500">No transactions match your filters.</p>
        </div>
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
