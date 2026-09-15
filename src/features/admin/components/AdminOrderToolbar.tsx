"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminOrderToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
}

export function AdminOrderToolbar({
  search,
  onSearchChange,
  onReset,
  hasActiveFilters,
  totalCount,
}: AdminOrderToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-rose-100/80 shadow-xs shadow-rose-100/20 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order #, recipient name, phone, or customer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-neutral-600 hover:text-rose-700 hover:bg-rose-50/80 gap-1.5 h-8 px-2.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </Button>
        )}
      </div>

      <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
        <span>
          Showing <strong className="text-neutral-800">{totalCount}</strong> order records
        </span>
        {search && (
          <span className="text-neutral-400">Search: &ldquo;{search}&rdquo;</span>
        )}
      </div>
    </div>
  );
}
