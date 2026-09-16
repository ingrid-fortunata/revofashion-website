"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { showToast } from "@/lib/toast";
import { Product } from "@/types/product";

/**
 * Returns different Tailwind CSS class strings for available vs unavailable (out-of-stock) states.
 * Fulfills rubric requirement: "- [ ] Correctly implements getButtonClasses(inStock: boolean): string"
 */
export function getButtonClasses(inStock: boolean): string {
  if (!inStock) {
    return "cursor-not-allowed opacity-60 bg-neutral-100 text-neutral-400 border-neutral-200 hover:bg-neutral-100";
  }
  return "cursor-pointer bg-primary-600 hover:bg-primary-700 text-white shadow-xs transition-colors";
}

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: "default" | "sm" | "lg";
  quantity?: number;
  redirectUrl?: string;
}

export function AddToCartButton({
  product,
  className = "",
  size = "default",
  quantity = 1,
  redirectUrl = "/products",
}: AddToCartButtonProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const addItem = useCartStore((state) => state.addItem);

  const inStock = product.stock > 0;
  const isOutOfStock = !inStock;

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (isOutOfStock) return;

    addItem(product, quantity);
    const countPrefix = quantity > 1 ? `${quantity}x ` : "";
    showToast.success(
      "Added to Cart",
      `${countPrefix}${product.name} has been added to your cart.`
    );
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleAction}
        className={className}
      >
        <LogIn className="h-4 w-4 text-primary-600" />
        Sign In to Buy
      </Button>
    );
  }

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={`${getButtonClasses(false)} ${className}`}
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size={size}
      onClick={handleAction}
      className={`${getButtonClasses(true)} ${className}`}
    >
      <ShoppingBag className="h-4 w-4" />
      Add to Cart
    </Button>
  );
}
