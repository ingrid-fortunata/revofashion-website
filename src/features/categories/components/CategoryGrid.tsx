import React from "react";
import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";
import { Category } from "@/types/category";
import { CategoryCard } from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Filter active categories for customer-facing views
  const activeCategories = categories.filter((c) => c.is_active !== false);

  if (activeCategories.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Categories Available"
        description="Our fashion categories are currently being refreshed. Explore our full catalog in the meantime."
        action={
          <Link href="/products">
            <Button className="gap-2 font-semibold">
              <span>Browse All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
        className="rounded-3xl border border-primary-100/90 bg-primary-50/40 my-6"
      />
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
