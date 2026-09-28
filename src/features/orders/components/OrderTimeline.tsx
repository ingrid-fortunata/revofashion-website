import React from "react";
import { OrderStatus } from "@/types/order";
import {
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: OrderStatus;
  cancellationReason?: string | null;
  updatedAt?: string;
  className?: string;
}

interface TimelineStep {
  id: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ORDER_STEPS: TimelineStep[] = [
  {
    id: "pending",
    label: "Order Placed",
    description: "Awaiting payment verification",
    icon: CreditCard,
  },
  {
    id: "paid",
    label: "Payment Confirmed",
    description: "Payment received & verified",
    icon: CheckCircle2,
  },
  {
    id: "processing",
    label: "Processing",
    description: "Items packaging at warehouse",
    icon: Package,
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "In transit with courier carrier",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Package received safely",
    icon: Home,
  },
];

const STATUS_ORDER_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

export function OrderTimeline({
  status,
  cancellationReason,
  updatedAt,
  className,
}: OrderTimelineProps) {
  const isCancelled = status === "cancelled";
  const currentIndex = STATUS_ORDER_INDEX[status] ?? 0;

  if (isCancelled) {
    const formattedDate = updatedAt
      ? new Date(updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    return (
      <div
        className={cn(
          "rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:p-6 text-red-950",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-2xs">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-red-900">
                Order Cancelled
              </h3>
              {formattedDate && (
                <span className="text-xs text-red-600 font-medium">
                  {formattedDate}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
              This order has been cancelled and product stock has been restored.
            </p>
            {cancellationReason && (
              <div className="mt-3 rounded-lg border border-red-200/80 bg-white/80 p-3 text-xs text-red-900">
                <span className="font-semibold text-red-950">Reason: </span>
                <span>{cancellationReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900">Fulfillment Status</h3>
        <span className="text-xs font-medium text-neutral-500">
          Step {Math.min(currentIndex + 1, ORDER_STEPS.length)} of {ORDER_STEPS.length}
        </span>
      </div>

      {/* Stepper (Horizontal on desktop, stacked on mobile) */}
      <div className="relative">
        <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2">
          {ORDER_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <li
                key={step.id}
                className="relative flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center"
              >
                {/* Connecting Line (Desktop) */}
                {index > 0 && (
                  <div
                    className={cn(
                      "hidden sm:block absolute top-4 -left-1/2 w-full h-0.5 -translate-y-1/2 -z-0 transition-colors",
                      index <= currentIndex ? "bg-primary-500" : "bg-neutral-200"
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Circle Icon Indicator */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "border-primary-600 bg-primary-600 text-white shadow-2xs",
                    isCurrent &&
                      "border-primary-600 bg-primary-50 text-primary-600 ring-4 ring-primary-100",
                    isUpcoming &&
                      "border-neutral-200 bg-neutral-50 text-neutral-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Step Labels */}
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <p
                    className={cn(
                      "text-xs font-bold leading-snug",
                      isCurrent && "text-primary-600",
                      isCompleted && "text-neutral-900",
                      isUpcoming && "text-neutral-400"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-500 line-clamp-2 leading-tight">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default OrderTimeline;
