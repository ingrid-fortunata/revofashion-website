"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Clock, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import { ProtectedRoute } from "@/components/routes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/api/orders";
import { Order, OrderStatus } from "@/types/order";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCustomerOrders() {
      try {
        setIsLoading(true);
        const res = await getOrders();
        if (isMounted) {
          setOrders(res.data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load orders."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCustomerOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <span className="font-semibold text-rose-600">Order History</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Track and review all your placed fashion orders.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/products" className="flex items-center gap-1.5 text-xs font-semibold">
              <ShoppingBag className="h-3.5 w-3.5" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
              <p className="text-xs font-medium text-neutral-500">Loading your orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-800">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-3 text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-white py-16 px-4 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900">
              No orders found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              You haven&apos;t placed any orders yet. Discover our latest collections and start styling your wardrobe today!
            </p>
            <div className="mt-6">
              <Button asChild variant="default" size="default">
                <Link href="/products">Shop New Arrivals</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !errorMessage && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeVariant(status: OrderStatus): "default" | "secondary" | "rose" | "success" | "warning" | "destructive" | "outline" | "info" {
  switch (status) {
    case "paid":
    case "delivered":
      return "success";
    case "processing":
    case "shipped":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function OrderCard({ order }: { order: Order }) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="border-rose-100/80 shadow-sm overflow-hidden">
      {/* Header bar */}
      <CardHeader className="bg-neutral-50/70 border-b border-neutral-100 py-3.5 px-5 flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-neutral-200 text-rose-600 shadow-2xs">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-neutral-900">
              Order #{order.id}
            </CardTitle>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs font-semibold px-2.5 py-0.5">
            {order.status}
          </Badge>
          <span className="text-base font-extrabold text-rose-600">
            ${Number(order.total_amount).toFixed(2)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Recipient & Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-rose-50/30 border border-rose-100/50 rounded-xl p-3 text-neutral-700">
          <div>
            <span className="font-semibold text-neutral-900">Recipient:</span>{" "}
            <span>{order.recipient_name}</span>{" "}
            <span className="text-neutral-500">({order.recipient_phone})</span>
          </div>
          <div className="flex items-start gap-1">
            <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span className="text-neutral-600 line-clamp-2">{order.shipping_address}</span>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-800">
                    {item.name || `Product #${item.product_id}`}
                  </span>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600">
                    {item.size || "Free Size"}
                  </span>
                  {item.color && (
                    <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600">
                      {item.color}
                    </span>
                  )}
                  <span className="text-neutral-400">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-neutral-900">
                  ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
