"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product detail error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-rose-50/40 px-6 py-16 text-center my-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-xs">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
        Unable to Load Product
      </h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        We encountered an error while loading the product details. You can try refreshing or browse our full catalog.
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
            Back to Catalog
          </Link>
        </Button>
      </div>
    </div>
  );
}
