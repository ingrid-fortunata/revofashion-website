"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/order";
import { CancelOrderModal } from "./CancelOrderModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Ban } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface OrderDetailsClientActionsProps {
  orderId: number;
  status: OrderStatus;
  serverRole?: string | null;
}

export function OrderDetailsClientActions({
  orderId,
  status,
  serverRole,
}: OrderDetailsClientActionsProps) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  const effectiveRole = isHydrated && user?.role ? user.role : serverRole;
  const isAdmin = effectiveRole === "admin" || effectiveRole === "superadmin";
  const isCancellable = status === "pending" || status === "paid";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.document.referrer) {
      const targetPath = isAdmin ? "/dashboard/orders" : "/orders";
      if (window.document.referrer.includes(targetPath)) {
        e.preventDefault();
        router.back();
      }
    }
  };

  const backHref = isAdmin ? "/dashboard/orders" : "/orders";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Button asChild variant="outline" size="sm" className="text-xs font-semibold gap-1.5">
        <Link
          href={backHref}
          onClick={handleBack}
          data-testid="back-to-orders-button"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="text-xs font-semibold gap-1.5 text-neutral-700"
        >
          <Printer className="h-3.5 w-3.5" />
          Print Order
        </Button>

        {isCancellable && (
          <CancelOrderModal
            orderId={orderId}
            status={status}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 text-xs font-semibold gap-1.5"
              >
                <Ban className="h-3.5 w-3.5" />
                Cancel Order
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

export default OrderDetailsClientActions;
