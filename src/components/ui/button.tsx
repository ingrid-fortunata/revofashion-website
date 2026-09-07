import * as React from "react";
import { Button as BaseButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/80 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-rose-600 text-white shadow-sm shadow-rose-200/50 hover:bg-rose-700 active:bg-rose-800",
        destructive:
          "bg-red-600 text-zinc-50 shadow-sm hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-rose-200/80 bg-white text-neutral-800 shadow-sm hover:bg-rose-50/80 hover:text-rose-900 hover:border-rose-300",
        secondary:
          "bg-rose-100/70 text-rose-950 shadow-sm hover:bg-rose-200/70",
        ghost: "hover:bg-rose-50/80 hover:text-rose-900",
        link: "text-rose-600 underline-offset-4 hover:underline hover:text-rose-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <BaseButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
