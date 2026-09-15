"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types/order";
import {
  Clock,
  CheckCircle,
  PackageCheck,
  Truck,
  Ban,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import dayjs from "dayjs";

interface AdminOrderTableProps {
  orders: Order[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onManageStatus: (order: Order) => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; dot: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    color: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-500",
    icon: PackageCheck,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-50 text-purple-800 border-purple-200",
    dot: "bg-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
    icon: Ban,
  },
};

export function AdminOrderTable({
  orders,
  isLoading,
  currentPage,
  totalPages,
  totalOrders,
  pageSize,
  onPageChange,
  onManageStatus,
}: AdminOrderTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-rose-100/80 shadow-xs shadow-rose-100/20 overflow-hidden p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-neutral-100/70 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-rose-100/80 p-12 text-center shadow-xs shadow-rose-100/20">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto mb-3">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-neutral-800">No Orders Found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          No customer purchase orders match the selected filter or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-rose-100/80 shadow-xs shadow-rose-100/20 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-rose-50/40 border-b border-rose-100/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Order Info
              </TableHead>
              <TableHead className="w-[180px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Customer
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Recipient & Address
              </TableHead>
              <TableHead className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Items
              </TableHead>
              <TableHead className="w-[110px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Total
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-neutral-600 uppercase tracking-wider pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || {
                label: order.status,
                color: "bg-neutral-100 text-neutral-700 border-neutral-200",
                dot: "bg-neutral-400",
                icon: Clock,
              };

              const itemCount =
                order.items?.reduce((acc, item) => acc + item.quantity, 0) ||
                order.items?.length ||
                1;

              return (
                <TableRow
                  key={order.id}
                  className="hover:bg-rose-50/30 transition-colors"
                >
                  {/* Order Info (ID, Date) */}
                  <TableCell className="py-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-neutral-400 mt-0.5">
                        {order.created_at
                          ? dayjs(order.created_at).format("MMM DD, YYYY")
                          : "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer (Username, Email) */}
                  <TableCell className="py-3">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-neutral-900 truncate">
                        {order.user?.username || `User #${order.user_id}`}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {order.user?.email || "No email on record"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Recipient & Address */}
                  <TableCell className="py-3 text-xs text-neutral-700">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-medium text-neutral-900 truncate">
                        {order.recipient_name}
                      </p>
                      <p className="text-[11px] text-neutral-500 line-clamp-1">
                        {order.shipping_address}
                      </p>
                      {order.recipient_phone && (
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {order.recipient_phone}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Items summary */}
                  <TableCell className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="py-3 text-xs font-bold text-neutral-900 font-mono">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.color}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                    {order.tracking_number && (
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-[120px]" title={order.tracking_number}>
                        {order.tracking_number}
                      </p>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-right pr-6">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onManageStatus(order)}
                        data-testid={`manage-order-${order.id}`}
                        className="h-8 px-2.5 text-xs font-semibold border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300"
                      >
                        Update Status
                      </Button>

                      <Link href={`/orders/${order.id}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-rose-700 hover:bg-rose-50/80"
                          title="View Invoice"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-rose-100/80 bg-rose-50/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalOrders)}
            </strong>{" "}
            of <strong>{totalOrders}</strong> orders
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-2.5 text-xs gap-1 border-rose-200/70 hover:bg-rose-50 hover:text-rose-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-1 px-1">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <Button
                      key={pageNum}
                      type="button"
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={`h-8 w-8 p-0 text-xs font-semibold ${
                        pageNum === currentPage
                          ? "bg-rose-600 text-white shadow-sm shadow-rose-200/50 hover:bg-rose-700"
                          : "text-neutral-700 border-rose-200/70 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-2.5 text-xs gap-1 border-rose-200/70 hover:bg-rose-50 hover:text-rose-700"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
