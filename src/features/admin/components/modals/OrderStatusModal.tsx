"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/api/orders";
import { showToast } from "@/lib/toast";
import { Order, OrderStatus } from "@/types/order";
import {
  Truck,
  CheckCircle,
  Clock,
  Ban,
  PackageCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface OrderStatusModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Next valid transitions map
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  paid: CheckCircle,
  processing: PackageCheck,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Ban,
};

export function OrderStatusModal({
  order,
  open,
  onOpenChange,
}: OrderStatusModalProps) {
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedTransitions = order ? VALID_TRANSITIONS[order.status] || [] : [];
  const isTerminal = allowedTransitions.length === 0;

  useEffect(() => {
    if (order) {
      setSelectedStatus(allowedTransitions[0] || "");
      setTrackingNumber(order.tracking_number || "");
      setCancellationReason(order.cancellation_reason || "");
      setError(null);
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedStatus) return;
    setError(null);

    // Validation
    if (selectedStatus === "shipped" && !trackingNumber.trim()) {
      setError("Please provide a valid tracking number for shipment.");
      return;
    }

    if (selectedStatus === "cancelled" && !cancellationReason.trim()) {
      setError("Please provide a reason for cancelling this order.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrderStatus(order.id, {
        status: selectedStatus,
        tracking_number: selectedStatus === "shipped" ? trackingNumber.trim() : undefined,
        cancellation_reason:
          selectedStatus === "cancelled" ? cancellationReason.trim() : undefined,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
      ]);

      showToast.success(
        `Order #${order.id} status updated to ${selectedStatus.toUpperCase()}.`
      );
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to update order status. Please try again.";
      setError(msg);
      showToast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  const CurrentIcon = STATUS_ICONS[order.status] || Clock;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) onOpenChange(next);
      }}
    >
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-neutral-900">
                Order Lifecycle #{order.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Manage dispatch and status fulfillment for recipient {order.recipient_name}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Current Order Summary */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Current Status:</span>
            <span className="font-bold uppercase tracking-wide text-neutral-900">
              {order.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Customer:</span>
            <span className="font-medium text-neutral-800">
              {order.user?.email || `User #${order.user_id}`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Total Amount:</span>
            <span className="font-bold text-neutral-900">
              ${Number(order.total_amount).toFixed(2)}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 pt-1 border-t border-neutral-200/60">
            <span className="text-neutral-500 flex-shrink-0">Shipping To:</span>
            <span className="text-neutral-700 text-right truncate">
              {order.shipping_address}
            </span>
          </div>
        </div>

        {isTerminal ? (
          <div className="p-4 bg-neutral-100 rounded-xl text-center text-xs text-neutral-600">
            This order is in terminal state (<strong className="uppercase">{order.status}</strong>) and cannot transition further.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-1">
            {/* Transition Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">
                Transition Status To:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allowedTransitions.map((status) => {
                  const Icon = STATUS_ICONS[status] || Clock;
                  const isSelected = selectedStatus === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-200/50"
                          : "border-rose-100/80 bg-white hover:bg-rose-50/60 hover:text-rose-700 text-neutral-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-bold capitalize">{status}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tracking Number Input (When Shipped is chosen) */}
            {selectedStatus === "shipped" && (
              <div className="space-y-1.5 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                <label className="text-xs font-semibold text-blue-950 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-700" />
                  Courier Tracking Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. JNE-882910398 or DHL-US-99182"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-blue-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
                <p className="text-[11px] text-blue-800/80">
                  Required. Customer will receive this tracking number to follow shipment progress.
                </p>
              </div>
            )}

            {/* Cancellation Reason Input (When Cancelled is chosen) */}
            {selectedStatus === "cancelled" && (
              <div className="space-y-1.5 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <label className="text-xs font-semibold text-rose-950 flex items-center gap-1.5">
                  <Ban className="w-3.5 h-3.5 text-rose-700" />
                  Cancellation Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Out of stock item, customer requested change..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-rose-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
                />
                <p className="text-[11px] text-rose-700/80">
                  Inventory stock will be restored automatically on the backend.
                </p>
              </div>
            )}

            <DialogFooter className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="text-xs font-semibold h-9 px-4"
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !selectedStatus}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-sm shadow-rose-200/50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Status
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogPopup>
    </Dialog>
  );
}
