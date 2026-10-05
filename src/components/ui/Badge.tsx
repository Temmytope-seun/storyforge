import clsx from "clsx";

const DOT_COLORS = {
  amber: "bg-tally",
  cyan: "bg-telemetry",
  green: "bg-ready",
  red: "bg-critical",
} as const;

export function Badge({
  children,
  className,
  dot,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: keyof typeof DOT_COLORS;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border border-studio-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-dim",
        className
      )}
    >
      {dot && (
        <span className={clsx("h-1.5 w-1.5 rounded-full", DOT_COLORS[dot])} />
      )}
      {children}
    </span>
  );
}
