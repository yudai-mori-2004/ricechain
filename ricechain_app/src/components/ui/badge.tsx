import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80",
                destructive:
                    "bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline:
                    "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
                success:
                    "bg-green-100 text-green-800 border border-green-200 shadow-sm",
                warning:
                    "bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm",
                error:
                    "bg-red-100 text-red-800 border border-red-200 shadow-sm",
                info:
                    "bg-blue-100 text-blue-800 border border-blue-200 shadow-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
