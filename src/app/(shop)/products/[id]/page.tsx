import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  productService,
  categoryService,
  ProductImageGallery,
  ProductInfo,
  ProductAddToCartSection,
} from "@/features/products";
import { Product } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic SEO Metadata per guidelines:
 * Fetches product name for dynamic <title> tag.
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId) || numericId <= 0) {
    return {
      title: "Product Not Found — RevoFashion",
    };
  }

  try {
    const res = await productService.getProductById(numericId);
    const product = res.data;

    if (!product) {
      return {
        title: "Product Not Found — RevoFashion",
      };
    }

    return {
      title: `${product.name} — RevoFashion`,
      description:
        product.description ||
        `Buy ${product.name} online at RevoFashion. Thoughtfully crafted contemporary fashion essentials.`,
    };
  } catch {
    return {
      title: "Product Not Found — RevoFashion",
    };
  }
}

/**
 * Server Component: Product Detail Page (Dynamic SSR)
 * Specified in /docs/guideline/rendering_strategies.md (Table 2 & Section 3)
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  // Negative Case 1: Invalid or non-numeric ID parameter
  if (isNaN(numericId) || numericId <= 0) {
    notFound();
  }

  let product: Product;
  let categoryName: string | undefined;

  try {
    const res = await productService.getProductById(numericId);
    product = res.data;

    // Negative Case 2: No product returned
    if (!product) {
      notFound();
    }
  } catch (error) {
    // If backend returns 404 or product not found, render notFound()
    console.error(`Error loading product ID ${id}:`, error);
    notFound();
  }

  // Resolve category name if category_id exists
  if (product.category_id) {
    try {
      const categories = await categoryService.getCategories();
      const matched = categories.find((c) => c.id === product.category_id);
      if (matched) {
        categoryName = matched.name;
      }
    } catch {
      // Gracefully continue without category name if categories fetch fails
      categoryName = undefined;
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Product Image Gallery (Compact) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <ProductImageGallery product={product} />
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <ProductInfo product={product} categoryName={categoryName} />
          <ProductAddToCartSection product={product} />
        </div>
      </div>
    </div>
  );
}
