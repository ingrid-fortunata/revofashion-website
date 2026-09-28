"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService, useCategoriesQuery } from "@/features/products";
import { Product } from "@/types/product";
import {
  AdminProductMetrics,
  AdminProductToolbar,
  AdminProductTable,
  CreateProductModal,
  EditProductModal,
  DeleteProductModal,
} from "@/features/admin";

export function AdminProductDashboard() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Fetch categories
  const { data: categories = [] } = useCategoriesQuery();

  // Query products with active filters
  const {
    data: productData,
    isLoading,
  } = useQuery({
    queryKey: [
      "admin-products",
      {
        page,
        per_page: pageSize,
        search: search.trim() || undefined,
        category_id: categoryId ? parseInt(categoryId, 10) : undefined,
        gender: gender && gender !== "All" ? gender : undefined,
      },
    ],
    queryFn: () =>
      productService.getProducts({
        page,
        per_page: pageSize,
        search: search.trim() || undefined,
        category_id: categoryId ? parseInt(categoryId, 10) : undefined,
        gender: gender && gender !== "All" ? gender : undefined,
      }),
    staleTime: 30 * 1000,
  });

  const products = productData?.data || [];
  const totalProducts = productData?.total || 0;
  const totalPages = productData?.pages || 1;

  // Handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    setPage(1);
  };

  const handleGenderChange = (g: string) => {
    setGender(g);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setGender("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || categoryId || gender);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Product Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your apparel catalog, monitor stock thresholds, and configure pricing.
          </p>
        </div>
      </div>

      {/* KPI Metric Summary Header */}
      <AdminProductMetrics
        products={products}
        totalCount={totalProducts}
      />

      {/* Filter and Action Toolbar */}
      <AdminProductToolbar
        search={search}
        onSearchChange={handleSearchChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        gender={gender}
        onGenderChange={handleGenderChange}
        onAddClick={() => setIsCreateOpen(true)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalResults={totalProducts}
      />

      {/* Product Management Table */}
      <AdminProductTable
        products={products}
        categories={categories}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalProducts={totalProducts}
        pageSize={pageSize}
        onPageChange={setPage}
        onEdit={(prod) => setEditingProduct(prod)}
        onDelete={(prod) => setDeletingProduct(prod)}
      />

      {/* Modals */}
      <CreateProductModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditProductModal
        product={editingProduct}
        open={Boolean(editingProduct)}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      />

      <DeleteProductModal
        product={deletingProduct}
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
      />
    </div>
  );
}
