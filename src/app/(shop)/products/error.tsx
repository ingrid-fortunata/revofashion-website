"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200/80 bg-red-50/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        We encountered an error loading the product catalog. Please try again.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-6 gap-2 bg-primary-600 hover:bg-primary-700"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
