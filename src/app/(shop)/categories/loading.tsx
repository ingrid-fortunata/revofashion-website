import React from "react";

export default function CategoriesLoading() {
  return (
    <div className="bg-[#fefbfc] min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12 flex flex-col items-center text-center">
          <div className="h-6 w-36 rounded-full bg-rose-100/60 animate-pulse mb-3" />
          <div className="h-10 w-64 rounded-lg bg-neutral-200 animate-pulse mb-2" />
          <div className="h-5 w-80 max-w-full rounded-md bg-neutral-100 animate-pulse" />
        </div>

        {/* Grid Skeleton (8 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 bg-white border border-rose-100/70 rounded-2xl shadow-2xs h-48 animate-pulse"
            >
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-rose-100/50" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded bg-neutral-200" />
                  <div className="h-4 w-full rounded bg-neutral-100" />
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <div className="h-3 w-24 rounded bg-rose-100/40" />
                <div className="h-3 w-3 rounded bg-rose-100/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
