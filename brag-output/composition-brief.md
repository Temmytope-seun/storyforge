# Hyperframes Composition Brief: StoryForge AI

## Objective
Create a short launch-style brag video for StoryForge AI.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 19.5 seconds (15-25s window)

## Source Material
- Project root: `C:\Users\temmy\OneDrive\Desktop\mlUdemy\storyforge`
- Primary files read: `src/app/page.tsx`, `src/components/marketing/InteractiveDemo.tsx`, `src/components/storyboard/BriefEntryView.tsx`, `src/components/storyboard/ProjectWorkspace.tsx`, `src/components/storyboard/FrameCard.tsx`, `src/components/storyboard/GenerateProgress.tsx`, `src/app/dashboard/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/marketing/Logo.tsx`, `README.md`
- Product name: StoryForge AI
- Tagline / strongest claim: "Turn Ideas Into Professional Storyboards in Minutes." Secondary claim actually stated in the UI: "The biggest flaw of generic AI image tools is that characters change between frames. StoryForge keeps a reusable character profile... and automatically folds it into the prompt for every shot that character appears in."
- Key UI or visual moment to recreate: the landing page's `InteractiveDemo` component — a dark studio UI with scene tabs, a prompt textarea, a frame grid of real generated images tagged with real camera telemetry (`SHOT 01 · ESTABLISHING WIDE`, `LENS: 35mm`, `ANGLE: High angle`, `MOTION: Crane down`), mirrored by the real app's `BriefEntryView` (idea textarea → "Generate Storyboard" → progress copy) and `FrameCard` (shot card with camera data, Regenerate/Duplicate/Delete). Also recreate the "Export PDF" button from `ProjectWorkspace` and the `Logo`/`LogoMark` for the outro.
- Copy that must appear verbatim:
  - "Daniel, a software engineer, receives a chilling call from an unknown number late at night." (from `InteractiveDemo.tsx` SCENES.warningCall.prompt)
  - "Generate Storyboard" (button label, `BriefEntryView.tsx`)
  - "Analysing story…" / "Planning shots and camera coverage…" (progress messages, `BriefEntryView.tsx`)
  - "SHOT 01 · ESTABLISHING WIDE" style camera tags and "LENS: 35mm" / "ANGLE: High angle" / "MOTION: Crane down" (real values from `InteractiveDemo.tsx` SCENES.warningCall.shots / SCENES.chase.shots)
  - "Export PDF" (button label, `ProjectWorkspace.tsx`)
  - "StoryForge AI" and "Turn ideas into professional storyboards in minutes." (`Logo.tsx`, `layout.tsx` metadata description)

## Creative Direction
- Tone preset: cinematic
- Creative direction: play as a teaser trailer for the in-universe thriller ("The Last Train") that hard-cuts into a reveal that it's pre-production software. Restrained, confident, no jokes at the product's expense.
- Interpretation: wide, dramatic holds on the generated art; big, minimal type; let the illustrated frames carry the emotional weight. The product's own output is cinematic enough that this should feel like a trailer, not an ad.
- Angle: StoryForge's own marketing demo already contains the best proof available — a real generated project, "The Last Train," with genuinely cinematic noir-illustrated frames. Open on that world as if it's a real movie trailer, then pull back the curtain: the whole sequence — shots, camera lenses, one consistent lead character — came from a single typed sentence inside StoryForge's dark studio UI.
- Hook: cold open, full-bleed, no UI chrome — the real generated frame of Daniel at his desk, rain on the window, city behind him. A small mono-caps caption burns in: "11:47 PM · UNKNOWN NUMBER."
- Outro / punchline: Export PDF clicked → crossfade to the StoryForge wordmark on void-black with the real tagline "Turn ideas into professional storyboards in minutes." Hold.
- Avoid:
  - Generic SaaS language ("streamline your workflow" etc. — never used; all copy above is verbatim/real)
  - Abstract filler visuals / generic motion graphics
  - Unrelated visual redesign — use the project's actual obsidian/amber studio palette and mono-caps camera-telemetry styling, not an invented UI skin
  - Lingering on or zooming into the close-up departure-board insert frame (`cmuu3qhb8004j4gvnog6n4k81.png`) — its on-image signage text renders garbled under AI generation. Use the station establishing-wide (`cmuu3qgvx004i4gvnanpkb2gp.png`) or sprinting-down-stairs tracking-wide (`cmuu3qjac004m4gvnfktc0yq9.png`) frames instead.

## Visual Identity
- Background: `#07090e` (void, deepest), `#0d1117` (base), `#131923` (elevated panel)
- Text: `#dfe2eb` (ink) primary, `#8b92a3` (ink-dim) secondary/labels
- Accent: `#f59e0b` (amber "tally" — primary CTA/highlight color), `#38bdf8` (cyan "telemetry" — data readouts), `#6366f1` (indigo "anamorphic" — used sparingly)
- Display font: Inter (headings / display copy) — fallback: any clean geometric sans if Inter unavailable
- Body font: Geist Sans (UI copy) — fallback: system sans
- Mono font (for camera telemetry / shot tags): Geist Mono — fallback: any monospace
- Visual references from the project:
  - `public/generated/cmuu1rncp001y4gvnzav773e3/*.png` — real generated storyboard frames for "The Last Train" project. The authoritative map of which file is which shot (shot type, camera angle, lens, movement, duration, description) is the `SCENES` object in `src/components/marketing/InteractiveDemo.tsx`. Recommended frames for this video (all verified clean, no garbled on-image text):
    - `cmuu3q5vp00424gvnfm9kio1x.png` — Daniel at his desk, rain-streaked window (hook + Scene 2/3 material)
    - `cmuu3q8br00434gvnwm7xj0vh.png` — close-up, Daniel on the phone, concern building
    - `cmuu3qa6500474gvn9lhv5qth.png` — establishing wide, Daniel bursts onto rain-soaked street
    - `cmuu3qadp00484gvnluyrxya4.png` — tracking medium, Daniel running along wet sidewalk
    - `cmuu3qc68004a4gvn1oowmvoe.png` — medium, Daniel stops abruptly, looks around
    - `cmuu3qgvx004i4gvnanpkb2gp.png` — establishing wide, Manchester train station exterior in rain
    - `cmuu3qjac004m4gvnfktc0yq9.png` — tracking wide, Daniel sprinting down station stairs
  - The real UI chrome to echo: dark header bar with traffic-light dots, "PROJECT: THE_LAST_TRAIN" mono label, scene tabs, prompt textarea with character counter, amber primary button, frame grid with mono-caps camera tags overlaid bottom/top of each image, bottom telemetry bar reading `LENS: / ANGLE: / MOTION:` in mono type
  - The `LogoMark` concept: three stacked rounded bars (amber-to-orange gradient) suggesting film frames — recreate simply, do not need the exact SVG

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract (full scene-by-scene detail, including sequential reveals and audio-coupled moments). Summary:

1. **Cold Open** — 3s — Full-bleed real frame (Daniel, desk, rain window), caption "11:47 PM · UNKNOWN NUMBER" burns in and holds. No UI.
2. **The Reveal** — 3.5s — Hard cut to the real brief-entry UI; the real demo sentence types in character-by-character; click "Generate Storyboard"; progress copy flashes briefly.
3. **The Shot Grid** — 5s — Real frame-grid UI; 3-4 real frames snap in one by one, each with its real mono-caps camera telemetry tag; hold the full set.
4. **Character Consistency** — 4.5s — 2-3 real frames of Daniel in sequence (desk → street → platform/stairs); amber mono-caps callout "SAME CHARACTER. EVERY SHOT." lands and holds.
5. **Export & Outro** — 3.5s — Click "Export PDF"; crossfade to StoryForge wordmark + real tagline on void-black; hold.

## Audio
- Audio role: cinematic support
- Audio arc: near-silent/still under the cold open → bed enters at the Scene 1→2 cut and stays steady/clean through the shot-grid and consistency beats → one resonant bell hit on the logo slam → clean fade-out
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (copied into `brag-output/composition/assets/music/`)
- Music treatment: near-silent/very low (~0.05-0.08) under Scene 1; lift to ~0.3 at the Scene 2 cut; sustain through Scenes 3-4; slight swell into Scene 5; fade out after the logo hold
- Music cue guidance: bundled preset at `<hyperframes-skill-dir>/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.{md,json}` (tempo 109.96 BPM). Suggested strong-cue locks for this 19.5s cut (±0.15s tolerance, treat as hints not requirements):
  - ~8.74s (strength 0.99, strong_beat) — third storyboard frame snaps into the shot grid
  - ~13.11s (strength 0.98, strong_beat) — "SAME CHARACTER. EVERY SHOT." callout lands
  - ~18.56s (strength 0.99, strong_beat) — logo/wordmark slam at the outro
  Smaller sequential entrances (typing, card arrivals) may nudge toward nearby beat-grid points (±0.10s) but never at the cost of hook readability.
- Audio-reactive treatment: subtle — let the rain-window glow / amber UI accents breathe slightly with music RMS during Scenes 3-4 only. No waveform/equalizer visuals. No reactivity during Scene 1 (should feel still, not musical).
- Audio-coupled moments:
  - Scene 2 — the demo sentence types in character-by-character — randomized `keyboard/keypress-*.wav` ticks, then a click sound on "Generate Storyboard"
  - Scene 3 — shot cards snap into the grid one by one — card-arrival sound, accent the first and third card only (not every card)
  - Scene 4 — "SAME CHARACTER. EVERY SHOT." callout lands — one `impact/impactSoft_medium_*` hit
  - Scene 5 — click on "Export PDF" (`ui/mouseclick1` or similar), then logo slam (`impact/impactBell_heavy_000` or `_004`)
- SFX selection guidance: match the real gesture being simulated (typing, button click, card landing, bell for the final payoff); keep it restrained per the `cinematic` tone (2-3 big hits plus a couple of small interface accents) — do not stack SFX or add comedic/glitch sounds
- SFX analysis guidance: read `<hyperframes-skill-dir>/assets/sfx/sfx-analysis.md`; prefer low/medium high-frequency-risk files for the repeated typing ticks and card sounds; the bell hit for the logo slam can tolerate more character since it's a single isolated moment
- Exact SFX choice: Hyperframes should choose exact filenames, timestamps, density, and volume based on the implemented animation
- Audio files: copy the chosen music (done) and any Hyperframes-selected SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). `/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (the brief above gives several; use the real generated frames as the centerpiece).
- Keep all text readable in the final render (respect the reading-time floors noted in `brag-plan.md`).
- Keep the video within 15-25 seconds (target 19.5s).
- Include the planned music/SFX layer — audio was not disabled by the user.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks (3 suggested above) unless the edit clearly benefits from more.
- Use SFX to support motion and interaction: card sounds for card-like reveals, a short announcement cue for the major payoff (logo slam), key/click sounds for the typing and button-click moments, and restraint elsewhere.
- Honor the planned music treatment (near-silent cold open, lift at the reveal cut, fade after the logo hold) using the best Hyperframes-supported implementation.
- When music is present, use the Hyperframes audio-reactive workflow for a subtle effect (rain-window glow / amber accent breathing with RMS in Scenes 3-4 only). Avoid waveform/equalizer visuals, musical-note graphics, generic particle systems, strobing, or heavy pulsing.
- Use local assets (the real PNGs under `public/generated/...`, copied into the composition's own assets as needed) for all visuals — do not invent stock imagery.
- Run `npx hyperframes check` before render — it is brag's single gate.
- Keep creation and rendering local. Remote or publishing workflows require a separate explicit user request.
