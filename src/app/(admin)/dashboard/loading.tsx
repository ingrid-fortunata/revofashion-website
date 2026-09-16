import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-72 bg-neutral-100 rounded-md" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-primary-100/80 shadow-xs shadow-primary-100/20 rounded-xl h-24 flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-3 w-20 bg-neutral-200 rounded" />
              <div className="h-6 w-12 bg-neutral-200 rounded" />
              <div className="h-2.5 w-28 bg-neutral-100 rounded" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-50" />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="p-4 bg-white border border-primary-100/80 shadow-xs shadow-primary-100/20 rounded-xl h-16 flex items-center justify-between gap-4">
        <div className="h-9 w-64 bg-neutral-100 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-neutral-100 rounded-lg" />
          <div className="h-9 w-28 bg-neutral-100 rounded-lg" />
          <div className="h-9 w-32 bg-primary-100 rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-primary-100/80 shadow-xs shadow-primary-100/20 rounded-xl p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
