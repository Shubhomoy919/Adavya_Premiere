import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Red-carpet gradient with a sweeping sheen — see .btn-premiere */
        default: "btn-premiere rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/60 shadow-card hover:bg-destructive/90 hover:shadow-red rounded-sm",
        outline:
          "border border-gold/45 bg-transparent text-gold hover:bg-gold/10 hover:border-gold/80 rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground border border-gold/15 shadow-card hover:bg-secondary/80 hover:border-gold/30 rounded-sm",
        ghost: "text-muted-foreground hover:bg-gold/10 hover:text-gold rounded-sm",
        link: "text-gold underline-offset-4 hover:underline hover:text-gold-light",
        /* Gold foil — the VIP / primary-confirm action, see .btn-gold */
        vintage: "btn-gold rounded-sm",
        elegant:
          "bg-transparent border border-gold/60 text-gold hover:bg-gold hover:text-onyx hover:shadow-gold rounded-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
