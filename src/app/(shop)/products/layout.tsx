import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#fefbfc]">
      {/* Catalog Header Banner */}
      <div className="border-b border-rose-100/70 bg-gradient-to-b from-rose-50/60 to-transparent py-8 sm:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3"
          >
            <Link
              href="/"
              className="hover:text-rose-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-semibold text-rose-700">Products</span>
          </nav>

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
