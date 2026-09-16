"use client";

import React from "react";
import { Search, X, Plus, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoriesQuery } from "@/features/products";
import { ProductGender } from "@/types/product";

interface AdminProductToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  categoryId: string;
  onCategoryChange: (catId: string) => void;
  gender: string;
  onGenderChange: (gender: string) => void;
  onAddClick: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalResults: number;
}

const GENDERS: (ProductGender | "All")[] = ["All", "Men", "Women", "Unisex", "Kids"];

export function AdminProductToolbar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  gender,
  onGenderChange,
  onAddClick,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}: AdminProductToolbarProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();

  return (
    <div className="bg-white p-4 rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Add Product Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={categoriesLoading}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g === "All" ? "" : g}>
                {g === "All" ? "All Genders" : g}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-neutral-600 hover:text-primary-700 hover:bg-primary-50/80 gap-1.5 h-8 px-2.5"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}

          {/* Add Product Button */}
          <Button
            type="button"
            onClick={onAddClick}
            data-testid="add-product-button"
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-8.5 px-3.5 gap-1.5 shadow-sm shadow-primary-200/50 ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
        <span>
          Showing <strong className="text-neutral-800">{totalResults}</strong> catalog items
        </span>
        {hasActiveFilters && (
          <span className="text-neutral-400">Filters currently applied</span>
        )}
      </div>
    </div>
  );
}
