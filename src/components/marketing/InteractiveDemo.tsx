"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Film, FileText, Sparkles, ArrowRight } from "lucide-react";

// Real scenes/shots/generated images from an actual StoryForge project ("The Last Train").
const SCENES = {
  warningCall: {
    label: "The Warning Call",
    prompt:
      "INT. DANIEL'S APARTMENT - NIGHT - Tense, isolated, foreboding. Daniel, a software engineer, receives a chilling call from an unknown number late at night.",
    shots: [
      {
        shotNumber: 1,
        shotType: "Establishing Wide",
        cameraAngle: "High angle",
        lens: "35mm",
        movement: "Static",
        duration: 4,
        description:
          "Rain-streaked window with Manchester cityscape visible through it. Digital clock on bedside table reads 11:47 PM in foreground.",
        imageUrl: "/marketing/demo/warning-call-1.png",
      },
      {
        shotNumber: 2,
        shotType: "Medium Close-up",
        cameraAngle: "Eye level",
        lens: "50mm",
        movement: "Static",
        duration: 6,
        description:
          "Daniel sits at his desk bathed in blue laptop light, face exhausted, multiple empty coffee cups beside him.",
        imageUrl: "/marketing/demo/warning-call-2.png",
      },
      {
        shotNumber: 3,
        shotType: "Close-up",
        cameraAngle: "Top-down",
        lens: "85mm",
        movement: "Static",
        duration: 3,
        description: "Daniel's phone vibrates on the desk, screen displays UNKNOWN NUMBER.",
        imageUrl: "/marketing/demo/warning-call-3.png",
      },
      {
        shotNumber: 4,
        shotType: "Close-up",
        cameraAngle: "Eye level",
        lens: "85mm",
        movement: "Static",
        duration: 8,
        description:
          "Daniel's face as he holds phone to ear, confusion and concern building in his expression as he listens.",
        imageUrl: "/marketing/demo/warning-call-4.png",
      },
    ],
  },
  chase: {
    label: "The Chase",
    prompt:
      "EXT. MANCHESTER STREET - NIGHT - Urgent, disorienting, paranoid. Daniel bursts out into the rain-soaked street, running against a countdown he doesn't understand.",
    shots: [
      {
        shotNumber: 1,
        shotType: "Establishing Wide",
        cameraAngle: "High angle",
        lens: "35mm",
        movement: "Crane down",
        duration: 5,
        description:
          "Rain-soaked Manchester street, neon reflections in puddles. Daniel bursts from apartment building entrance and runs down the street.",
        imageUrl: "/marketing/demo/chase-1.png",
      },
      {
        shotNumber: 2,
        shotType: "Tracking Medium",
        cameraAngle: "Side tracking",
        lens: "50mm",
        movement: "Tracking/dolly",
        duration: 6,
        description:
          "Daniel running along wet sidewalk, cars splashing through puddles behind him. He pulls out phone while running.",
        imageUrl: "/marketing/demo/chase-2.png",
      },
      {
        shotNumber: 3,
        shotType: "Close-up Insert",
        cameraAngle: "Over shoulder",
        lens: "85mm",
        movement: "Handheld shake",
        duration: 3,
        description:
          "Phone screen in Daniel's hand shows 11:52 PM and notification: 12 MINUTES. Rain droplets hit the screen.",
        imageUrl: "/marketing/demo/chase-3.png",
      },
      {
        shotNumber: 4,
        shotType: "Medium",
        cameraAngle: "Eye level",
        lens: "50mm",
        movement: "Static",
        duration: 4,
        description:
          "Daniel stops abruptly, breathing heavily. He slowly looks around the empty street, uncertain and afraid.",
        imageUrl: "/marketing/demo/chase-4.png",
      },
    ],
  },
  lastTrain: {
    label: "The Last Train Arrives",
    prompt:
      "EXT./INT. TRAIN STATION PLATFORM 4 - NIGHT - Desperate, claustrophobic, fateful. Daniel sprints to catch the last train before the countdown reaches zero.",
    shots: [
      {
        shotNumber: 1,
        shotType: "Establishing Wide",
        cameraAngle: "High angle",
        lens: "35mm",
        movement: "Static",
        duration: 4,
        description:
          "Exterior of Manchester train station, rain falling. Daniel runs toward entrance. Wet pavement reflects station lights.",
        imageUrl: "/marketing/demo/last-train-1.png",
      },
      {
        shotNumber: 2,
        shotType: "Insert Close-up",
        cameraAngle: "Straight on",
        lens: "50mm",
        movement: "Static",
        duration: 3,
        description: "Electronic departure board: LAST TRAIN — 12:05 AM, PLATFORM 4.",
        imageUrl: "/marketing/demo/last-train-2.png",
      },
      {
        shotNumber: 3,
        shotType: "Close-up",
        cameraAngle: "Canted angle",
        lens: "85mm",
        movement: "Handheld",
        duration: 2,
        description: "Daniel's phone in his trembling hand: 11:59 PM.",
        imageUrl: "/marketing/demo/last-train-3.png",
      },
      {
        shotNumber: 4,
        shotType: "Tracking Wide",
        cameraAngle: "Side tracking",
        lens: "35mm",
        movement: "Fast tracking",
        duration: 4,
        description:
          "Daniel sprints down station stairs toward platform, camera tracks alongside him at high speed.",
        imageUrl: "/marketing/demo/last-train-4.png",
      },
    ],
  },
} as const;

type SceneKey = keyof typeof SCENES;
type Shot = (typeof SCENES)[SceneKey]["shots"][number];

const ACCENTS = ["text-tally", "text-telemetry", "text-anamorphic", "text-tally"];

export function InteractiveDemo() {
  const [sceneKey, setSceneKey] = useState<SceneKey>("warningCall");
  const scene = SCENES[sceneKey];
  const [prompt, setPrompt] = useState<string>(scene.prompt);
  const [selected, setSelected] = useState<Shot>(SCENES.warningCall.shots[0]);
  const [generating, setGenerating] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);

  function handleScene(key: SceneKey) {
    setSceneKey(key);
    setPrompt(SCENES[key].prompt);
    setSelected(SCENES[key].shots[0]);
  }

  function handleGenerate() {
    setGenerating(true);
    setJustGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setJustGenerated(true);
      setTimeout(() => setJustGenerated(false), 1500);
    }, 900);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-studio-border-strong bg-elevated shadow-2xl">
      {/* Workspace header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-studio-border bg-base px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-critical/40" />
            <span className="h-3 w-3 rounded-full bg-tally/40" />
            <span className="h-3 w-3 rounded-full bg-telemetry/40" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
            PROJECT: THE_LAST_TRAIN
          </span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="mr-1 hidden text-[11px] uppercase tracking-wide text-ink-dim sm:inline">
            Scenes:
          </span>
          {(Object.keys(SCENES) as SceneKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleScene(key)}
              className={`whitespace-nowrap rounded px-2.5 py-1 text-xs transition-colors ${
                sceneKey === key
                  ? "bg-tally font-medium text-tally-on"
                  : "bg-white/[0.04] text-ink-dim hover:text-ink"
              }`}
            >
              {SCENES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt control rack */}
      <div className="flex flex-col gap-3 border-b border-studio-border bg-elevated/60 p-4 backdrop-blur-md">
        <div className="flex flex-col items-stretch gap-2 md:flex-row">
          <div className="relative flex-grow">
            <FileText className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-ink-dim" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full resize-none rounded bg-base py-2.5 pl-10 pr-16 text-sm text-ink shadow-inner placeholder:text-ink-dim/50 focus:outline-none focus:ring-1 focus:ring-tally"
            />
            <div className="absolute bottom-2 right-2 font-mono text-[10px] text-ink-dim">
              {prompt.length}/500
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tally px-5 py-3 text-xs font-semibold uppercase tracking-wide text-tally-on shadow-[0_0_16px_rgba(245,158,11,0.3)] transition-all hover:bg-[#ffc174] disabled:opacity-70"
          >
            {generating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Synthesizing…
              </>
            ) : justGenerated ? (
              <>
                <Sparkles className="h-4 w-4" />
                Frames Ready
              </>
            ) : (
              <>
                <Film className="h-4 w-4" />
                Preview Generation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {scene.shots.map((shot, i) => (
          <button
            key={shot.shotNumber}
            onClick={() => setSelected(shot)}
            className={`group flex flex-col overflow-hidden rounded bg-base text-left shadow-lg transition-all ${
              selected.shotNumber === shot.shotNumber && selected.description === shot.description
                ? "ring-2 ring-tally"
                : "hover:ring-1 hover:ring-tally/60"
            }`}
          >
            <div className="relative aspect-[2.39/1] w-full overflow-hidden bg-base">
              <Image
                src={shot.imageUrl}
                alt={shot.description}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={`absolute left-2 top-2 flex items-center gap-1 rounded bg-void/70 px-1.5 py-0.5 font-mono text-[9px] ${ACCENTS[i]}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                SHOT {String(shot.shotNumber).padStart(2, "0")} · {shot.shotType.toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-void/70 px-1.5 py-0.5 font-mono text-[10px] text-ink">
                {shot.duration}s
              </div>
            </div>
            <div className="flex flex-col gap-1 bg-elevated p-2.5">
              <div className="flex items-center justify-between font-mono text-[11px] text-ink-dim">
                <span className="font-medium text-ink">Shot {shot.shotNumber}</span>
                <span className={ACCENTS[i]}>{shot.lens}</span>
              </div>
              <p className="line-clamp-2 text-xs text-ink-dim">{shot.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Inspector / telemetry bar */}
      <div className="flex flex-col items-start justify-between gap-3 border-t border-studio-border bg-base px-4 py-3 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1.5 text-tally">
            <Camera className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wide">Camera:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink-dim">
            <span>
              LENS: <span className="font-medium text-ink">{selected.lens}</span>
            </span>
            <span className="text-studio-border-strong">•</span>
            <span>
              ANGLE: <span className="font-medium text-ink">{selected.cameraAngle}</span>
            </span>
            <span className="text-studio-border-strong">•</span>
            <span>
              MOTION: <span className="font-medium text-telemetry">{selected.movement}</span>
            </span>
          </div>
        </div>
        <a
          href="#waitlist"
          className="flex items-center gap-1 rounded bg-tally px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-tally-on transition-colors hover:bg-[#ffc174]"
        >
          Get Early Access
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
