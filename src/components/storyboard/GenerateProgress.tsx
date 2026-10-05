"use client";

import { useEffect, useState } from "react";

export function GenerateProgress({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-3 text-sm text-ink">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/10 border-t-tally" />
      <span>{messages[index]}</span>
    </div>
  );
}
