"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/cart";

interface CheckoutOrderReviewProps {
  items: CartItem[];
  subtotal: number;
}

export function CheckoutOrderReview({
  items,
  subtotal,
}: CheckoutOrderReviewProps) {
  // Free complimentary shipping on fashion orders
  const shippingFee = subtotal > 50 ? 0 : 0; // 0 for complimentary
  const grandTotal = subtotal + shippingFee;

  return (
    <Card className="border-primary-100/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-primary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100/70 text-primary-600">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-neutral-900">
                Order Review
              </CardTitle>
              <p className="text-xs text-neutral-500">
                {items.length} {items.length === 1 ? "item" : "items"} in your order
              </p>
            </div>
          </div>
          <Badge variant="primary" className="text-xs font-semibold">
            {items.reduce((sum, item) => sum + item.quantity, 0)} Total Pcs
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Condensed Item List */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
          {items.map((item, index) => (
            <OrderItemRow key={`${item.productId}-${item.size}-${item.color}-${index}`} item={item} />
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2 border-t border-neutral-200/80 pt-4 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-neutral-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600 items-center">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              Standard Delivery
            </span>
            <span className="font-semibold text-emerald-600">
              FREE
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>Estimated Taxes</span>
            <span className="font-medium text-neutral-500">Included</span>
          </div>

          <div className="flex justify-between border-t border-dashed border-neutral-200 pt-3 text-base">
            <span className="font-bold text-neutral-900">Total Amount</span>
            <div className="text-right">
              <span className="text-lg font-extrabold text-primary-600">
                ${grandTotal.toFixed(2)}
              </span>
              <p className="text-[10px] text-neutral-400">All applicable taxes included</p>
            </div>
          </div>
        </div>

        {/* Brand Assurance Badges */}
        <div className="rounded-lg bg-primary-50/60 border border-primary-100/60 p-3 text-xs text-neutral-600 space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-primary-900">
            <ShieldCheck className="h-4 w-4 text-primary-600 shrink-0" />
            <span>Buyer Protection Guarantee</span>
          </div>
          <p className="text-[11px] text-neutral-500 pl-6 leading-relaxed">
            30-day hassle-free returns & 100% authentic designer fashion pieces.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderItemRow({ item }: { item: CartItem }) {
  const [imageError, setImageError] = useState(false);
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-3 pt-2">
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-100">
        {item.image && !imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="56px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <Sparkles className="h-5 w-5 opacity-40" />
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-neutral-900 truncate">
          {item.name}
        </h4>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700">
            {item.size || "Free Size"}
          </span>
          {item.color && (
            <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700">
              {item.color}
            </span>
          )}
          <span className="text-[11px] text-neutral-500">
            Qty: <strong className="text-neutral-800">{item.quantity}</strong>
          </span>
        </div>
      </div>

      {/* Item subtotal */}
      <div className="text-right shrink-0">
        <span className="text-xs font-bold text-neutral-900">
          ${itemTotal.toFixed(2)}
        </span>
        <p className="text-[10px] text-neutral-400">
          ${item.price.toFixed(2)} each
        </p>
      </div>
    </div>
  );
}

export default CheckoutOrderReview;
