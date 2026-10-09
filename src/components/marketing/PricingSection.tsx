"use client";

import { useState } from "react";
import { Check, Info, X } from "lucide-react";
import { MarketingButton } from "./MarketingButton";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const TIERS = [
  {
    tag: "TIER 01",
    name: "Free Sandbox",
    monthly: 0,
    annual: 0,
    description: "For testing the platform.",
    features: [
      { label: "Limited AI generations", included: true },
      { label: "1 active project", included: true },
      { label: "Watermarked PDF exports", included: true },
      { label: "Character library", included: false },
    ],
  },
  {
    tag: "TIER 02 · INDIE CREATORS",
    name: "Creator",
    monthly: 19,
    annual: 15,
    description: "For indie filmmakers and video essayists.",
    features: [
      { label: "More generations / month", included: true },
      { label: "Unlimited projects", included: true },
      { label: "Character library", included: true },
      { label: "No watermark", included: true },
    ],
    highlighted: true,
  },
  {
    tag: "TIER 03 · BOUTIQUE AGENCIES",
    name: "Professional",
    monthly: 49,
    annual: 39,
    description: "For agency pitches and feature films.",
    features: [
      { label: "Higher AI limits", included: true },
      { label: "Advanced camera controls", included: true },
      { label: "Priority generation", included: true },
      { label: "Commercial usage rights", included: true },
    ],
  },
  {
    tag: "TIER 04 · MULTI-SEAT",
    name: "Team",
    monthly: null,
    annual: null,
    display: "£99+",
    description: "For agencies and studios.",
    features: [
      { label: "Multiple seats", included: true },
      { label: "Shared projects & brand kits", included: true },
      { label: "Client review links", included: true },
      { label: "Usage analytics", included: true },
    ],
  },
];

const CREDIT_COSTS = [
  { label: "Storyboard image", cost: "1 credit" },
  { label: "HD / regeneration", cost: "1–2 credits" },
  { label: "Motion preview", cost: "5 credits" },
  { label: "Voiceover line", cost: "1 credit" },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      <div className="mx-auto mb-10 flex justify-center">
        <div className="inline-flex items-center rounded-full bg-elevated p-1 shadow-inner">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all ${
              !annual ? "bg-tally text-tally-on" : "text-ink-dim hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all ${
              annual ? "bg-tally text-tally-on" : "text-ink-dim hover:text-ink"
            }`}
          >
            Annual
            <span className="rounded bg-telemetry/20 px-1 py-0.5 text-[9px] text-telemetry">
              SAVE ~20%
            </span>
          </button>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <StaggerItem
            key={tier.name}
            className={`relative flex flex-col rounded-lg border bg-elevated p-6 ${
              tier.highlighted
                ? "border-tally shadow-[0_0_0_1px_#F59E0B,0_0_24px_-4px_rgba(245,158,11,0.3)]"
                : "border-studio-border"
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tally px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tally-on">
                Most Popular
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-dim">
              {tier.tag}
            </span>
            <h3 className="mt-1 text-base font-semibold text-ink">{tier.name}</h3>
            <div className="my-3">
              {tier.display ? (
                <span className="text-3xl font-bold text-ink">{tier.display}</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-ink">
                    £{annual ? tier.annual : tier.monthly}
                  </span>
                  <span className="text-sm text-ink-dim">/month</span>
                </>
              )}
            </div>
            <p className="mb-4 text-xs text-ink-dim">{tier.description}</p>
            <ul className="flex-1 space-y-2.5 text-sm text-ink">
              {tier.features.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  {f.included ? (
                    <Check className="h-4 w-4 shrink-0 text-tally" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-ink-dim/50" />
                  )}
                  <span className={f.included ? "" : "text-ink-dim/50"}>{f.label}</span>
                </li>
              ))}
            </ul>
            <a href="#waitlist" className="mt-6">
              <MarketingButton
                size="sm"
                variant={tier.highlighted ? "primary" : "outline"}
                className="w-full"
              >
                Get Early Access
              </MarketingButton>
            </a>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-studio-border bg-elevated p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-tally">
          <Info className="h-4 w-4" />
          How credits will work
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-ink-dim">
          {CREDIT_COSTS.map((c, i) => (
            <span key={c.label}>
              <strong className="text-ink">{c.label}</strong> = {c.cost}
              {i < CREDIT_COSTS.length - 1 && <span className="ml-4 text-studio-border-strong">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
