"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductImageGalleryProps {
  product: Product;
  className?: string;
}

export function ProductImageGallery({
  product,
  className = "",
}: ProductImageGalleryProps) {
  // Collect candidate images: primary image first, then up to 2 secondary images (3 total)
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

  const currentImage = images[activeIndex];
  const isImageFailed = !currentImage || failedImages[activeIndex];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Primary High-Res Preview Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-rose-100/90 bg-rose-50/20 shadow-xs">
        {isImageFailed ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-rose-50/40">
            <Image
              src="/images/no-photo.png"
              alt={`No photo available for ${product.name}`}
              width={320}
              height={260}
              className="max-h-full max-w-full object-contain opacity-85"
              unoptimized
              priority
            />
            <span className="mt-4 text-xs font-medium text-neutral-400">
              No preview available
            </span>
          </div>
        ) : (
          <Image
            src={currentImage}
            alt={`${product.name} - view ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
            priority
            onError={() => {
              setFailedImages((prev) => ({ ...prev, [activeIndex]: true }));
            }}
            unoptimized={
              currentImage.startsWith("data:") || currentImage.includes("local")
            }
          />
        )}
      </div>

      {/* Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div
          role="region"
          aria-label="Product image thumbnails"
          className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5"
        >
          {images.map((imgSrc, idx) => {
            const isActive = activeIndex === idx;
            const hasFailed = failedImages[idx];

            return (
              <button
                key={idx}
                type="button"
                aria-label={`Show image view ${idx + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                  isActive
                    ? "border-rose-600 ring-2 ring-rose-200 shadow-xs scale-102"
                    : "border-neutral-200/90 hover:border-rose-300 opacity-70 hover:opacity-100"
                }`}
              >
                {hasFailed ? (
                  <div className="flex h-full w-full items-center justify-center bg-rose-50/50 p-2">
                    <Image
                      src="/images/no-photo.png"
                      alt="Thumbnail fallback"
                      width={40}
                      height={40}
                      className="object-contain opacity-70"
                      unoptimized
                    />
                  </div>
                ) : (
                  <Image
                    src={imgSrc}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={() => {
                      setFailedImages((prev) => ({ ...prev, [idx]: true }));
                    }}
                    unoptimized={
                      imgSrc.startsWith("data:") || imgSrc.includes("local")
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
