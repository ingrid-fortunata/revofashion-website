import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ShoppingBag } from "lucide-react";
import { getServerToken, getServerUserRole } from "@/lib/cookies.server";
import { OrderInfiniteList, getOrders } from "@/features/orders";
import { Button } from "@/components/ui/button";
import { Breadcrumb, EmptyState } from "@/components/common";
import { Order } from "@/types/order";

export const metadata: Metadata = {
  title: "Order History — RevoFashion",
  description: "Track and review all your placed fashion orders.",
};

const ORDERS_PER_PAGE = 5;

/**
 * Server Component: Order History Listing (SSR with Server Cookie Authentication & Infinite Scroll)
 * Specified in /docs/guideline/rendering_strategies.md (Halaman 3) & /docs/guideline/requirements.md
 */
export default async function OrdersPage() {
  const token = await getServerToken();

  // If unauthenticated on server, immediately redirect to login with return target
  if (!token) {
    redirect("/login?redirect=/orders");
  }

  // Admin and Superadmin users should manage orders from the admin dashboard
  const userRole = await getServerUserRole();
  if (userRole === "admin" || userRole === "superadmin") {
    redirect("/dashboard/orders");
  }

  let orders: Order[] = [];
  let totalPages = 1;
  let totalOrders = 0;

  try {
    const res = await getOrders(
      { page: 1, per_page: ORDERS_PER_PAGE },
      {
        token,
        cache: "no-store",
      }
    );
    orders = res.data || [];
    totalPages = res.pages || 1;
    totalOrders = res.total || orders.length;
  } catch (error) {
    console.error("OrdersPage server fetch error:", error);
    throw error; // Caught by src/app/(shop)/orders/error.tsx
  }

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Order History", active: true },
          ]}
          className="mb-6"
        />

        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Track fulfillment status and view invoice snapshots for all your orders.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders found"
            description="You haven't placed any orders yet. Explore our contemporary collections and elevate your wardrobe!"
            action={
              <Button asChild variant="default" size="default" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold">
                <Link href="/products">Shop New Arrivals</Link>
              </Button>
            }
            className="rounded-2xl border border-dashed border-primary-200 py-16"
          />
        ) : (
          /* Infinite Scroll Order List */
          <OrderInfiniteList
            initialOrders={orders}
            initialPages={totalPages}
            initialTotal={totalOrders}
            perPage={ORDERS_PER_PAGE}
          />
        )}
      </div>
    </div>
  );
}
