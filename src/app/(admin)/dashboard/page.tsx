import React from "react";
import Link from "next/link";
import { Layers, ShoppingCart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin Dashboard | RevoFashion",
  description: "Back-office management and metrics overview",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome to the RevoFashion administration portal.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-neutral-900">
              Categories
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
              <Layers className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-600">
              Manage product categories, organize fashion taxonomies, and control catalog visibility.
            </p>
            <Link href="/dashboard/categories">
              <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
                Manage Categories
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-neutral-900">
              Orders
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-600">
              View customer orders, fulfill purchases, and update shipment tracking statuses.
            </p>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
                View Orders
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
