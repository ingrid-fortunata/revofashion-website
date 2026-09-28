import React from "react";
import Link from "next/link";
import { OrderItem } from "@/types/order";
import { Package, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItemsTableProps {
  items?: OrderItem[];
  totalAmount: number;
  className?: string;
}

export function OrderItemsTable({
  items = [],
  totalAmount,
  className,
}: OrderItemsTableProps) {
  const calculatedSubtotal = items.reduce(
    (acc, item) => acc + Number(item.price_at_purchase) * item.quantity,
    0
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs",
        className
      )}
    >
      <div className="border-b border-neutral-100 bg-neutral-50/70 px-5 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-bold text-neutral-900">
            Purchased Items ({items.length})
          </h3>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          Historical Purchase Snapshot
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-neutral-100 px-5 sm:px-6">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No item snapshot details recorded for this order.
          </div>
        ) : (
          items.map((item, idx) => {
            const lineTotal = Number(item.price_at_purchase) * item.quantity;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50/70 border border-primary-100 text-primary-500 shadow-2xs">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product_id}`}
                      className="text-sm font-bold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1"
                    >
                      {item.name || `Apparel Product #${item.product_id}`}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                        Size: {item.size || "Free Size"}
                      </span>
                      {item.color && (
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                          Color: {item.color}
                        </span>
                      )}
                      <span className="text-neutral-400">
                        Unit: ${Number(item.price_at_purchase).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-neutral-100 pt-2 sm:pt-0">
                  <span className="text-xs text-neutral-500">
                    Qty: <strong className="text-neutral-800 font-semibold">{item.quantity}</strong>
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                    ${lineTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      <div className="border-t border-neutral-100 bg-neutral-50/60 p-5 sm:p-6 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-neutral-900">
            ${calculatedSubtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            Standard Delivery
            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
              Free
            </span>
          </span>
          <span className="font-semibold text-emerald-600">$0.00</span>
        </div>
        <div className="border-t border-neutral-200/80 pt-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-neutral-900">Grand Total</span>
            <p className="text-[11px] text-neutral-500">All local taxes & tariffs included</p>
          </div>
          <span className="text-xl sm:text-2xl font-black text-primary-600">
            ${Number(totalAmount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderItemsTable;
