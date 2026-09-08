"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Tag,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  categoryName?: string;
}

export function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const inStock = product.stock > 0;
  const resolvedCategory = categoryName || "Contemporary Collection";

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Catalog
        </button>
      </div>

      {/* Category Pill, SKU, & Stock Status */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Badge
          variant="secondary"
          className="bg-rose-50 text-rose-700 border-rose-200/80 font-semibold px-2.5 py-0.5"
        >
          {resolvedCategory}
        </Badge>

        {product.sku && (
          <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-600">
            <Tag className="h-3 w-3 text-neutral-400" />
            {product.sku}
          </span>
        )}

        {inStock ? (
          <Badge
            variant="success"
            className="gap-1 font-medium text-[11px] px-2.5 py-0.5 shadow-2xs"
          >
            <CheckCircle2 className="h-3 w-3" />
            In Stock ({product.stock} available)
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className="gap-1 font-medium text-[11px] px-2.5 py-0.5 bg-rose-600 text-white shadow-2xs"
          >
            <XCircle className="h-3 w-3" />
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
          {product.name}
        </h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-neutral-400 font-medium">
            VAT included
          </span>
        </div>
      </div>

      {/* Fashion Specifications Card Grid */}
      <div className="rounded-2xl border border-rose-100/90 bg-rose-50/20 p-4 sm:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3.5 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-rose-600" />
          Garment Specifications
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Gender */}
          <div className="rounded-xl border border-neutral-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[11px] font-medium text-neutral-400 block">
              Gender
            </span>
            <span className="text-sm font-semibold text-neutral-800 capitalize mt-0.5 block">
              {product.gender || "Unisex"}
            </span>
          </div>

          {/* Size */}
          <div className="rounded-xl border border-neutral-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[11px] font-medium text-neutral-400 block">
              Size
            </span>
            <span className="text-sm font-semibold text-neutral-800 mt-0.5 block">
              {product.size || "Free Size"}
            </span>
          </div>

          {/* Color */}
          <div className="rounded-xl border border-neutral-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[11px] font-medium text-neutral-400 block">
              Color
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="h-3 w-3 rounded-full border border-neutral-300 shrink-0"
                style={{
                  backgroundColor: product.color?.toLowerCase() || "#a3a3a3",
                }}
              />
              <span className="text-sm font-semibold text-neutral-800 capitalize">
                {product.color || "Standard"}
              </span>
            </div>
          </div>

          {/* Material */}
          <div className="rounded-xl border border-neutral-200/80 bg-white p-3 shadow-2xs">
            <span className="text-[11px] font-medium text-neutral-400 block">
              Material
            </span>
            <span
              className="text-sm font-semibold text-neutral-800 mt-0.5 block"
              title={product.material || "Premium Blend"}
            >
              {product.material || "Premium Blend"}
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="border-t border-neutral-200/80 pt-5">
        <h2 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-rose-600" />
          Product Details & Description
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-line">
          {product.description?.trim() ||
            "Thoughtfully crafted with contemporary minimalism in mind. This essential piece offers breathable daily comfort, durable craftsmanship, and effortless styling for modern wardrobes."}
        </p>
      </div>
    </div>
  );
}
