"use client";

import React from "react";
import { Product } from "@/types/product";
import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { StatCard } from "@/components/common";

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
      iconColor: "text-primary-600 bg-primary-50 border border-primary-100",
    },
    {
      label: "Healthy Stock",
      value: inStockCount,
      description: ">10 units in warehouse",
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50 border border-emerald-100",
    },
    {
      label: "Low Stock Alert",
      value: lowStockCount,
      description: "1 to 10 units remaining",
      icon: AlertTriangle,
      iconColor: "text-amber-700 bg-amber-50 border border-amber-100",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      description: "Requires replenishment",
      icon: XCircle,
      iconColor: "text-red-700 bg-red-50 border border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <StatCard
          key={m.label}
          label={m.label}
          value={m.value}
          description={m.description}
          icon={m.icon}
          iconColor={m.iconColor}
        />
      ))}
    </div>
  );
}
