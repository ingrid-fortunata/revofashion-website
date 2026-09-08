"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <Pagination className={`pt-6 ${className}`}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={page <= 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {/* Numbered Page Buttons */}
        {pageNumbers.map((num, idx) => {
          if (num === "...") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNum = Number(num);
          const isCurrent = pageNum === page;

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={isCurrent}
                onClick={() => onPageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            className={page >= pages ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
