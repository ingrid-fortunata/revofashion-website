"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common";

interface AdminCategoryToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddClick: () => void;
  totalCount: number;
}

export function AdminCategoryToolbar({
  search,
  onSearchChange,
  onAddClick,
  totalCount,
}: AdminCategoryToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search categories by name or description..."
            value={search}
            onChange={onSearchChange}
          />
        </div>

        {/* Add Category Button */}
        <Button
          type="button"
          onClick={onAddClick}
          data-testid="add-category-button"
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-8.5 px-3.5 gap-1.5 shadow-sm shadow-primary-200/50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </Button>
      </div>

      <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
        <span>
          Showing <strong className="text-neutral-800">{totalCount}</strong> category records
        </span>
        {search && (
          <span className="text-neutral-400">Filtered by query: &ldquo;{search}&rdquo;</span>
        )}
      </div>
    </div>
  );
}
