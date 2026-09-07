"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { ProductFilterParams, ProductGender, ProductSize } from "@/types/product";

interface FashionFiltersProps {
  filters: ProductFilterParams;
  onChange: (updated: Partial<ProductFilterParams>) => void;
  onReset: () => void;
  totalProducts?: number;
  className?: string;
}

const GENDERS: { label: string; value: ProductGender | "All" }[] = [
  { label: "All Genders", value: "All" },
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Unisex", value: "Unisex" },
  { label: "Kids", value: "Kids" },
];

const SIZES: { label: string; value: ProductSize | "All" }[] = [
  { label: "All", value: "All" },
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
  { label: "Free Size", value: "FREE" },
];

const SORT_OPTIONS: { label: string; value: ProductFilterParams["sort_by"] }[] = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function FashionFilters({
  filters,
  onChange,
  onReset,
  totalProducts,
  className = "",
}: FashionFiltersProps) {
  const hasActiveFilters = Boolean(
    (filters.gender && filters.gender !== "All") ||
      (filters.size && filters.size !== "All") ||
      filters.sort_by ||
      filters.search ||
      filters.category_id
  );

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-rose-100/90 bg-white p-4 shadow-xs ${className}`}
    >
      {/* Top Bar: Title & Results Count & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Filters & Sorting
          </span>
          {totalProducts !== undefined && (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
              {totalProducts} {totalProducts === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Gender Filter */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Gender
          </label>
          <select
            value={filters.gender || "All"}
            onChange={(e) =>
              onChange({
                gender: e.target.value === "All" ? undefined : e.target.value,
                page: 1,
              })
            }
            className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/20 px-3 text-xs font-medium text-neutral-800 transition-colors focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 cursor-pointer"
          >
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Size
          </label>
          <select
            value={filters.size || "All"}
            onChange={(e) =>
              onChange({
                size: e.target.value === "All" ? undefined : e.target.value,
                page: 1,
              })
            }
            className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/20 px-3 text-xs font-medium text-neutral-800 transition-colors focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 cursor-pointer"
          >
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Sort Order
          </label>
          <select
            value={filters.sort_by || "newest"}
            onChange={(e) =>
              onChange({
                sort_by: e.target.value as ProductFilterParams["sort_by"],
                page: 1,
              })
            }
            className="h-9 w-full rounded-xl border border-rose-100 bg-rose-50/20 px-3 text-xs font-medium text-neutral-800 transition-colors focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-300 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
