"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl italic text-ink mb-1">Categories</h1>
        <p className="text-ink/50 mb-8">Group your spending into what makes sense to you.</p>

        {loading ? (
          <p className="text-ink/40">Loading…</p>
        ) : (
          <CategoryManager
            categories={categories}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
