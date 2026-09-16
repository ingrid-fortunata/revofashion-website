"use client";

import React, { useState } from "react";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { Product } from "@/types/product";

interface ProductAddToCartSectionProps {
  product: Product;
  className?: string;
}

export function ProductAddToCartSection({
  product,
  className = "",
}: ProductAddToCartSectionProps) {
  const inStock = product.stock > 0;
  const [quantity, setQuantity] = useState(inStock ? 1 : 0);

  const handleDecrease = () => {
    if (!inStock) return;
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (!inStock) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  return (
    <div className={`flex flex-col gap-4 border-t border-neutral-200/80 pt-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Quantity Stepper (only visible if in stock) */}
        {inStock && (
          <div className="flex items-center justify-between sm:justify-start rounded-xl border border-neutral-300 bg-white px-3 py-2 shadow-2xs">
            <span className="text-xs font-semibold text-neutral-500 sm:hidden">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex-1">
          <AddToCartButton
            product={product}
            quantity={inStock ? quantity : 0}
            size="lg"
            redirectUrl={`/products/${product.id}`}
            className="w-full text-sm font-bold h-11 shadow-xs"
          />
        </div>
      </div>

      {/* Out of Stock Notice */}
      {!inStock && (
        <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200/70 rounded-xl px-3.5 py-2.5">
          This piece is currently out of stock. Sign in or stay tuned for the next collection drop.
        </p>
      )}

      {/* Reassurance Features (Uniqlo-style service badges) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50/80 p-2.5 border border-neutral-200/60 text-xs text-neutral-600">
          <Truck className="h-4 w-4 text-primary-600 shrink-0" />
          <span>Complimentary delivery on orders over $50</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-neutral-50/80 p-2.5 border border-neutral-200/60 text-xs text-neutral-600">
          <ShieldCheck className="h-4 w-4 text-primary-600 shrink-0" />
          <span>Guaranteed authentic premium tailoring</span>
        </div>
      </div>
    </div>
  );
}
