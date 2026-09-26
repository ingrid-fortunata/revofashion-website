"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function OrderDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.error("OrderDetail error boundary caught:", error);
  }, [error]);

  const isAdmin =
    mounted && isHydrated && (user?.role === "admin" || user?.role === "superadmin");
  const backHref = isAdmin ? "/dashboard/orders" : "/orders";

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.document.referrer) {
      const targetPath = isAdmin ? "/dashboard/orders" : "/orders";
      if (window.document.referrer.includes(targetPath)) {
        e.preventDefault();
        router.back();
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-neutral-50/50 flex items-center justify-center py-12">
      <div className="container mx-auto max-w-xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4 shadow-2xs">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Order Details Unavailable
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-600">
            We couldn&apos;t retrieve the details for this order. It may not exist,
            or you might not have authorization to view it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => reset()}
              className="gap-2 bg-primary-600 hover:bg-primary-700 text-white shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="gap-2 border-neutral-300">
              <Link href={backHref} onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
