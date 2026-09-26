"use client";

import React from "react";
import { Search, X, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUserToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onAddClick: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalResults: number;
}

export function AdminUserToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  onAddClick,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}: AdminUserToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 space-y-3">
      {/* Top Filter and Actions Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-neutral-300 bg-white placeholder:text-neutral-400 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-700 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 whitespace-nowrap hidden sm:inline">
              Role:
            </label>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 whitespace-nowrap hidden sm:inline">
              Status:
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Deactivated</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8.5 px-2.5 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}

          {/* Add User Action Button */}
          <Button
            type="button"
            onClick={onAddClick}
            data-testid="add-user-button"
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-8.5 px-3.5 gap-1.5 shadow-sm shadow-primary-200/50 ml-auto sm:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add User
          </Button>
        </div>
      </div>

      {/* Bottom Summary Info */}
      <div className="text-[11px] text-neutral-500 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100">
        <span>
          Showing <strong className="text-neutral-800">{totalResults}</strong> user record{totalResults === 1 ? "" : "s"}
        </span>
        {hasActiveFilters && (
          <span className="text-neutral-400">
            Active filters:{" "}
            {[
              search && `Query "${search}"`,
              role && `Role: ${role}`,
              status && `Status: ${status}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}
