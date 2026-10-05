export interface ShotPlan {
  shotNumber: number;
  shotType: string;
  cameraAngle?: string;
  lens?: string;
  movement?: string;
  duration?: number;
  description: string;
  dialogue?: string;
}

export interface ScenePlan {
  sceneNumber: number;
  title: string;
  location: string;
  timeOfDay?: string;
  mood?: string;
  duration?: number;
  characterNames: string[];
  shots: ShotPlan[];
}

export interface CharacterPlan {
  name: string;
  description: string;
}

export interface StoryAnalysis {
  genre?: string;
  tone?: string;
  characters: CharacterPlan[];
  scenes: ScenePlan[];
}

export interface GenerationOptions {
  visualStyle: string;
  aspectRatio: string;
}

export interface SceneContext {
  title: string;
  location: string;
  timeOfDay?: string | null;
  mood?: string | null;
  duration?: number | null;
  characters: CharacterPlan[];
  existingShots: ShotPlan[];
}

export interface ProjectContext {
  title: string;
  idea: string;
  visualStyle: string;
  aspectRatio: string;
  genre?: string | null;
  tone?: string | null;
}

export interface LLMProvider {
  analyzeStory(idea: string, opts: GenerationOptions): Promise<StoryAnalysis>;
  regenerateScene(
    scene: SceneContext,
    project: ProjectContext
  ): Promise<ShotPlan[]>;
}

export interface GeneratedImage {
  buffer: Buffer;
  mimeType: string;
}

export interface ImageGenerationProvider {
  generateFrame(
    prompt: string,
    opts: { aspectRatio: string }
  ): Promise<GeneratedImage>;
}
