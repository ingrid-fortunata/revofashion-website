"use client";

import React, { useMemo } from "react";
import { PackageSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  isLoading?: boolean;
  onResetFilters?: () => void;
  className?: string;
}

export function ProductGrid({
  products,
  categories = [],
  isLoading = false,
  onResetFilters,
  className = "",
}: ProductGridProps) {
  // Build category ID to name lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  // Loading Skeleton Grid
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary-200/90 bg-primary-50/20 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100/60 text-primary-600 shadow-xs mb-4">
          <PackageSearch className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">
          No garments found
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-neutral-500 leading-relaxed">
          We couldn’t find any items matching your selected filters or search query. Try refining your keywords or clearing filters.
        </p>
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-5 gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  // Active Products Grid
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={
            product.category_id ? categoryMap.get(product.category_id) : undefined
          }
        />
      ))}
    </div>
  );
}
