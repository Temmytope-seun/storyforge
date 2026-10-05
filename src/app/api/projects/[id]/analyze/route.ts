import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLLMProvider } from "@/lib/ai/factory";
import { projectInclude } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  let analysis;
  try {
    const llm = getLLMProvider();
    analysis = await llm.analyzeStory(project.idea, {
      visualStyle: project.visualStyle,
      aspectRatio: project.aspectRatio,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 502 }
    );
  }

  const updated = await db.$transaction(async (tx) => {
    // Re-running analyze replaces any previous breakdown for this project.
    await tx.scene.deleteMany({ where: { projectId: id } });
    await tx.character.deleteMany({ where: { projectId: id } });

    const characterIdByName = new Map<string, string>();
    for (const character of analysis.characters) {
      const created = await tx.character.create({
        data: {
          projectId: id,
          name: character.name,
          description: character.description,
        },
      });
      characterIdByName.set(character.name, created.id);
    }

    for (const [sceneIndex, scenePlan] of analysis.scenes.entries()) {
      const connectIds = scenePlan.characterNames
        .map((name) => characterIdByName.get(name))
        .filter((v): v is string => Boolean(v));

      await tx.scene.create({
        data: {
          projectId: id,
          sceneNumber: scenePlan.sceneNumber,
          title: scenePlan.title,
          location: scenePlan.location,
          timeOfDay: scenePlan.timeOfDay,
          mood: scenePlan.mood,
          duration: scenePlan.duration,
          order: sceneIndex,
          characters: { connect: connectIds.map((cid) => ({ id: cid })) },
          shots: {
            create: scenePlan.shots.map((shot, shotIndex) => ({
              shotNumber: shot.shotNumber,
              shotType: shot.shotType,
              cameraAngle: shot.cameraAngle,
              lens: shot.lens,
              movement: shot.movement,
              duration: shot.duration,
              description: shot.description,
              dialogue: shot.dialogue,
              order: shotIndex,
            })),
          },
        },
      });
    }

    await tx.project.update({
      where: { id },
      data: {
        status: "ANALYZED",
        genre: analysis.genre,
        tone: analysis.tone,
      },
    });

    return tx.project.findUnique({ where: { id }, include: projectInclude });
  });

  return NextResponse.json(updated);
}
