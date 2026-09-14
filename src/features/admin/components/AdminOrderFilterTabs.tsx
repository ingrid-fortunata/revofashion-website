"use client";

import React from "react";
import { OrderStatus } from "@/types/order";

export type OrderFilterTabValue = "all" | OrderStatus;

interface AdminOrderFilterTabsProps {
  activeTab: OrderFilterTabValue;
  onTabChange: (tab: OrderFilterTabValue) => void;
  counts?: Partial<Record<OrderFilterTabValue, number>>;
}

const TABS: { label: string; value: OrderFilterTabValue }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export function AdminOrderFilterTabs({
  activeTab,
  onTabChange,
  counts = {},
}: AdminOrderFilterTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        const count = counts[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              isActive
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-neutral-800 text-neutral-200"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
