import React from "react";
import { ProductCardSkeleton } from "@/features/products";

export default function ProductsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-11 w-full max-w-md animate-pulse rounded-full bg-primary-100/50" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-primary-100/40"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
