import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLLMProvider } from "@/lib/ai/factory";
import { sceneInclude } from "@/lib/types";

export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  const scene = await db.scene.findUnique({
    where: { id },
    include: sceneInclude,
  });
  if (!scene) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  let newShots;
  try {
    const llm = getLLMProvider();
    newShots = await llm.regenerateScene(
      {
        title: scene.title,
        location: scene.location,
        timeOfDay: scene.timeOfDay,
        mood: scene.mood,
        duration: scene.duration,
        characters: scene.characters.map((c) => ({
          name: c.name,
          description: c.description,
        })),
        existingShots: scene.shots.map((s) => ({
          shotNumber: s.shotNumber,
          shotType: s.shotType,
          cameraAngle: s.cameraAngle ?? undefined,
          lens: s.lens ?? undefined,
          movement: s.movement ?? undefined,
          duration: s.duration ?? undefined,
          description: s.description,
          dialogue: s.dialogue ?? undefined,
        })),
      },
      {
        title: scene.project.title,
        idea: scene.project.idea,
        visualStyle: scene.project.visualStyle,
        aspectRatio: scene.project.aspectRatio,
        genre: scene.project.genre,
        tone: scene.project.tone,
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scene regeneration failed" },
      { status: 502 }
    );
  }

  await db.$transaction(async (tx) => {
    await tx.shot.deleteMany({ where: { sceneId: id } });
    for (const [index, shot] of newShots.entries()) {
      await tx.shot.create({
        data: {
          sceneId: id,
          shotNumber: shot.shotNumber,
          shotType: shot.shotType,
          cameraAngle: shot.cameraAngle,
          lens: shot.lens,
          movement: shot.movement,
          duration: shot.duration,
          description: shot.description,
          dialogue: shot.dialogue,
          order: index,
        },
      });
    }
  });

  const updated = await db.scene.findUnique({
    where: { id },
    include: {
      characters: true,
      shots: { orderBy: { order: "asc" }, include: { frame: true } },
    },
  });

  return NextResponse.json(updated);
}
