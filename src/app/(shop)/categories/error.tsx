"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Categories error boundary caught:", error);
  }, [error]);

  return (
    <div className="bg-[#fefbfc] min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-rose-50/40 px-6 py-16 text-center max-w-xl mx-auto shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-xs">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Unable to Load Categories
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-600">
            We encountered an unexpected issue while retrieving fashion categories. You can try again or continue browsing our catalog.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => reset()}
              className="gap-2 bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="gap-2 border-neutral-300">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Browse Catalog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
