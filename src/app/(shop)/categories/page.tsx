import React from "react";
import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryService } from "@/features/products";
import { CategoryGrid } from "@/features/categories";
import { Category } from "@/types/category";

// ISR (Incremental Static Regeneration): Revalidate data automatically in background every 3600 seconds (1 hour)
// Specified in /docs/guideline/rendering_strategies.md (Section 3)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Categories — RevoFashion",
  description: "Browse curated fashion categories for effortless daily styling.",
};

/**
 * Server Component fetch using unified categoryService.
 * Client uses native fetch with full Request/Response/Error interceptor pipeline.
 */
async function getCategories(): Promise<Category[]> {
  try {
    const categories = await categoryService.getCategories();
    return categories || [];
  } catch (error) {
    console.error("CategoriesPage server fetch error:", error);
    throw error;
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-surface-subtle min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Banner */}
        <div className="mb-8 sm:mb-12 flex flex-col items-center text-center">
          <Badge
            variant="primary"
            className="mb-2.5 gap-1.5 px-3 py-1 text-xs font-semibold shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-600" />
            Curated Taxonomies
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Explore Categories
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-neutral-500">
            Discover contemporary essentials thoughtfully categorized for effortless everyday styling.
          </p>
        </div>

        {/* Responsive Category Grid */}
        <CategoryGrid categories={categories} />
      </div>
    </div>
  );
}
