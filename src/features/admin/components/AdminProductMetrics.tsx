"use client";

import React from "react";
import { Product } from "@/types/product";
import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface AdminProductMetricsProps {
  products: Product[];
  totalCount: number;
}

export function AdminProductMetrics({
  products,
  totalCount,
}: AdminProductMetricsProps) {
  // Compute metric breakdowns from products
  const inStockCount = products.filter((p) => p.stock > 10).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const metrics = [
    {
      label: "Total Products",
      value: totalCount,
      description: "Active & catalog items",
      icon: Package,
      iconColor: "text-neutral-900 bg-neutral-100",
      badgeColor: "text-neutral-700 bg-neutral-100",
    },
    {
      label: "Healthy Stock",
      value: inStockCount,
      description: ">10 units in warehouse",
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Low Stock Alert",
      value: lowStockCount,
      description: "1 to 10 units remaining",
      icon: AlertTriangle,
      iconColor: "text-amber-700 bg-amber-50",
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      description: "Requires replenishment",
      icon: XCircle,
      iconColor: "text-rose-700 bg-rose-50",
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="p-4 bg-white border border-neutral-200/80 rounded-xl shadow-xs flex items-center justify-between transition-all hover:border-neutral-300"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {m.label}
              </p>
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {m.value}
              </p>
              <p className="text-[11px] text-neutral-400">{m.description}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconColor}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
