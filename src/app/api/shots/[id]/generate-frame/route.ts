import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getImageProvider } from "@/lib/ai/factory";
import { buildFramePrompt } from "@/lib/ai/prompts";
import { saveGeneratedImage } from "@/lib/storage/local";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  const shot = await db.shot.findUnique({
    where: { id },
    include: {
      scene: {
        include: { project: true, characters: true },
      },
    },
  });
  if (!shot) {
    return NextResponse.json({ error: "Shot not found" }, { status: 404 });
  }

  const frame = await db.frame.upsert({
    where: { shotId: shot.id },
    create: { shotId: shot.id, status: "PROCESSING" },
    update: { status: "PROCESSING", errorMessage: null },
  });

  const prompt = buildFramePrompt({
    visualStyle: shot.scene.project.visualStyle,
    sceneLocation: shot.scene.location,
    sceneTimeOfDay: shot.scene.timeOfDay,
    sceneMood: shot.scene.mood,
    characters: shot.scene.characters.map((c) => ({
      name: c.name,
      description: c.description,
    })),
    shotType: shot.shotType,
    cameraAngle: shot.cameraAngle,
    lens: shot.lens,
    movement: shot.movement,
    description: shot.description,
  });

  try {
    const imageProvider = getImageProvider();
    const { buffer } = await imageProvider.generateFrame(prompt, {
      aspectRatio: shot.scene.project.aspectRatio,
    });
    const imageUrl = await saveGeneratedImage(
      shot.scene.project.id,
      frame.id,
      buffer
    );

    const updated = await db.frame.update({
      where: { id: frame.id },
      data: {
        imageUrl,
        promptUsed: prompt,
        status: "COMPLETED",
        errorMessage: null,
      },
    });

    await db.project.update({
      where: { id: shot.scene.project.id },
      data: { status: "STORYBOARDED" },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Frame generation failed";
    const failed = await db.frame.update({
      where: { id: frame.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return NextResponse.json({ error: message, frame: failed }, { status: 502 });
  }
}
