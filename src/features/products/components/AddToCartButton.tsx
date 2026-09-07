"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { showToast } from "@/lib/toast";
import { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function AddToCartButton({
  product,
  className,
  size = "default",
}: AddToCartButtonProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?redirect=/products`);
      return;
    }

    if (isOutOfStock) return;

    addItem(product);
    showToast.success("Added to Cart", `${product.name} has been added to your cart.`);
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleAction}
        className={className}
      >
        <LogIn className="h-4 w-4 text-rose-600" />
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
        className={className}
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
      className={className}
    >
      <ShoppingBag className="h-4 w-4" />
      Add to Cart
    </Button>
  );
}
