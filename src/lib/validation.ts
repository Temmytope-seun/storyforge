import { z } from "zod";

export const shotPlanSchema = z.object({
  shotNumber: z.number().int().positive(),
  shotType: z.string().min(1),
  cameraAngle: z.string().optional(),
  lens: z.string().optional(),
  movement: z.string().optional(),
  duration: z.number().int().positive().optional(),
  description: z.string().min(1),
  dialogue: z.string().optional(),
});

export const scenePlanSchema = z.object({
  sceneNumber: z.number().int().positive(),
  title: z.string().min(1),
  location: z.string().min(1),
  timeOfDay: z.string().optional(),
  mood: z.string().optional(),
  duration: z.number().int().positive().optional(),
  characterNames: z.array(z.string()).default([]),
  shots: z.array(shotPlanSchema).min(1),
});

export const characterPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const storyAnalysisSchema = z.object({
  genre: z.string().optional(),
  tone: z.string().optional(),
  characters: z.array(characterPlanSchema).default([]),
  scenes: z.array(scenePlanSchema).min(1),
});

export const shotPlanListSchema = z.object({
  shots: z.array(shotPlanSchema).min(1),
});

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  idea: z.string().min(10).max(5000),
  visualStyle: z.string().min(1).default("Cinematic"),
  aspectRatio: z.string().min(1).default("16:9"),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  idea: z.string().min(10).max(5000).optional(),
  visualStyle: z.string().min(1).optional(),
  aspectRatio: z.string().min(1).optional(),
  genre: z.string().optional(),
  tone: z.string().optional(),
});

export const updateSceneSchema = z.object({
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  timeOfDay: z.string().nullable().optional(),
  mood: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  order: z.number().int().optional(),
  characterIds: z.array(z.string()).optional(),
});

export const updateShotSchema = z.object({
  shotType: z.string().min(1).optional(),
  cameraAngle: z.string().nullable().optional(),
  lens: z.string().nullable().optional(),
  movement: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  description: z.string().min(1).optional(),
  dialogue: z.string().nullable().optional(),
  order: z.number().int().optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
});

export const createCharacterSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
});

export const updateCharacterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
});
