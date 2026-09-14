import React from "react";
import { Metadata } from "next";
import { AdminCategoryDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Category Management | RevoFashion Admin",
  description: "Organize fashion taxonomy, catalog collections, and category visibility.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoryDashboard />;
}
