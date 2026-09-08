"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Order } from "@/types/order";
import { OrderCard } from "./OrderCard";
import { getOrders } from "@/lib/api/orders";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderInfiniteListProps {
  initialOrders: Order[];
  initialPages: number;
  initialTotal: number;
  perPage?: number;
}

export function OrderInfiniteList({
  initialOrders,
  initialPages,
  initialTotal,
  perPage = 5,
}: OrderInfiniteListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(1 < initialPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const [prevInitialOrders, setPrevInitialOrders] = useState(initialOrders);

  if (prevInitialOrders !== initialOrders) {
    setPrevInitialOrders(initialOrders);
    setOrders(initialOrders);
    setPage(1);
    setHasMore(1 < initialPages);
  }

  // Handle in-place cancellation so scroll position and pagination are preserved
  const handleOrderCancelled = useCallback((cancelledOrderId: number) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === cancelledOrderId ? { ...ord, status: "cancelled" } : ord
      )
    );
  }, []);

  // Fetch next page of orders
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const nextPage = page + 1;
      const res = await getOrders({
        page: nextPage,
        per_page: perPage,
      });

      const newOrders = res.data || [];
      if (newOrders.length > 0) {
        setOrders((prev) => {
          // Avoid duplicate keys by checking IDs
          const existingIds = new Set(prev.map((o) => o.id));
          const filteredNew = newOrders.filter((o) => !existingIds.has(o.id));
          return [...prev, ...filteredNew];
        });
      }

      setPage(nextPage);
      setHasMore(nextPage < res.pages);
    } catch (error) {
      console.error("Failed to load more orders:", error);
      setLoadError("Unable to load additional orders. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, perPage, hasMore, isLoadingMore]);

  // Setup IntersectionObserver on sentinel element
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: "250px", // Prefetch 250px before reaching the bottom
        threshold: 0.1,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loadNextPage]);

  return (
    <div className="space-y-6">
      {/* List of Order Cards */}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onOrderCancelled={() => handleOrderCancelled(order.id)}
          />
        ))}
      </div>

      {/* Sentinel & Infinite Loading Indicator */}
      <div ref={sentinelRef} className="pt-2">
        {isLoadingMore && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-neutral-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
            <span className="text-xs font-medium">Loading earlier orders...</span>
          </div>
        )}

        {/* Load Error Retry */}
        {loadError && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-xs font-medium text-red-800">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadNextPage}
              className="text-xs gap-1.5 border-red-300 text-red-800 hover:bg-red-100"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </Button>
          </div>
        )}

        {/* End of History Message */}
        {!hasMore && orders.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-neutral-400">
            <CheckCircle2 className="h-4 w-4 text-neutral-400" />
            <span>You&apos;ve reached the end of your order history ({initialTotal} orders)</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderInfiniteList;
