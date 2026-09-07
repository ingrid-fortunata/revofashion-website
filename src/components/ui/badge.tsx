import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-rose-600 text-white shadow hover:bg-rose-700",
        secondary:
          "border-rose-200/80 bg-rose-50 text-rose-900 hover:bg-rose-100/80",
        rose:
          "border-rose-200/80 bg-rose-100/70 text-rose-900 hover:bg-rose-200/70",
        destructive:
          "border-transparent bg-rose-600 text-white shadow hover:bg-rose-700",
        outline: "text-neutral-800 border-rose-200/80",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        info:
          "border-transparent bg-sky-100 text-sky-800 hover:bg-sky-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
