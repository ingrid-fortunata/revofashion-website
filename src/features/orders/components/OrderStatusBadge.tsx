import React from "react";
import { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showDot?: boolean;
}

interface StatusConfig {
  label: string;
  badgeClasses: string;
  dotClasses: string;
}

const STATUS_CONFIG_MAP: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Pending Payment",
    badgeClasses: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80",
    dotClasses: "bg-amber-500 animate-pulse",
  },
  paid: {
    label: "Payment Verified",
    badgeClasses: "bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/80",
    dotClasses: "bg-sky-500",
  },
  processing: {
    label: "Processing",
    badgeClasses: "bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/80",
    dotClasses: "bg-indigo-500",
  },
  shipped: {
    label: "In Transit",
    badgeClasses: "bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80",
    dotClasses: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80",
    dotClasses: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClasses: "bg-red-50 text-red-700 border-red-200/80 hover:bg-red-100/80",
    dotClasses: "bg-red-500",
  },
};

export function OrderStatusBadge({
  status,
  className,
  showDot = true,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG_MAP[status] || {
    label: status,
    badgeClasses: "bg-neutral-50 text-neutral-700 border-neutral-200",
    dotClasses: "bg-neutral-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        config.badgeClasses,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClasses)}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

export default OrderStatusBadge;
