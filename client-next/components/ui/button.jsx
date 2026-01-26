import React from 'react'
import { cn } from '@/lib/utils'
import { cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground text-center rounded-full",
    {
        variants: {
            variant: {
                default: "bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/40 text-white",
                solid: "bg-blue-600 hover:bg-blue-700 text-white border-blue-500/50 hover:border-blue-400/50 transition-all duration-200",
                ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10",
            },
            size: {
                default: "px-7 py-1.5 ",
                sm: "px-4 py-0.5 ",
                lg: "px-10 py-2.5 ",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(
    ({ className, neon = true, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                suppressHydrationWarning
                {...props}
            >
                <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-[#3B82F6] via-[#3B82F6] to-transparent hidden", neon && "block")} />
                {children}
                <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-[#3B82F6] via-[#3B82F6] to-transparent hidden", neon && "block")} />
            </button>
        );
    }
)

Button.displayName = 'Button';

export { Button, buttonVariants };
