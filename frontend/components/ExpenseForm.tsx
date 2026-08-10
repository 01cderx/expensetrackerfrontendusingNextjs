"use client";

import { useState, useEffect, FormEvent } from "react";
import { Category, Expense } from "@/lib/types";

interface ExpenseFormProps {
  categories: Category[];
  initial?: Expense | null;
  onSubmit: (expense: Expense) => Promise<void>;
  onCancel: () => void;
}

const emptyExpense: Expense = {
  title: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  notes: "",
  categoryId: undefined,
};

export default function ExpenseForm({
  categories,
  initial,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<Expense>(initial ?? emptyExpense);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ?? emptyExpense);
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Give the expense a title.");
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 border border-ink/10 rounded-sm p-6 space-y-4"
    >
      <h3 className="font-display text-lg text-forest-700">
        {initial?.id ? "Edit expense" : "Add an expense"}
      </h3>

      {error && (
        <p className="text-sm text-clay bg-clay/10 border border-clay/30 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
          Title
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Coffee with Sam"
          className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-forest-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={form.amount || ""}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper tabular focus:border-forest-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
            Date
          </label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-forest-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
          Category
        </label>
        <select
          name="categoryId"
          value={form.categoryId ?? ""}
          onChange={handleChange}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-forest-500 outline-none"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          value={form.notes ?? ""}
          onChange={handleChange}
          rows={2}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-forest-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-forest-600 text-paper px-4 py-2 rounded-sm text-sm hover:bg-forest-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial?.id ? "Save changes" : "Add expense"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-ink/60 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
