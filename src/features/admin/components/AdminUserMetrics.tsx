"use client";

import React from "react";
import { User } from "@/types/auth";
import { Users, ShieldAlert, CheckCircle2, UserX } from "lucide-react";

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
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="p-4 bg-white border border-primary-100/80 rounded-xl shadow-xs shadow-primary-100/20 flex items-center justify-between transition-all hover:border-primary-300 hover:shadow-sm"
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
