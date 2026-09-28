import React from "react";
import { cn } from "@/lib/utils";

export interface TableSkeletonProps {
  rows?: number;
  rowHeight?: string;
  className?: string;
}

/**
 * Reusable loading skeleton for data tables and card lists.
 */
export function TableSkeleton({
  rows = 6,
  rowHeight = "h-14",
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 overflow-hidden p-4 space-y-3",
        className
      )}
    >
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={cn("bg-neutral-100/70 rounded-lg animate-pulse", rowHeight)}
        />
      ))}
    </div>
  );
}

export default TableSkeleton;
