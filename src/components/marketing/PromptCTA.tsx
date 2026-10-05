"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function PromptCTA() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = value.trim() ? `?idea=${encodeURIComponent(value.trim())}` : "";
    router.push(`/projects/new${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-2xl flex-col items-center gap-2 rounded-xl bg-elevated p-2 shadow-2xl sm:flex-row"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a scene or pitch line (e.g. INT. SPACECRAFT COCKPIT - EMERGENCY)"
        className="w-full bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none"
      />
      <button
        type="submit"
        className="flex w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-tally px-5 py-3 text-xs font-semibold uppercase tracking-wide text-tally-on shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:bg-[#ffc174] sm:w-auto"
      >
        Start Creating Free
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
