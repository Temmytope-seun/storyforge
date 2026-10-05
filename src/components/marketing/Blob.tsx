import clsx from "clsx";

const COLORS = {
  amber: "bg-tally/25",
  cyan: "bg-telemetry/20",
  indigo: "bg-anamorphic/20",
} as const;

/** A soft blurred glow for ambient studio depth. */
export function Blob({
  color,
  className,
}: {
  color: keyof typeof COLORS;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={clsx("absolute rounded-full blur-[120px]", COLORS[color], className)}
    />
  );
}
