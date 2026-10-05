/** Faint grid texture for ambient studio depth behind hero sections. */
export function StudioGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]"
    >
      <defs>
        <pattern id="studio-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8b92a3" strokeWidth="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#studio-grid)" />
    </svg>
  );
}
