"use client";

import React, { useState, useMemo } from "react";
import { useCategoriesQuery } from "@/features/products";
import { Category } from "@/types/category";
import {
  AdminCategoryToolbar,
  AdminCategoryTable,
  CreateCategoryModal,
  EditCategoryModal,
  DeleteCategoryModal,
} from "@/features/admin";

export function AdminCategoryDashboard() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useCategoriesQuery();

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, search]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Category Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize fashion departments, apparel taxonomy, and catalog collections.
          </p>
        </div>
      </div>

      {/* Search & Action Toolbar */}
      <AdminCategoryToolbar
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => setIsCreateOpen(true)}
        totalCount={filteredCategories.length}
      />

      {/* Category Table */}
      <AdminCategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        onEdit={(cat) => setEditingCategory(cat)}
        onDelete={(cat) => setDeletingCategory(cat)}
      />

      {/* Modals */}
      <CreateCategoryModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditCategoryModal
        category={editingCategory}
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
      />

      <DeleteCategoryModal
        category={deletingCategory}
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
      />
    </div>
  );
}
