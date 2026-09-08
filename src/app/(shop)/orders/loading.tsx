import React from "react";

export default function OrdersLoading() {
  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-neutral-200 animate-pulse" />
          <div className="h-3 w-3 rounded bg-neutral-200 animate-pulse" />
          <div className="h-3 w-20 rounded bg-neutral-200 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-44 rounded-lg bg-neutral-200 animate-pulse" />
            <div className="mt-2 h-4 w-64 rounded bg-neutral-200 animate-pulse" />
          </div>
          <div className="h-9 w-36 rounded-md bg-neutral-200 animate-pulse" />
        </div>

        {/* Order Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-neutral-200" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                    <div className="h-3 w-20 rounded bg-neutral-200" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-24 rounded-full bg-neutral-200" />
                  <div className="h-5 w-16 rounded bg-neutral-200" />
                </div>
              </div>

              <div className="h-14 rounded-xl bg-neutral-100" />
              <div className="h-10 rounded-xl bg-neutral-100" />

              <div className="flex items-center justify-between pt-2">
                <div className="h-7 w-24 rounded bg-neutral-200" />
                <div className="h-8 w-32 rounded-md bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
