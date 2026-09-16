"use client";

import React from "react";
import { Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories by name or description..."
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
