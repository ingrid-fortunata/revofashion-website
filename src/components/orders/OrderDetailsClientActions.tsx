"use client";

import React from "react";
import Link from "next/link";
import { OrderStatus } from "@/types/order";
import { CancelOrderModal } from "./CancelOrderModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Ban } from "lucide-react";

interface OrderDetailsClientActionsProps {
  orderId: number;
  status: OrderStatus;
}

export function OrderDetailsClientActions({
  orderId,
  status,
}: OrderDetailsClientActionsProps) {
  const isCancellable = status === "pending" || status === "paid";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Button asChild variant="outline" size="sm" className="text-xs font-semibold gap-1.5">
        <Link href="/orders">
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
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold gap-1.5"
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
