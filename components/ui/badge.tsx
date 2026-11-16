import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

// Near-square chips rather than lozenges. Slight positive tracking stands in for
// the monospace these used to be set in — it keeps a one-word tag from reading as
// a run-on at 11px without making it look like code.
const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-1.5 py-px text-[0.6875rem] leading-5 tracking-[0.01em] tabular-nums transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/[0.07] text-primary",
        secondary: "border-transparent bg-muted text-foreground",
        outline: "border-border-strong text-muted-foreground",
        success:
          "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-400",
        warning: "border-amber-500/30 bg-amber-500/[0.09] text-amber-700 dark:text-amber-400",
        destructive: "border-destructive/25 bg-destructive/[0.07] text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
