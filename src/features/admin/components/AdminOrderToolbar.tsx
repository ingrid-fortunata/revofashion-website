"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common";

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
    <div className="bg-white p-4 rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-lg">
          <SearchInput
            placeholder="Search by Order #, recipient name, phone, or customer..."
            value={search}
            onChange={onSearchChange}
          />
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-neutral-600 hover:text-primary-700 hover:bg-primary-50/80 gap-1.5 h-8 px-2.5"
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
