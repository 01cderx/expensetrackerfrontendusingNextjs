"use client";

import { useState, FormEvent } from "react";
import { Category } from "@/lib/types";

const SWATCHES = ["#2F6650", "#C15F3C", "#C9A24B", "#5B7FA6", "#8A5B9B", "#4A9B8E"];

export default function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  categories: Category[];
  onCreate: (c: Category) => Promise<void>;
  onUpdate: (id: number, c: Category) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(SWATCHES[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setColor(SWATCHES[0]);
    setEditingId(null);
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id ?? null);
    setName(c.name);
    setColor(c.color || SWATCHES[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Category needs a name.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await onUpdate(editingId, { name, color });
      } else {
        await onCreate({ name, color });
      }
      resetForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 border border-ink/10 rounded-sm p-6 space-y-4 h-fit"
      >
        <h3 className="font-display text-lg text-forest-700">
          {editingId ? "Edit category" : "New category"}
        </h3>

        {error && (
          <p className="text-sm text-clay bg-clay/10 border border-clay/30 rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/50 mb-1">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Groceries"
            className="w-full border border-ink/15 rounded-sm px-3 py-2 bg-paper focus:border-forest-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-ink/50 mb-2">
            Color
          </label>
          <div className="flex gap-2">
            {SWATCHES.map((sw) => (
              <button
                type="button"
                key={sw}
                onClick={() => setColor(sw)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  color === sw ? "border-ink scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: sw }}
                aria-label={`Choose color ${sw}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-forest-600 text-paper px-4 py-2 rounded-sm text-sm hover:bg-forest-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : editingId ? "Save changes" : "Add category"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-ink/60 hover:text-ink">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white/60 border border-ink/10 rounded-sm">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-ink/50">No categories yet — create one to organize your expenses.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="ledger-row flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-medium">{c.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => startEdit(c)} className="text-xs text-ink/50 hover:text-forest-700">
                  Edit
                </button>
                <button
                  onClick={() => c.id && onDelete(c.id)}
                  className="text-xs text-ink/50 hover:text-clay"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
