import React from "react";

export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-neutral-200 rounded-lg" />
        <div className="h-4 w-72 bg-neutral-100 rounded-md" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-white border border-rose-100/80 shadow-xs shadow-rose-100/20 rounded-lg" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="p-4 bg-white border border-rose-100/80 shadow-xs shadow-rose-100/20 rounded-xl h-16 flex items-center justify-between gap-4">
        <div className="h-9 w-72 bg-neutral-100 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-rose-100/80 shadow-xs shadow-rose-100/20 rounded-xl p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
