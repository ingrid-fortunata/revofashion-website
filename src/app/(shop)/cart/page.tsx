"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { ProtectedRoute } from "@/components/routes";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/useCartStore";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}

function CartContent() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getTotalCount } =
    useCartStore();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const totalCount = mounted ? getTotalCount() : 0;
  const subtotal = mounted ? getSubtotal() : 0;
  const isEmpty = !mounted || items.length === 0;

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <span className="font-semibold text-primary-600">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {isEmpty
                ? "Your shopping bag is currently empty."
                : `You have ${totalCount} ${totalCount === 1 ? "item" : "items"} in your shopping bag.`}
            </p>
          </div>

          {!isEmpty && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-xs text-neutral-600 hover:text-red-600 hover:border-red-200 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear Cart
            </Button>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-white py-16 px-4 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900">
              Your bag is empty
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              Explore our contemporary collections and find pieces tailored for your style.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild variant="default" size="default">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="default">
                <Link href="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Cart Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <Card className="border-primary-100/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {items.map((item, index) => (
                    <CartItemRow
                      key={`${item.productId}-${item.size}-${item.color}-${index}`}
                      item={item}
                      onUpdateQuantity={(q) =>
                        updateQuantity(item.productId, item.size, item.color, q)
                      }
                      onRemove={() => removeItem(item.productId, item.size, item.color)}
                    />
                  ))}
                </div>
              </Card>

              {/* Shopping Assurance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200/70 bg-white p-3 text-xs text-neutral-600 shadow-2xs">
                  <Truck className="h-4 w-4 text-primary-600 shrink-0" />
                  <span>Complimentary express delivery on all orders</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200/70 bg-white p-3 text-xs text-neutral-600 shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-primary-600 shrink-0" />
                  <span>30-day money-back guarantee & authentic items</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Proceed to Checkout */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24 border-primary-100/80 shadow-sm">
                <CardHeader className="pb-4 border-b border-primary-50">
                  <CardTitle className="text-lg font-bold text-neutral-900">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-semibold text-neutral-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-emerald-600" />
                      Shipping
                    </span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-neutral-500">Included</span>
                  </div>

                  <div className="flex justify-between border-t border-dashed border-neutral-200 pt-3 text-base">
                    <span className="font-bold text-neutral-900">Total</span>
                    <span className="text-xl font-extrabold text-primary-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <Button
                    variant="default"
                    size="lg"
                    disabled={isEmpty}
                    onClick={() => router.push("/checkout")}
                    className="w-full h-12 mt-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-center text-[11px] text-neutral-400">
                    Taxes and shipping calculated at checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const [imageError, setImageError] = useState(false);
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 transition-colors hover:bg-neutral-50/50">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          {item.image && !imageError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <Sparkles className="h-6 w-6 opacity-30" />
            </div>
          )}
        </div>

        {/* Item Information */}
        <div className="space-y-1 min-w-0">
          <Link
            href={`/products/${item.productId}`}
            className="text-sm font-bold text-neutral-900 hover:text-primary-600 line-clamp-1 transition-colors"
          >
            {item.name}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="rounded bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700">
              Size: {item.size || "Free Size"}
            </span>
            {item.color && (
              <span className="rounded bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700">
                Color: {item.color}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-primary-600">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stepper, Subtotal, and Remove Button */}
      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1 shadow-2xs">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-600 hover:bg-neutral-100 cursor-pointer disabled:opacity-40 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[1.75rem] text-center text-xs font-bold text-neutral-800">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-600 hover:bg-neutral-100 cursor-pointer disabled:opacity-40 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[4.5rem]">
          <p className="text-sm font-bold text-neutral-900">
            ${itemTotal.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          aria-label="Remove item"
          onClick={onRemove}
          className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
