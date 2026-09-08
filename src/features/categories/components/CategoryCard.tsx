import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  Sparkles,
  Layers,
  Activity,
  Heart,
  Tag,
  LucideIcon,
} from "lucide-react";
import { Category } from "@/types/category";

/**
 * Maps category name keywords to thematic Lucide icons
 */
function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase();
  if (normalized.includes("t-shirt") || normalized.includes("shirt") || normalized.includes("blouse")) {
    return Shirt;
  }
  if (normalized.includes("dress") || normalized.includes("skirt")) {
    return Sparkles;
  }
  if (
    normalized.includes("outer") ||
    normalized.includes("jacket") ||
    normalized.includes("coat") ||
    normalized.includes("hoodie")
  ) {
    return Layers;
  }
  if (normalized.includes("active") || normalized.includes("sport") || normalized.includes("dry-ex")) {
    return Activity;
  }
  if (
    normalized.includes("inner") ||
    normalized.includes("lounge") ||
    normalized.includes("underwear") ||
    normalized.includes("heattech")
  ) {
    return Heart;
  }
  return Tag;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = getCategoryIcon(category.name);
  const description = category.description || "Discover curated essentials.";

  return (
    <Link
      href={`/products?category_id=${category.id}`}
      className="group relative flex flex-col justify-between p-6 bg-white border border-rose-100/90 rounded-2xl shadow-2xs hover:border-rose-300 hover:shadow-md transition-all duration-300 h-full"
    >
      <div className="flex flex-col gap-4">
        {/* Thematic Icon Chip */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-2xs">
          <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
        </div>

        {/* Title and Description */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {category.name}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-rose-600">
        <span>Explore collection</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
}
