import React from "react";
import { Sidebar } from "@/components/layouts";
import { AdminRoute } from "@/components/routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-neutral-100/60">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </AdminRoute>
  );
}
