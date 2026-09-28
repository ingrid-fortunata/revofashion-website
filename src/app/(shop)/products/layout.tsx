import React from "react";
import { Breadcrumb } from "@/components/common";

export const metadata = {
  title: "Product Catalog | RevoFashion",
  description:
    "Explore our complete contemporary fashion collection, designed with minimalist aesthetics and everyday comfort.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Catalog Header Banner */}
      <div className="border-b border-primary-100/70 bg-gradient-to-b from-primary-50/60 to-transparent py-8 sm:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Products", active: true },
            ]}
            className="mb-3"
          />

          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Contemporary Collection
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Curated garments thoughtfully tailored for effortless style, timeless utility, and modern comfort.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
