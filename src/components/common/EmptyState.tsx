import React from "react";
import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "card" | "plain";
}

/**
 * Reusable EmptyState component for tables, grids, and catalogs
 * when no data matches the current query or filter criteria.
 */
export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
  variant = "card",
}: EmptyStateProps) {
  if (variant === "plain") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-16 px-4 text-center",
          className
        )}
      >
        <div className="rounded-2xl bg-primary-100/70 p-4 mb-4 text-primary-600 shadow-2xs">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-neutral-500 max-w-md mt-1 mb-6 leading-relaxed">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-primary-100/80 p-12 text-center shadow-xs shadow-primary-100/20",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mx-auto mb-3 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-neutral-800">{title}</h3>
      {description && (
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
