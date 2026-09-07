import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroCarousel, ProductCard } from "@/features/products";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

export const metadata = {
  title: "RevoFashion — Contemporary Minimalist Fashion",
  description:
    "Uniqlo-inspired contemporary fashion essentials designed for effortless simplicity, comfort, and everyday lifestyle.",
};

/**
 * Pure Server Component: Correctly fetches GET /products inside a Server Component
 * using async/await with the native fetch API, rendering the first 5 results as
 * read-only ProductCard components.
 */
async function getHomePageData(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://revofashion-shop.onrender.com";

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${baseUrl}/products`, { cache: "no-store" }),
    fetch(`${baseUrl}/categories`, { cache: "no-store" }),
  ]);

  if (!productsRes.ok) {
    throw new Error(`Failed to fetch products: ${productsRes.status}`);
  }

  const productsJson = await productsRes.json();
  const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : { data: [] };

  return {
    products: (productsJson.data || []).slice(0, 5),
    categories: categoriesJson.data || [],
  };
}

export default async function HomePage() {
  const { products, categories } = await getHomePageData();

  const categoryMap = new Map<number, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name));

  return (
    <div className="bg-[#fefbfc]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Uniqlo-Inspired Hero Carousel */}
        <HeroCarousel />

        {/* Featured Products Section: 5 Read-Only ProductCards */}
        <section className="mt-12 sm:mt-16 pb-16">
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

          {/* 5 Read-Only ProductCard Components */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                readOnly={true}
                categoryName={
                  product.category_id ? categoryMap.get(product.category_id) : undefined
                }
              />
            ))}
          </div>

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
      </div>
    </div>
  );
}
