"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api/orders";
import { Order, OrderStatus } from "@/types/order";
import {
  AdminOrderFilterTabs,
  OrderFilterTabValue,
  AdminOrderToolbar,
  AdminOrderTable,
  OrderStatusModal,
} from "@/features/admin";

export function AdminOrderDashboard() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState<OrderFilterTabValue>("all");
  const [search, setSearch] = useState("");

  const [managingOrder, setManagingOrder] = useState<Order | null>(null);

  // Fetch orders
  const { data: orderData, isLoading } = useQuery({
    queryKey: [
      "admin-orders",
      {
        page,
        per_page: pageSize,
        status: activeTab === "all" ? undefined : (activeTab as OrderStatus),
        search: search.trim() || undefined,
      },
    ],
    queryFn: () =>
      getOrders({
        page,
        per_page: pageSize,
        status: activeTab === "all" ? undefined : (activeTab as OrderStatus),
        search: search.trim() || undefined,
      }),
    staleTime: 30 * 1000,
  });

  const orders = orderData?.data || [];
  const totalOrders = orderData?.total || 0;
  const totalPages = orderData?.pages || 1;

  // Handlers
  const handleTabChange = (tab: OrderFilterTabValue) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleReset = () => {
    setActiveTab("all");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || activeTab !== "all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Order Oversight
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track customer purchases, fulfill shipment tracking numbers, and update order statuses.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <AdminOrderFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Search Toolbar */}
      <AdminOrderToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={totalOrders}
      />

      {/* Order Data Table */}
      <AdminOrderTable
        orders={orders}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalOrders={totalOrders}
        pageSize={pageSize}
        onPageChange={setPage}
        onManageStatus={(order) => setManagingOrder(order)}
      />

      {/* Lifecycle Status Transition Modal */}
      <OrderStatusModal
        order={managingOrder}
        open={Boolean(managingOrder)}
        onOpenChange={(open) => {
          if (!open) setManagingOrder(null);
        }}
      />
    </div>
  );
}
