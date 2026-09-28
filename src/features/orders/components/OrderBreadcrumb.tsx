"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface OrderBreadcrumbProps {
  orderId: number;
  serverRole?: string | null;
}

export function OrderBreadcrumb({ orderId, serverRole }: OrderBreadcrumbProps) {
  const { user, isHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveRole =
    mounted && isHydrated && user?.role ? user.role : serverRole;
  const isAdmin = effectiveRole === "admin" || effectiveRole === "superadmin";

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs text-neutral-500 print:hidden"
    >
      <Link
        href={isAdmin ? "/dashboard" : "/"}
        className="hover:text-primary-600 transition-colors"
      >
        {isAdmin ? "Dashboard" : "Home"}
      </Link>
      <ChevronRight className="h-3 w-3 text-neutral-400" />
      <Link
        href={isAdmin ? "/dashboard/orders" : "/orders"}
        className="hover:text-primary-600 transition-colors"
      >
        {isAdmin ? "Orders" : "Order History"}
      </Link>
      <ChevronRight className="h-3 w-3 text-neutral-400" />
      <span className="font-semibold text-primary-600">Order #{orderId}</span>
    </nav>
  );
}

export default OrderBreadcrumb;
