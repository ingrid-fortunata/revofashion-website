"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable Breadcrumb component for shop and dashboard pages.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-neutral-500 print:hidden",
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isActive = item.active ?? isLast;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
            )}

            {item.href && !isActive ? (
              <Link
                href={item.href}
                className="hover:text-primary-600 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "truncate max-w-[240px]",
                  isActive ? "font-semibold text-primary-600" : "text-neutral-500"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
