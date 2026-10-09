# Brag Plan: StoryForge AI

## What is this app?
StoryForge AI turns a single typed idea into a cinematic storyboard — an AI (Claude) breaks it into scenes and shots with real camera data (lens, angle, movement), generates moody graphic-novel-style frames for each shot, keeps the same character consistent across every frame, and exports a production-ready PDF.

## The angle
The product's own marketing demo already contains the best possible proof: a real generated project called "The Last Train" — a software engineer gets a midnight call from an unknown number and has to sprint through rain-soaked streets to catch the last train out of the city. The generated frames are genuinely cinematic, noir-illustrated, graphic-novel panels — not generic AI-art mush. The video treats this like a trailer for the thriller itself, then pulls back the curtain: this entire sequence — shots, camera lenses, a consistent lead character across every frame — came from one typed sentence inside a dark, developer-tool-grade studio UI.

## Hook (first 2-3 seconds)
Cold open, full-bleed, no UI chrome: the actual generated frame of Daniel at his desk, rain streaking the window behind him, city lights below. A single caption burns in at the bottom like a thriller's time-stamp: "11:47 PM. Unknown number." This has to read as a real movie moment before the viewer has any idea it's software.

## Key moments (the middle)
- The hard-cut reveal: this is StoryForge's actual idea-entry screen, with the real project line typed into the brief field — "Daniel, a software engineer, receives a chilling call from an unknown number late at night." — then a click on "Generate Storyboard."
- The shot grid populating: real frames from the same project snapping into place one by one, each tagged with its real camera telemetry in mono type — SHOT 01 · ESTABLISHING WIDE, LENS: 35mm, ANGLE: High angle, MOTION: Crane down — exactly as the app's own interactive demo displays it.
- Character consistency called out across frames: Daniel's face/silhouette recurring — desk, street, platform — with a short amber-tagged callout: "Same character. Every shot." This is the product's stated biggest differentiator, shown rather than claimed.

## Outro / punchline
Export PDF clicked → a document icon affirms the output is real and shippable → cut to the StoryForge wordmark on void-black with the real tagline: "Turn ideas into professional storyboards in minutes." Hold on the logo.

## User flow worth showing
Entry → key action → result, pulled straight from the real app (`BriefEntryView` → `ProjectWorkspace`/`FrameGrid`, mirrored in the landing page's `InteractiveDemo`):
1. **Entry:** user types/has typed an idea into the brief textarea.
2. **Key action:** clicks "Generate Storyboard"; real progress copy plays ("Analysing story… Identifying characters and locations… Planning shots and camera coverage…").
3. **Result:** scene/shot grid fills with real generated frames, each carrying real shot metadata (shot type, camera angle, lens, movement, duration) — then Export PDF.

## Tone
- Preset: cinematic
- Creative direction: play it as a teaser trailer for the in-universe thriller ("The Last Train") that hard-cuts into a reveal that it's pre-production software — restrained, confident, zero jokes at the product's expense.
- Interpretation: wide, dramatic holds on the generated art; big, minimal type; let the illustrated frames carry the emotional weight. No comic exaggeration — the product's own output is cinematic enough that the video should feel like a trailer, not an ad.

## Format: landscape — 1920x1080
## Duration: 19.5s

## Visual identity (from the project)
- Background: `#07090e` (void) / `#0d1117` (base) / `#131923` (elevated panels)
- Accent (primary): `#f59e0b` ("tally" amber — buttons, active states, camera-data highlights)
- Accent (secondary): `#38bdf8` ("telemetry" cyan — lens/data readouts), `#6366f1` ("anamorphic" indigo, used sparingly)
- Text: `#dfe2eb` (ink) on dark; dim labels `#8b92a3` (ink-dim)
- Display font: Inter (headings, `font-display`)
- Body/UI font: Geist Sans
- Mono font: Geist Mono — used in the real UI for shot tags and camera telemetry (`SHOT 01 · ESTABLISHING WIDE`, `LENS: 35mm`, `ANGLE: High angle`), reuse this exact mono-caps style for on-screen data in the video
- Strongest visual element: the real generated storyboard frames for project "The Last Train" at `public/generated/cmuu1rncp001y4gvnzav773e3/` (also embedded directly in `src/components/marketing/InteractiveDemo.tsx`'s `SCENES` object, which is the authoritative map of which image file goes with which shot/camera metadata) — moody rain-noir, graphic-novel illustration style, genuinely strong on their own
- Asset caution: skip or only flash-cut the close-up departure-board insert frame (`cmuu3qhb8004j4gvnog6n4k81.png`) — its on-image signage text renders garbled under AI generation. Use the station establishing-wide or sprinting-down-stairs frames instead; neither has readable broken text.

## Share copy (draft)
Typed one sentence about a guy who misses his train. Got back a full noir thriller storyboard — shots, lenses, a consistent lead character — before I finished my coffee. StoryForge AI.

## Audio direction
- Role: cinematic support — a steady, clean bed under dramatic, mostly-silent visual beats, with sound doing the work at hard cuts and reveals rather than running continuously loud
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (steady/clean, recommended for `cinematic`; ~110 BPM)
- Music treatment: start near-silent/very low under the cold-open hook (let the rain/mood carry it), lift to normal bed volume (~0.3) at the reveal cut, sustain through the shot-grid and consistency beats, swell slightly into the outro, fade out after the logo hold
- Music cue guidance: preset read from `happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.md` (tempo 109.96 BPM). Three strong-cue locks for this 19.5s cut:
  - ~8.74s (strength 0.99) — third storyboard frame snaps into the shot grid (Scene 3)
  - ~13.11s (strength 0.98) — "Same character. Every shot." callout lands (Scene 4 open)
  - ~18.56s (strength 0.99) — logo/wordmark slam at the outro (Scene 5)
  Smaller entrances may nudge toward nearby beat-grid points (±0.10s) but never at the cost of the hook's readability.
- Audio-reactive treatment: subtle — let the rain-window glow / amber UI accents breathe slightly with music RMS during the shot-grid and consistency scenes only. No waveform/equalizer visuals, no reactivity during the cold-open hook (that scene should feel still and cinematic, not musical).
- SFX posture: restrained, 2-3 big ones (per cinematic guidance) plus a couple of small interface accents tied to the real UI actions being simulated
- Audio-coupled moments:
  - Click on "Generate Storyboard" → `interface/click` or `ui/mouseclick1`
  - Each shot card snapping into the grid → `casino/card-place-*` (first and third card accented, not every card)
  - "Same character" callout landing → `impact/impactSoft_medium_*`
  - Export/PDF beat and logo slam → `impact/impactBell_heavy_000` or `_004`
- Restraint rule: nothing plays over the cold-open hook loud enough to compete with the rain/mood; no comedic or glitchy SFX anywhere — this isn't a parody tone.

## Storyboard

### Scene 1 — Cold Open — 3s
Full-bleed real generated frame: Daniel at his desk, rain-streaked window, city lights behind. No UI chrome, no logo yet. A small mono-caps caption burns in bottom-left at 0.4s: "11:47 PM · UNKNOWN NUMBER" and holds to the end of the scene (floor ~1.2s met easily at 2.6s hold).
Sequential/interaction: none
Audio intent: still, tense, almost no music — let a low ambient/rain-adjacent quiet carry it
Audio-coupled idea: none
Transition mood: dramatic wipe/hard cut → Scene 2

### Scene 2 — The Reveal — 3.5s
Hard cut to the real brief-entry UI (dark void background, "Idea / brief" label, textarea). The real demo line types in character-by-character: "Daniel, a software engineer, receives a chilling call from an unknown number late at night." Settle 1s, then cursor clicks "Generate Storyboard." Real progress line appears briefly: "Analysing story… Planning shots and camera coverage…"
Sequential/interaction: yes — the sentence types in character-by-character (keyboard ticks), then a simulated click on the Generate button
Audio intent: music lifts in here — the bed enters at this cut, giving the reveal its own identity distinct from Scene 1's stillness
Audio-coupled idea: typed text with randomized `keyboard/keypress-*` ticks; click sound on the Generate button
Transition mood: clean wipe → Scene 3

### Scene 3 — The Shot Grid — 5s
The real frame-grid UI: shot cards snap in one by one, each showing a real generated frame from "The Last Train" with its real mono-caps telemetry tag (SHOT 01 · ESTABLISHING WIDE / LENS: 35mm / ANGLE: High angle / MOTION: Crane down, etc. — pulled from the actual shot data). 3-4 cards total, arriving in quick succession then holding together as a set for readability.
Sequential/interaction: yes — shot cards arrive one by one (card-place sound on 1st and 3rd), camera telemetry text appears with each card
Audio intent: driving but not busy — this is the "wow, it's really doing this" beat
Audio-coupled idea: card arrival sounds (accent first + third card only); strong-cue lock for the third card at ~8.74s
Transition mood: clean wipe → Scene 4

### Scene 4 — Character Consistency — 4.5s
Two or three of the real frames showing Daniel sit side by side or cross-fade in sequence (desk → street → platform), with a short amber mono-caps callout sliding in: "SAME CHARACTER. EVERY SHOT." Hold the full line for readability (~1.6s+ settled).
Sequential/interaction: yes — frames arrive in quick sequence before the callout locks in
Audio intent: confident payoff of the product's core claim — one clear accent, not a flourish
Audio-coupled idea: `impact/impactSoft_medium_*` right as the callout text lands; strong-cue lock at ~13.11s
Transition mood: soft crossfade → Scene 5

### Scene 5 — Export & Outro — 3.5s
Cut to "Export PDF" button, simulated click, a document/PDF affordance confirms briefly — then crossfade to the StoryForge wordmark (amber-to-orange mark + "StoryForge AI" in Inter) centered on void-black, with the real tagline beneath: "Turn ideas into professional storyboards in minutes." Hold on logo to the end.
Sequential/interaction: yes — click on Export PDF, then logo lock-in
Audio intent: one clean, resonant hit on the logo slam, then music fades under the hold
Audio-coupled idea: `ui/mouseclick1` on Export; `impact/impactBell_heavy_000` or `_004` on the logo slam, strong-cue lock at ~18.56s; music fades out after
Transition mood: — (final scene)

**Music mood for this video:** cinematic
**Audio summary:** Near-silence under a still, moody cold open; the bed enters at the reveal cut and stays steady and clean through the shot-grid and consistency beats with three restrained strong-cue-locked accents; one resonant bell hit on the logo slam, then a clean fade-out.
