"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tally text-tally-on shadow-[0_0_24px_-4px_rgba(245,158,11,0.5)] hover:bg-[#ffc174]",
  dark: "bg-elevated text-ink border border-studio-border hover:bg-hover",
  outline:
    "border border-studio-border bg-white/[0.03] text-ink backdrop-blur-sm hover:bg-white/[0.08]",
  ghost: "text-ink-dim hover:text-ink",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded",
  md: "px-5 py-2.5 text-sm rounded",
  lg: "px-7 py-3.5 text-base rounded",
};

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

export const MarketingButton = forwardRef<
  HTMLButtonElement,
  NativeButtonProps & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
MarketingButton.displayName = "MarketingButton";
