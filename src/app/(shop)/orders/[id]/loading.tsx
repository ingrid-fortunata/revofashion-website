import React from "react";

export default function OrderDetailLoading() {
  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-neutral-200" />
          <div className="h-3 w-3 rounded bg-neutral-200" />
          <div className="h-3 w-20 rounded bg-neutral-200" />
          <div className="h-3 w-3 rounded bg-neutral-200" />
          <div className="h-3 w-16 rounded bg-neutral-200" />
        </div>

        {/* Action bar skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-28 rounded bg-neutral-200" />
          <div className="h-8 w-44 rounded bg-neutral-200" />
        </div>

        {/* Order Header banner skeleton */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-48 rounded bg-neutral-200" />
              <div className="h-4 w-36 rounded bg-neutral-200" />
            </div>
            <div className="h-8 w-28 rounded-full bg-neutral-200" />
          </div>
        </div>

        {/* Timeline skeleton */}
        <div className="h-36 rounded-2xl border border-neutral-200 bg-white p-6" />

        {/* Shipping & Recipient Card skeleton */}
        <div className="h-40 rounded-2xl border border-neutral-200 bg-white p-6" />

        {/* Items Table skeleton */}
        <div className="h-64 rounded-2xl border border-neutral-200 bg-white p-6" />
      </div>
    </div>
  );
}
