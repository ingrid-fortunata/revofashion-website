import React from "react";
import { Metadata } from "next";
import { AdminOrderDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Order Oversight & Fulfillment | RevoFashion Admin",
  description: "Monitor customer purchases, assign courier tracking numbers, and update order statuses.",
};

export default function AdminOrdersPage() {
  return <AdminOrderDashboard />;
}
