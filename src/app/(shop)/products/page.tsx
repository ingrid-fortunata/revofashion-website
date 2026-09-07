import React, { Suspense } from "react";
import {
  ProductList,
  ProductCardSkeleton,
  productService,
} from "@/features/products";
import { Product } from "@/types/product";

export const metadata = {
  title: "Product Catalog | RevoFashion",
  description: "Browse all contemporary garments in our product catalog.",
};

/**
 * Server Component fetch using unified productService.
 * Uses native fetch under the hood with error code interpretation via error interceptor.
 */
async function getProducts(): Promise<Product[]> {
  try {
    const response = await productService.getProducts({ per_page: 12 });
    return response.data || [];
  } catch (error) {
    // Interceptor has interpreted and enriched error.message with backend error code translation
    console.error("Server-side products fetch error:", error);
    throw error;
  }
}

function ProductsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-11 w-full max-w-md animate-pulse rounded-full bg-rose-100/50" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-rose-100/40"
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

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductList products={products} />
    </Suspense>
  );
}
