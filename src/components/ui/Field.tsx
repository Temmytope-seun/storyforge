"use client";

import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import clsx from "clsx";

const baseClasses =
  "w-full rounded border border-studio-border bg-white/[0.03] px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-telemetry focus:outline-none focus:ring-1 focus:ring-telemetry";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={clsx(baseClasses, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={clsx(baseClasses, "resize-none", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={clsx(baseClasses, className)} {...props} />
));
Select.displayName = "Select";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={clsx(
        "mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-dim",
        className
      )}
    >
      {children}
    </label>
  );
}
