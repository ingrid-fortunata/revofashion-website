import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200/80 bg-rose-50/30 px-6 py-16 text-center shadow-xs my-4">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-5 shadow-inner">
        <PackageX className="h-8 w-8" />
      </div>

      {/* Heading & Notice */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
        Product Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-neutral-600 leading-relaxed">
        The piece you are looking for does not exist, may have been retired from the collection, or the link may be invalid.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" className="gap-2 bg-rose-600 hover:bg-rose-700 shadow-xs">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Browse All Products
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2 border-neutral-300">
          <Link href="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
