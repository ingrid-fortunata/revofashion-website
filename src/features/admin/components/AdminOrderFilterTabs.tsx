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
                ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50"
                : "bg-white text-neutral-600 border border-primary-100/80 hover:bg-primary-50/70 hover:text-primary-700"
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-primary-700/90 text-white"
                    : "bg-primary-50 text-primary-700 border border-primary-100"
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
