"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { joinWaitlist } from "@/lib/api";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);
    setStatus("submitting");
    try {
      await joinWaitlist({ email, note: note || undefined, company: company || undefined });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2 rounded-xl border border-studio-border-strong bg-elevated p-8 text-center shadow-2xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ready/15">
          <Check className="h-5 w-5 text-ready" />
        </span>
        <p className="text-base font-semibold text-ink">You&rsquo;re on the list.</p>
        <p className="text-sm text-ink-dim">
          We&rsquo;ll reach out at <span className="text-ink">{email}</span> when your spot opens up.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-lg flex-col gap-3 rounded-xl border border-studio-border-strong bg-elevated p-4 shadow-2xl sm:p-5"
    >
      {/* Honeypot field — hidden from real users, left empty by them; bots that auto-fill every field trip it. */}
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="w-full rounded-lg bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:ring-1 focus:ring-tally"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-tally px-5 py-3 text-xs font-semibold uppercase tracking-wide text-tally-on shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:bg-[#ffc174] disabled:opacity-70"
        >
          {status === "submitting" ? "Reserving…" : "Get Early Access"}
          {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="What are you hoping to create? (optional)"
        className="w-full resize-none rounded-lg bg-base px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:ring-1 focus:ring-tally"
      />

      {error && <p className="text-xs text-critical">{error}</p>}
    </form>
  );
}
