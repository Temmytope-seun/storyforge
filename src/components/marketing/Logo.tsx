import clsx from "clsx";

/** Simple geometric mark: three stacked "frames" suggesting a storyboard/film strip. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-300 to-orange-400",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <rect x="2" y="3" width="20" height="5" rx="1.5" fill="#1a1a1a" />
        <rect x="2" y="10" width="20" height="5" rx="1.5" fill="#1a1a1a" opacity="0.7" />
        <rect x="2" y="17" width="20" height="4" rx="1.5" fill="#1a1a1a" opacity="0.4" />
      </svg>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-sm font-semibold text-ink">StoryForge AI</span>
    </div>
  );
}
