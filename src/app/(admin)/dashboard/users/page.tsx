import React from "react";
import { Metadata } from "next";
import { AdminUserDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "User Management & RBAC | RevoFashion Admin",
  description:
    "Role-Based Access Control, administrative authorization, user account statuses, and credentials.",
};

export default function AdminUsersPage() {
  return <AdminUserDashboard />;
}
