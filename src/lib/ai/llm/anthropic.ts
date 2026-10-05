import Anthropic from "@anthropic-ai/sdk";
import {
  buildAnalysisUserPrompt,
  buildSceneRegenerationUserPrompt,
  STORY_ANALYSIS_SYSTEM_PROMPT,
  SCENE_REGENERATION_SYSTEM_PROMPT,
  storyAnalysisTool,
  shotsTool,
} from "../prompts";
import { scenePlanSchema, shotPlanListSchema, storyAnalysisSchema } from "@/lib/validation";
import type {
  GenerationOptions,
  LLMProvider,
  ProjectContext,
  SceneContext,
  ShotPlan,
  StoryAnalysis,
} from "../types";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env before running AI analysis."
    );
  }
  return new Anthropic({ apiKey });
}

function extractToolInput(
  message: Anthropic.Messages.Message,
  toolName: string
): unknown {
  const block = message.content.find(
    (c): c is Anthropic.Messages.ToolUseBlock =>
      c.type === "tool_use" && c.name === toolName
  );
  if (!block) {
    throw new Error(
      `Claude did not call the expected "${toolName}" tool. Stop reason: ${message.stop_reason}`
    );
  }
  return block.input;
}

export class AnthropicLLMProvider implements LLMProvider {
  private model: string;

  constructor() {
    this.model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
  }

  async analyzeStory(
    idea: string,
    opts: GenerationOptions
  ): Promise<StoryAnalysis> {
    const client = getClient();

    const message = await client.messages.create({
      model: this.model,
      max_tokens: 8000,
      system: STORY_ANALYSIS_SYSTEM_PROMPT,
      tools: [storyAnalysisTool],
      tool_choice: { type: "tool", name: storyAnalysisTool.name },
      messages: [
        {
          role: "user",
          content: buildAnalysisUserPrompt(idea, opts),
        },
      ],
    });

    const raw = extractToolInput(message, storyAnalysisTool.name);
    const parsed = storyAnalysisSchema.parse(raw);
    return parsed;
  }

  async regenerateScene(
    scene: SceneContext,
    project: ProjectContext
  ): Promise<ShotPlan[]> {
    const client = getClient();

    const message = await client.messages.create({
      model: this.model,
      max_tokens: 4000,
      system: SCENE_REGENERATION_SYSTEM_PROMPT,
      tools: [shotsTool],
      tool_choice: { type: "tool", name: shotsTool.name },
      messages: [
        {
          role: "user",
          content: buildSceneRegenerationUserPrompt(scene, project),
        },
      ],
    });

    const raw = extractToolInput(message, shotsTool.name);
    const parsed = shotPlanListSchema.parse(raw);
    return parsed.shots;
  }
}

// Re-exported for any call site that wants to validate a single scene shape
// (e.g. when persisting partial results).
export { scenePlanSchema };
