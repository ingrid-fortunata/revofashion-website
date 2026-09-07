"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  page: number;
  pages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function ProductPagination({
  page,
  pages,
  onPageChange,
  className = "",
}: ProductPaginationProps) {
  if (pages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift("...");
    }
    if (page + delta < pages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (pages > 1) {
      range.push(pages);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-2 pt-6 ${className}`}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 px-3 gap-1 text-xs"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((num, idx) => {
          if (num === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-xs font-semibold text-neutral-400"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(num);
          const isCurrent = pageNum === page;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? "bg-rose-600 text-white shadow-sm shadow-rose-200/50"
                  : "border border-rose-100/80 bg-white text-neutral-700 hover:border-rose-300 hover:bg-rose-50/50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 px-3 gap-1 text-xs"
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
