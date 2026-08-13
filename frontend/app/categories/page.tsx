"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CategoryManager from "@/components/CategoryManager";
import api from "@/lib/api";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (c: Category) => {
    await api.post("/categories", c);
    await loadCategories();
  };

  const handleUpdate = async (id: number, c: Category) => {
    await api.put(`/categories/${id}`, c);
    await loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? Expenses in it will become uncategorized.")) return;
    await api.delete(`/categories/${id}`);
    await loadCategories();
  };

  return (
    <AppShell title="Categories" subtitle="Group your spending into what makes sense to you.">
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <CategoryManager
          categories={categories}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </AppShell>
  );
}
