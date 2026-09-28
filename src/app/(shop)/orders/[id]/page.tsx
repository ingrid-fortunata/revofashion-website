import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  MapPin,
  User,
  Phone,
  Truck,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { getServerToken, getServerUserRole } from "@/lib/cookies.server";
import {
  getOrderById,
  OrderStatusBadge,
  OrderTimeline,
  OrderItemsTable,
  OrderDetailsClientActions,
  OrderBreadcrumb,
} from "@/features/orders";
import { Order } from "@/types/order";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic SEO Metadata for Order Detail snapshot
 */
export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} Details — RevoFashion`,
    description: `View full order snapshot, recipient details, and fulfillment tracking for order #${id}.`,
  };
}

/**
 * Server Component: Order Detail Snapshot View (Dynamic SSR)
 * Specified in /docs/guideline/rendering_strategies.md & /docs/guideline/requirements.md
 */
export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId) || numericId <= 0) {
    notFound();
  }

  const token = await getServerToken();
  const serverRole = await getServerUserRole();

  if (!token) {
    redirect(`/login?redirect=/orders/${id}`);
  }

  let order: Order;

  try {
    const res = await getOrderById(numericId, {
      token,
      cache: "no-store",
    });
    order = res.data;

    if (!order) {
      notFound();
    }
  } catch (error) {
    console.error(`Error loading order #${id}:`, error);
    notFound();
  }

  const formattedPlacedDate = new Date(order.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 pb-16 pt-6">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <OrderBreadcrumb orderId={order.id} serverRole={serverRole} />

        {/* Top Action Bar (Back, Print, Cancel) */}
        <OrderDetailsClientActions
          orderId={order.id}
          status={order.status}
          serverRole={serverRole}
        />

        {/* Order Header Summary Banner */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  Order #{order.id}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <span>Placed on {formattedPlacedDate}</span>
              </div>
            </div>

            <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
              <span className="text-xs text-neutral-500">Total Billed</span>
              <span className="text-2xl sm:text-3xl font-black text-primary-600">
                ${Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <OrderTimeline
          status={order.status}
          cancellationReason={order.cancellation_reason}
          updatedAt={order.updated_at}
        />

        {/* Shipping & Recipient Snapshot Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-xs">
          <div className="border-b border-neutral-100 pb-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-600" />
              <h2 className="text-sm font-bold text-neutral-900">
                Delivery & Recipient Snapshot
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              Confirmed at Checkout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Recipient Details */}
            <div className="space-y-3 bg-neutral-50/60 border border-neutral-100 rounded-xl p-4">
              <span className="font-bold text-neutral-900 block text-xs tracking-wider uppercase text-neutral-400">
                Recipient Contact
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-800 font-medium">
                  <User className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>{order.recipient_name}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>{order.recipient_phone}</span>
                </div>
              </div>
            </div>

            {/* Destination Address & Tracking */}
            <div className="space-y-3 bg-neutral-50/60 border border-neutral-100 rounded-xl p-4">
              <span className="font-bold text-neutral-900 block text-xs tracking-wider uppercase text-neutral-400">
                Shipping Information
              </span>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-neutral-700">
                  <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{order.shipping_address}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/60">
                  <Truck className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span className="text-neutral-500 text-xs">Tracking Number:</span>
                  <span className="font-mono text-xs font-semibold text-neutral-900">
                    {order.tracking_number || "Will be assigned upon dispatch"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Snapshot Breakdown Table */}
        <OrderItemsTable
          items={order.items}
          totalAmount={order.total_amount}
        />

        {/* Security & Buyer Protection Footer Banner */}
        <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4 sm:p-5 flex items-center gap-3 text-xs text-neutral-600 print:hidden">
          <ShieldCheck className="h-5 w-5 text-primary-600 shrink-0" />
          <p>
            This order snapshot represents the immutable state recorded during purchase checkout. For inquiry or assistance regarding your order fulfillment, please refer to <strong>Order #{order.id}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
