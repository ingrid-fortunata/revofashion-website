import * as React from "react";
import { Button as BaseButton } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/80 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-sm shadow-primary-200/50 hover:bg-primary-700 active:bg-primary-800",
        destructive:
          "bg-red-600 text-zinc-50 shadow-sm hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-primary-200/80 bg-white text-neutral-800 shadow-sm hover:bg-primary-50/80 hover:text-primary-900 hover:border-primary-300",
        secondary:
          "bg-primary-100/70 text-primary-950 shadow-sm hover:bg-primary-200/70",
        ghost: "hover:bg-primary-50/80 hover:text-primary-900",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700",
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
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        [key: string]: unknown;
      }>;
      return React.cloneElement(child, {
        ...props,
        className: cn(combinedClassName, child.props.className),
        ref,
      });
    }

    return (
      <BaseButton
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
