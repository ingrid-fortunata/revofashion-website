import React from "react";
import { AdminShell } from "@/components/layouts";
import { AdminRoute } from "@/components/routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <AdminShell>{children}</AdminShell>
    </AdminRoute>
  );
}

