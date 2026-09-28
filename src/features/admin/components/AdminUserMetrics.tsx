"use client";

import React from "react";
import { User } from "@/types/auth";
import { Users, ShieldAlert, CheckCircle2, UserX } from "lucide-react";
import { StatCard } from "@/components/common";

interface AdminUserMetricsProps {
  users: User[];
  totalCount: number;
}

export function AdminUserMetrics({
  users,
  totalCount,
}: AdminUserMetricsProps) {
  // Compute metric breakdowns from users
  const adminCount = users.filter(
    (u) => u.role === "admin" || u.role === "superadmin"
  ).length;
  const activeCustomerCount = users.filter(
    (u) => u.role === "customer" && u.is_active
  ).length;
  const inactiveCount = users.filter((u) => !u.is_active).length;

  const metrics = [
    {
      label: "Total Accounts",
      value: totalCount,
      description: "Registered platform users",
      icon: Users,
      iconColor: "text-primary-600 bg-primary-50 border border-primary-100",
    },
    {
      label: "Admins & Staff",
      value: adminCount,
      description: "Superadmins and store managers",
      icon: ShieldAlert,
      iconColor: "text-indigo-600 bg-indigo-50 border border-indigo-100",
    },
    {
      label: "Active Customers",
      value: activeCustomerCount,
      description: "Verified regular shoppers",
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50 border border-emerald-100",
    },
    {
      label: "Deactivated",
      value: inactiveCount,
      description: "Suspended or disabled logins",
      icon: UserX,
      iconColor: "text-rose-600 bg-rose-50 border border-rose-100",
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
