"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tally text-tally-on hover:shadow-[0_0_0_1px_#F59E0B,0_0_16px_-2px_rgba(245,158,11,0.45)] disabled:opacity-40",
  secondary:
    "bg-white/[0.04] hover:bg-white/[0.08] text-ink border border-studio-border disabled:opacity-40",
  ghost: "bg-transparent hover:bg-white/[0.06] text-ink-dim hover:text-ink disabled:opacity-40",
  danger: "bg-critical/15 hover:bg-critical/25 text-critical border border-critical/30 disabled:opacity-40",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs rounded",
  md: "px-4 py-2 text-sm rounded",
};

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

export const Button = forwardRef<
  HTMLButtonElement,
  NativeButtonProps & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition-all disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
