"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton, getButtonClasses } from "./AddToCartButton";
import { Product } from "@/types/product";

export { getButtonClasses };

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  className?: string;
  readOnly?: boolean;
}

export function ProductCard({
  product,
  categoryName,
  className = "",
  readOnly = false,
}: ProductCardProps) {
  // 1. Resolve candidate images (up to 3 images, prioritizing primary_image)
  const images = useMemo(() => {
    const list: string[] = [];

    if (product.primary_image && product.primary_image.trim() !== "") {
      list.push(product.primary_image.trim());
    }

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        const src = img.image_base64?.trim();
        if (src && !list.includes(src)) {
          list.push(src);
        }
        if (list.length >= 3) break;
      }
    }

    return list;
  }, [product.primary_image, product.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeIndex];
  const isImageFailed = !currentImage || failedImages[activeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectDot = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(idx);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      data-testid="product-card"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-primary-100/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/40 ${className}`}
    >
      {/* Media & Carousel Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-primary-50/30">
        <Link
          href={`/products/${product.id}`}
          className="relative block h-full w-full focus:outline-none"
          tabIndex={-1}
        >
          {isImageFailed ? (
            <div className="flex h-full w-full items-center justify-center p-6 bg-primary-50/40">
              <Image
                src="/images/no-photo.png"
                alt={`No photo available for ${product.name}`}
                width={240}
                height={200}
                className="max-h-full max-w-full object-contain opacity-90 transition-transform duration-300 group-hover:scale-105"
                unoptimized
                priority={false}
              />
            </div>
          ) : (
            <Image
              src={currentImage}
              alt={`${product.name} - image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => {
                setFailedImages((prev) => ({ ...prev, [activeIndex]: true }));
              }}
              unoptimized={currentImage.startsWith("data:") || currentImage.includes("local")}
            />
          )}
        </Link>

        {/* Stock Badge Overlay */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.stock > 0 ? (
            <Badge variant="success" className="shadow-xs font-medium text-[11px] px-2 py-0.5">
              In Stock
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="shadow-xs font-medium text-[11px] px-2 py-0.5 bg-red-600 text-white"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Gender Badge Overlay */}
        {product.gender && (
          <div className="pointer-events-none absolute top-3 right-3 z-10">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-xs text-neutral-700 border-neutral-200/80 shadow-2xs text-[10px] uppercase tracking-wider font-semibold"
            >
              {product.gender}
            </Badge>
          </div>
        )}

        {/* Carousel Mini Controls (if > 1 image) */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-xs opacity-0 transition-all duration-200 hover:bg-white hover:text-neutral-900 group-hover:opacity-100 z-20 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-xs opacity-0 transition-all duration-200 hover:bg-white hover:text-neutral-900 group-hover:opacity-100 z-20 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => handleSelectDot(idx, e)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    activeIndex === idx
                      ? "w-4 bg-primary-600"
                      : "w-1.5 bg-neutral-300/80 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Size */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
          <span className="font-medium text-primary-700 uppercase tracking-wider text-[10px]">
            {categoryName || "Collection"}
          </span>
          {product.size && (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
              Size: {product.size}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link
          href={`/products/${product.id}`}
          className="group-hover:text-primary-600 transition-colors focus:outline-none focus:underline"
        >
          <h3
            className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && (
              <span className="text-[11px] text-neutral-400">
                {product.stock} left
              </span>
            )}
          </div>

          {!readOnly && (
            <div className="flex flex-col gap-2">
              {product.stock > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-primary-100/90 bg-primary-50/40 px-2.5 py-1">
                  <span className="text-[11px] font-medium text-neutral-500">Qty:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((prev) => Math.max(1, prev - 1));
                      }}
                      disabled={quantity <= 1}
                      className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed text-xs transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[1.25rem] text-center text-xs font-semibold text-neutral-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuantity((prev) => Math.min(product.stock, prev + 1));
                      }}
                      disabled={quantity >= product.stock}
                      className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed text-xs transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
              <AddToCartButton
                product={product}
                quantity={quantity}
                size="default"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
