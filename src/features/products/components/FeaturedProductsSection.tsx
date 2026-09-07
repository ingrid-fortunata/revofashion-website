"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { useProductsQuery } from "../hooks/useProductsQuery";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface FeaturedProductsSectionProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
  readOnly?: boolean;
}

export function FeaturedProductsSection({
  initialProducts,
  initialCategories,
  readOnly = true,
}: FeaturedProductsSectionProps) {
  const { data: productResponse, isLoading } = useProductsQuery({
    per_page: 5,
  });
  const { data: liveCategories } = useCategoriesQuery();

  const products = productResponse?.data || initialProducts || [];

  const categoryMap = useMemo(() => {
    const list = liveCategories || initialCategories || [];
    const map = new Map<number, string>();
    list.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [liveCategories, initialCategories]);

  return (
    <section className="mt-12 sm:mt-16 pb-16">
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <Badge
          variant="rose"
          className="mb-2.5 gap-1.5 px-3 py-1 text-xs font-semibold shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-rose-600" />
          Featured Collection
        </Badge>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          Curated Everyday Essentials
        </h2>
        <p className="mt-2 max-w-xl text-sm text-neutral-500">
          Uniqlo-inspired minimalist aesthetic tailored for comfort, timeless versatility, and relaxed silhouette.
        </p>
      </div>

      {/* 5 Products Grid */}
      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              readOnly={readOnly}
              categoryName={
                product.category_id
                  ? categoryMap.get(product.category_id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Centered View All Products Button */}
      <div className="mt-10 flex justify-center">
        <Link href="/products">
          <Button
            size="lg"
            className="gap-2 px-8 font-semibold shadow-md shadow-rose-200/50 hover:shadow-lg transition-all"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
