import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-primary-100/80 bg-white shadow-xs">
      {/* Media Skeleton */}
      <div className="relative aspect-4/5 w-full bg-primary-50/50">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Tags */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>

        {/* Title */}
        <div className="mt-3 space-y-1.5">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="mt-3 h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
