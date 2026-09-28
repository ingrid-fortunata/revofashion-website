"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (newPage: number) => void;
  totalCount?: number;
  pageSize?: number;
  itemName?: string;
  className?: string;
  variant?: "catalog" | "table";
}

/**
 * Reusable Pagination component supporting both catalog (centered)
 * and table (split with summary info) layouts.
 */
export function Pagination({
  page,
  pages,
  onPageChange,
  totalCount,
  pageSize = 10,
  itemName = "items",
  className,
  variant = "catalog",
}: PaginationProps) {
  if (pages <= 1 && (!totalCount || totalCount <= pageSize)) {
    return null;
  }

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

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = totalCount ? Math.min(page * pageSize, totalCount) : page * pageSize;

  if (variant === "table") {
    return (
      <div
        className={cn(
          "p-4 border-t border-primary-100/80 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600",
          className
        )}
      >
        {totalCount !== undefined ? (
          <div>
            Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{" "}
            <strong>{totalCount}</strong> {itemName}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-2.5 text-xs gap-1 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((num, idx) => {
              if (num === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-neutral-400 font-medium"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(num);
              const isCurrent = pageNum === page;

              return (
                <Button
                  key={pageNum}
                  type="button"
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    "h-8 w-8 p-0 text-xs font-semibold",
                    isCurrent
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50 hover:bg-primary-700"
                      : "text-neutral-700 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-2.5 text-xs gap-1 border-primary-200/70 hover:bg-primary-50 hover:text-primary-700"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  // Catalog variant (centered)
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("mx-auto flex w-full justify-center pt-6", className)}
    >
      <div className="flex flex-row items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "gap-1 pl-2.5 pr-3 h-9 text-xs font-medium border-primary-200/80 hover:bg-primary-50 hover:text-primary-700",
            page <= 1 && "opacity-50 pointer-events-none"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {pageNumbers.map((num, idx) => {
          if (num === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-neutral-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = Number(num);
          const isCurrent = pageNum === page;

          return (
            <Button
              key={pageNum}
              type="button"
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "h-9 w-9 p-0 text-xs font-semibold",
                isCurrent
                  ? "bg-primary-600 text-white shadow-sm shadow-primary-200/50 hover:bg-primary-700"
                  : "text-neutral-700 border-primary-200/80 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "gap-1 pl-3 pr-2.5 h-9 text-xs font-medium border-primary-200/80 hover:bg-primary-50 hover:text-primary-700",
            page >= pages && "opacity-50 pointer-events-none"
          )}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

export default Pagination;
