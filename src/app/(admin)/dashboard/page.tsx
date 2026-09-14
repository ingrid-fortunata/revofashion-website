import React from "react";
import { Metadata } from "next";
import { AdminProductDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Product Inventory & Catalog | RevoFashion Admin",
  description:
    "Back-office inventory management, stock levels, catalog pricing, and product operations.",
};

export default function DashboardPage() {
  return <AdminProductDashboard />;
}
