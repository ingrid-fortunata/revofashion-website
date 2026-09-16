import React from "react";
import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";
import { Category } from "@/types/category";
import { CategoryCard } from "./CategoryCard";
import { Button } from "@/components/ui/button";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Filter active categories for customer-facing views
  const activeCategories = categories.filter((c) => c.is_active !== false);

  if (activeCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-primary-100/90 bg-primary-50/40 p-12 text-center my-6 shadow-2xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-4 shadow-2xs">
          <FolderOpen className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No Categories Available</h3>
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
          Our fashion categories are currently being refreshed. Explore our full catalog in the meantime.
        </p>
        <Link href="/products" className="mt-6">
          <Button className="gap-2 font-semibold">
            <span>Browse All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {activeCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
