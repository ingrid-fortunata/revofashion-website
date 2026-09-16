"use client";

import React from "react";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";

interface CategoryFilterProps {
  selectedCategoryId?: number;
  onSelectCategory: (categoryId: number | undefined) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategoryId,
  onSelectCategory,
  className = "",
}: CategoryFilterProps) {
  // TanStack Query handles fetching, caching, and state without useEffect
  const { data: categories = [], isLoading } = useCategoriesQuery();

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val || val === "all") {
      onSelectCategory(undefined);
    } else {
      onSelectCategory(Number(val));
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Dropdown Selector */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="category-dropdown"
          className="text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap"
        >
          Category:
        </label>
        <select
          id="category-dropdown"
          aria-label="Filter by Category"
          value={selectedCategoryId !== undefined ? String(selectedCategoryId) : "all"}
          onChange={handleDropdownChange}
          disabled={isLoading}
          className="h-9 max-w-xs rounded-xl border border-primary-200/90 bg-white px-3 text-xs font-medium text-neutral-800 shadow-2xs transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 min-w-max pb-1">
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategoryId === undefined
                ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50"
                : "border border-primary-100/90 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50"
            }`}
          >
            All Categories
          </button>

          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-7 w-20 animate-pulse rounded-full bg-primary-100/40"
                />
              ))}
            </>
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    onSelectCategory(isSelected ? undefined : cat.id)
                  }
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50"
                      : "border border-primary-100/90 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
