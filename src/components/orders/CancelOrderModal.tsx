"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/api/orders";
import { showToast } from "@/lib/toast";
import { OrderStatus } from "@/types/order";
import { AlertTriangle, Ban } from "lucide-react";

interface CancelOrderModalProps {
  orderId: number;
  status: OrderStatus;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CancelOrderModal({
  orderId,
  status,
  trigger,
  onSuccess,
}: CancelOrderModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soft-cancellation only permissible if status is pending or paid
  const isCancellable = status === "pending" || status === "paid";

  if (!isCancellable) {
    return null;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(nextOpen);
      if (!nextOpen) {
        setReason("");
        setError(null);
      }
    }
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Please specify a reason for cancelling this order.");
      return;
    }

    if (trimmedReason.length < 5) {
      setError("Cancellation reason must be at least 5 characters long.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await cancelOrder(orderId, trimmedReason);
      setOpen(false);
      setReason("");
      showToast.success(
        "Order Cancelled",
        `Order #${orderId} has been cancelled and stock was restored.`
      );
      router.refresh();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to cancel order. Please try again or contact support.";
      setError(message);
      showToast.error("Cancellation Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-block cursor-pointer"
      >
        {trigger || (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold gap-1.5"
          >
            <Ban className="h-3.5 w-3.5" />
            Cancel Order
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogPopup className="sm:max-w-md">
          <form onSubmit={handleConfirmCancel}>
            <DialogHeader className="space-y-2">
              <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-2xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900">
                Cancel Order #{orderId}?
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Are you sure you want to cancel this order? Once cancelled, reserved
                stock will be released back to the inventory catalogue immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <label
                htmlFor={`cancel-reason-${orderId}`}
                className="block text-xs font-bold text-neutral-800"
              >
                Reason for Cancellation <span className="text-rose-600">*</span>
              </label>
              <textarea
                id={`cancel-reason-${orderId}`}
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
                placeholder="e.g., Changed mind, ordered incorrect size, or shipping address error..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:bg-neutral-100 disabled:cursor-not-allowed resize-none"
              />
              {error && (
                <p className="text-xs font-medium text-rose-600 animate-in fade-in-50">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="mt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
                className="text-xs"
              >
                Keep Order
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
              >
                {isSubmitting && (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogPopup>
      </Dialog>
    </>
  );
}

export default CancelOrderModal;
