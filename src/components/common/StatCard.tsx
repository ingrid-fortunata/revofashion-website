import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon | React.ElementType;
  iconColor?: string;
  className?: string;
}

/**
 * Reusable Metric / KPI Card for dashboards and analytics views.
 */
export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary-600 bg-primary-50 border border-primary-100",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-4 bg-white border border-primary-100/80 rounded-xl shadow-xs shadow-primary-100/20 flex items-center justify-between transition-all hover:border-primary-300 hover:shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          {value}
        </p>
        {description && (
          <p className="text-[11px] text-neutral-400">{description}</p>
        )}
      </div>
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          iconColor
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default StatCard;
