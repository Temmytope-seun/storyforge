import type { ProjectContext, SceneContext } from "./types";

export const STORY_ANALYSIS_SYSTEM_PROMPT = `You are a professional film/video pre-production assistant inside StoryForge AI, a storyboard generation platform. Given a creative idea, brief, or short script from a user, you break it down into a structured scene and shot breakdown suitable for a visual storyboard.

Guidelines:
- Infer genre and tone from the idea.
- Break the story into a sensible number of scenes (typically 2-6 for a short idea) based on distinct locations, time jumps, or narrative beats.
- Break each scene into 2-5 shots that would visually communicate that scene cinematically.
- Choose shot types, camera angles, lenses and camera movement like an experienced cinematographer (e.g. "Establishing Wide", "Medium Tracking", "Close-up", "Over-the-shoulder").
- Keep shot descriptions concrete and visual (what is seen in frame), not abstract.
- List every character that appears in a scene by name in characterNames, matching the top-level characters list exactly.
- Durations are in seconds and should be realistic for the shot type (2-6s per shot typically).
- You MUST call the submit_story_analysis tool exactly once with the complete breakdown. Do not respond in plain text.`;

export const storyAnalysisTool = {
  name: "submit_story_analysis",
  description:
    "Submit the structured scene and shot breakdown for the user's story idea.",
  input_schema: {
    type: "object" as const,
    properties: {
      genre: { type: "string" as const },
      tone: { type: "string" as const },
      characters: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            name: { type: "string" as const },
            description: { type: "string" as const },
          },
          required: ["name", "description"],
        },
      },
      scenes: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            sceneNumber: { type: "integer" as const },
            title: { type: "string" as const },
            location: { type: "string" as const },
            timeOfDay: { type: "string" as const },
            mood: { type: "string" as const },
            duration: { type: "integer" as const },
            characterNames: {
              type: "array" as const,
              items: { type: "string" as const },
            },
            shots: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  shotNumber: { type: "integer" as const },
                  shotType: { type: "string" as const },
                  cameraAngle: { type: "string" as const },
                  lens: { type: "string" as const },
                  movement: { type: "string" as const },
                  duration: { type: "integer" as const },
                  description: { type: "string" as const },
                  dialogue: { type: "string" as const },
                },
                required: ["shotNumber", "shotType", "description"],
              },
            },
          },
          required: [
            "sceneNumber",
            "title",
            "location",
            "characterNames",
            "shots",
          ],
        },
      },
    },
    required: ["characters", "scenes"],
  },
};

export const SCENE_REGENERATION_SYSTEM_PROMPT = `You are a professional film/video pre-production assistant inside StoryForge AI. You will be given project context and a single scene that needs its shot list regenerated (either because the user asked for a fresh take, or scene details changed). Produce a new, improved shot list for just this scene, following the same cinematic conventions as before (realistic shot types, camera angles, lenses, movement, and durations in seconds). You MUST call the submit_shots tool exactly once. Do not respond in plain text.`;

export const shotsTool = {
  name: "submit_shots",
  description: "Submit the regenerated shot list for the scene.",
  input_schema: {
    type: "object" as const,
    properties: {
      shots: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            shotNumber: { type: "integer" as const },
            shotType: { type: "string" as const },
            cameraAngle: { type: "string" as const },
            lens: { type: "string" as const },
            movement: { type: "string" as const },
            duration: { type: "integer" as const },
            description: { type: "string" as const },
            dialogue: { type: "string" as const },
          },
          required: ["shotNumber", "shotType", "description"],
        },
      },
    },
    required: ["shots"],
  },
};

export function buildAnalysisUserPrompt(
  idea: string,
  opts: { visualStyle: string; aspectRatio: string }
): string {
  return `Idea / brief:\n"""\n${idea}\n"""\n\nVisual style: ${opts.visualStyle}\nAspect ratio: ${opts.aspectRatio}\n\nProduce the full scene and shot breakdown now.`;
}

export function buildSceneRegenerationUserPrompt(
  scene: SceneContext,
  project: ProjectContext
): string {
  const characterLines = scene.characters
    .map((c) => `- ${c.name}: ${c.description}`)
    .join("\n");
  const currentShots = scene.existingShots
    .map(
      (s) =>
        `  ${s.shotNumber}. [${s.shotType}] ${s.description}${
          s.dialogue ? ` (dialogue: "${s.dialogue}")` : ""
        }`
    )
    .join("\n");

  return `Project: "${project.title}"
Overall idea: ${project.idea}
Visual style: ${project.visualStyle}
Aspect ratio: ${project.aspectRatio}
Genre: ${project.genre ?? "unspecified"}
Tone: ${project.tone ?? "unspecified"}

Scene to regenerate: "${scene.title}"
Location: ${scene.location}
Time of day: ${scene.timeOfDay ?? "unspecified"}
Mood: ${scene.mood ?? "unspecified"}
Target duration: ${scene.duration ?? "unspecified"} seconds

Characters in this scene:
${characterLines || "(none listed)"}

Current shot list (for reference, improve or replace it):
${currentShots || "(none yet)"}

Submit a new shot list for this scene now.`;
}

/** Builds the final image generation prompt for a single shot (PRD §22 "prompt orchestration layer"). */
export function buildFramePrompt(params: {
  visualStyle: string;
  sceneLocation: string;
  sceneTimeOfDay?: string | null;
  sceneMood?: string | null;
  characters: { name: string; description: string }[];
  shotType: string;
  cameraAngle?: string | null;
  lens?: string | null;
  movement?: string | null;
  description: string;
}): string {
  const {
    visualStyle,
    sceneLocation,
    sceneTimeOfDay,
    sceneMood,
    characters,
    shotType,
    cameraAngle,
    lens,
    movement,
    description,
  } = params;

  const characterText = characters.length
    ? `Characters in frame: ${characters
        .map((c) => `${c.name} (${c.description})`)
        .join("; ")}.`
    : "";

  const cameraText = [
    cameraAngle && `camera angle: ${cameraAngle}`,
    lens && `lens: ${lens}`,
    movement && `camera movement: ${movement}`,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `${visualStyle} style storyboard frame.`,
    `Setting: ${sceneLocation}${sceneTimeOfDay ? `, ${sceneTimeOfDay}` : ""}${
      sceneMood ? `, mood: ${sceneMood}` : ""
    }.`,
    characterText,
    `Shot type: ${shotType}.`,
    cameraText && `Camera: ${cameraText}.`,
    `Action: ${description}`,
    "Cinematic composition, professional pre-production storyboard illustration, no text, no watermarks, no captions.",
  ]
    .filter(Boolean)
    .join(" ");
}
