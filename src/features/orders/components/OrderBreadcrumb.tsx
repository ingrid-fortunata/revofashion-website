"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/common";
import { useAuthStore } from "@/stores/useAuthStore";

export interface OrderBreadcrumbProps {
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
    <Breadcrumb
      items={[
        {
          label: isAdmin ? "Dashboard" : "Home",
          href: isAdmin ? "/dashboard" : "/",
        },
        {
          label: isAdmin ? "Orders" : "Order History",
          href: isAdmin ? "/dashboard/orders" : "/orders",
        },
        {
          label: `Order #${orderId}`,
          active: true,
        },
      ]}
    />
  );
}

export default OrderBreadcrumb;
