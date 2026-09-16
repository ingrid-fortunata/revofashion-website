import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="w-full">
      {/* 2-Column Responsive Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column Skeleton (Gallery - Compact) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <div className="aspect-4/5 w-full max-w-sm sm:max-w-md mx-auto rounded-2xl bg-primary-100/50 animate-pulse" />
          <div className="flex justify-center gap-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-16 rounded-xl bg-primary-100/40 animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Right Column Skeleton (Details) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Back Link Skeleton */}
          <div className="h-4 w-28 rounded bg-primary-100/50 animate-pulse" />

          {/* Badges Skeleton */}
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-primary-100/60 animate-pulse" />
            <div className="h-6 w-28 rounded-md bg-neutral-100 animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-primary-100/40 animate-pulse" />
          </div>

          {/* Title & Price Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-9 w-3/4 rounded-lg bg-primary-100/60 animate-pulse" />
            <div className="h-8 w-32 rounded-lg bg-neutral-200/80 animate-pulse" />
          </div>

          {/* Specifications Box Skeleton */}
          <div className="rounded-2xl border border-primary-100/70 bg-primary-50/30 p-5 flex flex-col gap-4">
            <div className="h-4 w-36 rounded bg-primary-100/50 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white border border-neutral-100 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="h-4 w-40 rounded bg-neutral-200/70 animate-pulse" />
            <div className="h-4 w-full rounded bg-neutral-100 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-neutral-100 animate-pulse" />
          </div>

          {/* Action Button Skeleton */}
          <div className="border-t border-neutral-200/70 pt-6 flex gap-3">
            <div className="h-11 w-32 rounded-xl bg-neutral-100 animate-pulse" />
            <div className="h-11 flex-1 rounded-xl bg-primary-200/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
