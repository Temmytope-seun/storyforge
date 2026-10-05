import Link from "next/link";
import Image from "next/image";
import {
  Clapperboard,
  Download,
  Fingerprint,
  FileCode2,
  Mic,
  PenLine,
  Video,
} from "lucide-react";
import { MarketingButton } from "@/components/marketing/MarketingButton";
import { InteractiveDemo } from "@/components/marketing/InteractiveDemo";
import { PricingSection } from "@/components/marketing/PricingSection";
import { PromptCTA } from "@/components/marketing/PromptCTA";
import { Logo } from "@/components/marketing/Logo";
import { Blob } from "@/components/marketing/Blob";
import { StudioGrid } from "@/components/marketing/StudioGrid";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Reveal";

const PIPELINE = [
  {
    step: "01",
    icon: PenLine,
    accent: "text-tally",
    accentBg: "bg-tally/15",
    title: "Describe or Paste Your Story",
    description:
      "Type an idea, paste a scene, or drop in a draft script as plain text — no special file format required.",
    tag: "Works with any plain text input",
  },
  {
    step: "02",
    icon: Clapperboard,
    accent: "text-telemetry",
    accentBg: "bg-telemetry/15",
    title: "AI Shot Planning",
    description:
      "Generates a shot list following cinematography conventions: wide masters, close-ups, tracking shots and lens choices per shot.",
    tag: "Camera angle, lens & movement per shot",
  },
  {
    step: "03",
    icon: Fingerprint,
    accent: "text-tally",
    accentBg: "bg-tally/15",
    title: "Character Continuity",
    description:
      "Define a character once — name, appearance, wardrobe — and that description is reused automatically in every scene they appear in.",
    tag: "Reused automatically across scenes",
  },
  {
    step: "04",
    icon: Download,
    accent: "text-telemetry",
    accentBg: "bg-telemetry/15",
    title: "Export",
    description:
      "Export your storyboard as a professional PDF — scene headers, shot metadata and frames, ready for a pitch or production review.",
    tag: "PDF export",
  },
];

const ROADMAP_CARDS = [
  {
    icon: Video,
    title: "Camera Motion Studio",
    description:
      "Direct physical camera moves — dolly, truck, crane, handheld — and turn still frames into animated previews.",
  },
  {
    icon: Mic,
    title: "Voiceover Scratch Tracks",
    description:
      "Generate timed scratch dialogue to test line pacing and scene tension before hiring voice talent.",
  },
  {
    icon: FileCode2,
    title: "Screenplay File Upload",
    description:
      "Drop in a Final Draft (.fdx) or Fountain screenplay and have it auto-split into scenes and shots.",
  },
];

const BUILT_FOR = [
  {
    title: "Independent Filmmakers",
    description: "Visualise a film before production — storyboard generation, shot planning, PDF export.",
  },
  {
    title: "Advertising Creatives",
    description: "Turn a campaign concept into something presentable to a client, fast.",
  },
  {
    title: "Content Creators",
    description: "Plan videos before filming — script-to-storyboard, shot lists, simple UX.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex-1 bg-void text-ink">
      <header className="sticky top-0 z-40 border-b border-studio-border bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-ink-dim lg:flex">
            <a href="#demo" className="hover:text-ink">
              Live Demo
            </a>
            <a href="#pipeline" className="hover:text-ink">
              How It Works
            </a>
            <a href="#features" className="hover:text-ink">
              Character Consistency
            </a>
            <a href="#roadmap" className="hover:text-ink">
              Roadmap
            </a>
            <a href="#pricing" className="hover:text-ink">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm text-ink-dim hover:text-ink sm:inline">
              Log in
            </Link>
            <Link href="/projects/new">
              <MarketingButton size="sm">Get Started</MarketingButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <StudioGrid />
        <Blob color="amber" className="-top-32 left-1/2 h-[340px] w-[720px] -translate-x-1/2" />
        <Blob color="cyan" className="top-1/3 -right-48 h-[450px] w-[450px]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-studio-border bg-elevated/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-tally shadow-[0_0_12px_rgba(245,158,11,0.18)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tally shadow-[0_0_8px_#f59e0b]" />
              AI Pre-Production Engine
              <span className="text-studio-border-strong">|</span>
              <span className="text-telemetry">Storyboard Generation Live</span>
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="font-display mx-auto mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Turn Ideas Into Professional{" "}
              <span className="bg-gradient-to-r from-tally via-tally to-telemetry bg-clip-text text-transparent">
                Storyboards
              </span>{" "}
              in Minutes.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-dim">
              Describe your story or paste a scene. StoryForge AI transforms it into a cinematic
              storyboard with shot planning and consistent characters — ready to edit, present and
              export.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/projects/new">
                <MarketingButton size="lg">Create Your First Storyboard</MarketingButton>
              </Link>
              <a href="#demo">
                <MarketingButton size="lg" variant="outline">
                  Interactive Preview
                </MarketingButton>
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-xs text-ink-dim">
              <span className="text-tally">✓</span>
              No credit card required · Export to PDF
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-80">
              <span className="text-sm text-ink-dim">
                Built for independent filmmakers, advertising creatives and content creators
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="border-t border-studio-border bg-base px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-telemetry shadow-[0_0_8px_#38bdf8]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-telemetry">
                  Sandbox preview
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Interactive Pre-Production Studio
              </h2>
            </div>
            <p className="max-w-sm text-xs text-ink-dim">
              Real scenes and frames from an actual StoryForge project. Switch scenes, click a
              frame to inspect its camera data.
            </p>
          </div>
          <FadeIn>
            <InteractiveDemo />
          </FadeIn>
        </div>
      </section>

      {/* 4-step pipeline */}
      <section id="pipeline" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-tally">
              Seamless production pipeline
            </span>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              From Idea to Screen-Ready in 4 Beats
            </h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map((item) => (
              <StaggerItem
                key={item.step}
                className="flex flex-col justify-between rounded-lg border border-studio-border bg-elevated p-6"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-studio-border-strong">
                      {item.step}
                    </span>
                    <div className={`flex h-10 w-10 items-center justify-center rounded ${item.accentBg}`}>
                      <item.icon className={`h-5 w-5 ${item.accent}`} />
                    </div>
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm text-ink-dim">{item.description}</p>
                </div>
                <p className={`mt-4 flex items-center gap-1 pt-3 font-mono text-[11px] ${item.accent}`}>
                  {item.tag}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Feature matrix */}
      <section id="features" className="border-t border-studio-border bg-base px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-tally">
                Production grade architecture
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Engineered for High-Pressure Sets
              </h2>
            </div>
            <p className="max-w-md text-sm text-ink-dim">
              The defensible product isn&rsquo;t the image model — it&rsquo;s the workflow, project
              context and consistency system built around it.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Large real card */}
            <FadeIn className="relative overflow-hidden rounded-xl bg-elevated p-6 shadow-xl md:col-span-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-tally shadow-[0_0_8px_#f59e0b]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-tally">
                  Available now
                </span>
              </div>
              <h3 className="mb-1.5 text-xl font-semibold text-ink">
                Persistent Character Consistency
              </h3>
              <p className="mb-5 max-w-lg text-sm text-ink-dim">
                The biggest flaw of generic AI image tools is that characters change between
                frames. StoryForge keeps a reusable character profile — name, appearance,
                clothing — and automatically folds it into the prompt for every shot that
                character appears in.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { src: "/marketing/character-ref-1.jpg", label: "Example reference sheet" },
                  { src: "/marketing/character-ref-2.jpg", label: "Example turnaround sheet" },
                ].map((ref) => (
                  <div key={ref.src} className="overflow-hidden rounded bg-base shadow">
                    <div className="relative aspect-square">
                      <Image src={ref.src} alt={ref.label} fill className="object-cover" />
                    </div>
                    <div className="px-2 py-1.5 text-center text-[11px] font-medium text-ink-dim">
                      {ref.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink-dim/70">
                Illustrative — a locked character profile (name, appearance, clothing) is what
                StoryForge actually reuses across shots.
              </p>
            </FadeIn>

            {/* Roadmap cards */}
            <Stagger className="flex flex-col gap-5">
              {ROADMAP_CARDS.slice(0, 1).map((card) => (
                <StaggerItem key={card.title} className="rounded-xl bg-elevated p-6 shadow-xl">
                  <RoadmapCardBody card={card} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Stagger id="roadmap" className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {ROADMAP_CARDS.slice(1).map((card) => (
              <StaggerItem key={card.title} className="rounded-xl bg-elevated p-6 shadow-xl">
                <RoadmapCardBody card={card} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-10 text-center">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-tally">
              Transparent usage economics
            </span>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Simple Plans For Visionaries of Every Scale
            </h2>
          </FadeIn>
          <PricingSection />
        </div>
      </section>

      {/* Built for */}
      <section id="built-for" className="border-t border-studio-border bg-base px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-telemetry">
              Who it&rsquo;s for
            </span>
            <h2 className="font-display mt-1 text-2xl font-semibold text-ink sm:text-3xl">
              Built For Visual Storytellers
            </h2>
          </FadeIn>
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {BUILT_FOR.map((persona) => (
              <StaggerItem
                key={persona.title}
                className="rounded-lg border border-studio-border bg-elevated p-6"
              >
                <h3 className="text-base font-semibold text-ink">{persona.title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{persona.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden px-6 py-24">
        <Blob color="amber" className="bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-2 inline-block h-2.5 w-2.5 animate-ping rounded-full bg-tally" />
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Bring Your Vision to Life Before Cameras Roll.
          </h2>
          <p className="mx-auto mb-10 mt-3 max-w-xl text-sm text-ink-dim">
            Stop agonising over blank pages. Turn narrative prose into a cinematic storyboard
            sequence right now.
          </p>
          <FadeIn>
            <PromptCTA />
          </FadeIn>
          <p className="mt-4 font-mono text-xs text-ink-dim">No credit card required · Free to start</p>
        </div>
      </section>

      <footer className="border-t border-studio-border px-6 pt-16 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-3 max-w-sm text-sm text-ink-dim">
                AI pre-production platform. Turn ideas into storyboards, consistent characters
                and professional exports.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                Solutions
              </h4>
              <ul className="space-y-2 text-sm text-ink-dim">
                <li>
                  <a href="#built-for" className="hover:text-ink">
                    Filmmakers
                  </a>
                </li>
                <li>
                  <a href="#built-for" className="hover:text-ink">
                    Advertising Agencies
                  </a>
                </li>
                <li>
                  <a href="#built-for" className="hover:text-ink">
                    YouTube &amp; Creators
                  </a>
                </li>
                <li>
                  <a href="#built-for" className="hover:text-ink">
                    Game Cinematics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                Platform &amp; Tools
              </h4>
              <ul className="space-y-2 text-sm text-ink-dim">
                <li>
                  <a href="#features" className="hover:text-ink">
                    Character Consistency
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="hover:text-ink">
                    Camera Motion Studio
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="hover:text-ink">
                    Screenplay Upload
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-ink">
                    Storyboard Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-ink-dim">
                <li>
                  <a href="#demo" className="hover:text-ink">
                    Live Interactive Demo
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-ink">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="hover:text-ink">
                    Roadmap
                  </a>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-ink">
                    Log in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-studio-border pt-6 sm:flex-row">
            <span className="text-xs text-ink-dim">© 2026 StoryForge AI. All rights reserved.</span>
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wide text-ink-dim">
              <span>AI Pre-Production Platform</span>
              <span className="text-studio-border-strong">•</span>
              <span>Built For Visual Storytellers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoadmapCardBody({
  card,
}: {
  card: { icon: React.ComponentType<{ className?: string }>; title: string; description: string };
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-anamorphic/15 text-anamorphic">
          <card.icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-studio-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-dim">
          Roadmap
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-ink">{card.title}</h3>
      <p className="text-sm text-ink-dim">{card.description}</p>
    </>
  );
}
