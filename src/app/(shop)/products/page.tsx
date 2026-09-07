import React, { Suspense } from "react";
import { ProductList, ProductCardSkeleton } from "@/features/products";
import { Product } from "@/types/product";

export const metadata = {
  title: "Product Catalog | RevoFashion",
  description: "Browse all contemporary garments in our product catalog.",
};

/**
 * Server Component fetch: Correctly fetches GET /products inside a Server Component
 * using async/await with the native fetch API.
 */
async function getProducts(): Promise<Product[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://revofashion-shop.onrender.com";

  const res = await fetch(`${baseUrl}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data || [];
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
