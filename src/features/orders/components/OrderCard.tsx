"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { CancelOrderModal } from "./CancelOrderModal";
import { Package, Clock, MapPin, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: Order;
  onOrderCancelled?: () => void;
}

export function OrderCard({ order, onOrderCancelled }: OrderCardProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCancellable = order.status === "pending" || order.status === "paid";
  const itemsCount = order.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;

  return (
    <div
      data-testid={`order-card-${order.id}`}
      className="group rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:border-primary-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-neutral-50/70 border-b border-neutral-100 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200 text-primary-600 shadow-2xs group-hover:border-primary-300 transition-colors">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <Link
              href={`/orders/${order.id}`}
              data-testid={`order-link-${order.id}`}
              className="text-sm font-bold text-neutral-900 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              Order #{order.id}
              <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-600" />
            </Link>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="text-base sm:text-lg font-extrabold text-neutral-900">
            ${Number(order.total_amount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Shipping & Recipient Brief */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50/60 border border-neutral-100 rounded-xl p-3.5 text-neutral-700">
          <div>
            <span className="font-bold text-neutral-900">Recipient: </span>
            <span className="font-medium text-neutral-800">{order.recipient_name}</span>{" "}
            <span className="text-neutral-500">({order.recipient_phone})</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary-600 shrink-0 mt-0.5" />
            <span className="text-neutral-600 line-clamp-1">{order.shipping_address}</span>
          </div>
        </div>

        {/* Order Items Preview */}
        {order.items && order.items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">
                Items ({itemsCount} {itemsCount === 1 ? "piece" : "pieces"})
              </span>
              <span className="text-[11px]">Snapshot summary</span>
            </div>
            <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-100/80 bg-white px-3.5 py-1">
              {order.items.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-medium text-neutral-800 truncate">
                      {item.name || `Item #${item.product_id}`}
                    </span>
                    <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600 shrink-0">
                      {item.size || "Free Size"}
                    </span>
                    {item.color && (
                      <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600 shrink-0">
                        {item.color}
                      </span>
                    )}
                    <span className="text-neutral-400 shrink-0">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-neutral-900 shrink-0">
                    ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="py-2 text-center text-xs text-neutral-500 font-medium">
                  + {order.items.length - 3} more items in this order
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            {isCancellable && (
              <CancelOrderModal
                orderId={order.id}
                status={order.status}
                onSuccess={onOrderCancelled}
              />
            )}
          </div>

          <Button
            asChild
            variant="default"
            size="sm"
            data-testid={`view-order-btn-${order.id}`}
            className="ml-auto text-xs font-semibold gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            <Link href={`/orders/${order.id}`}>
              <Eye className="h-3.5 w-3.5" />
              View Order Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
