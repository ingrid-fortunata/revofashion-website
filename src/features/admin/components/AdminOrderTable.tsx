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
import { Order } from "@/types/order";
import { ExternalLink, ShoppingBag } from "lucide-react";
import dayjs from "dayjs";
import {
  EmptyState,
  TableSkeleton,
  Pagination,
  OrderStatusBadge,
} from "@/components/common";

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
    return <TableSkeleton rows={6} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Orders Found"
        description="No customer purchase orders match the selected filter or search query."
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-primary-100/80 shadow-xs shadow-primary-100/20 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary-50/40 border-b border-primary-100/80">
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
              const itemCount =
                order.items?.reduce((acc, item) => acc + item.quantity, 0) ||
                order.items?.length ||
                1;

              return (
                <TableRow
                  key={order.id}
                  className="hover:bg-primary-50/30 transition-colors"
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
                    <OrderStatusBadge status={order.status} />
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
                        className="h-8 px-2.5 text-xs font-semibold border-primary-200 text-primary-700 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-300"
                      >
                        Update Status
                      </Button>

                      <Link href={`/orders/${order.id}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-primary-700 hover:bg-primary-50/80"
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
      <Pagination
        page={currentPage}
        pages={totalPages}
        onPageChange={onPageChange}
        totalCount={totalOrders}
        pageSize={pageSize}
        itemName="orders"
        variant="table"
      />
    </div>
  );
}
