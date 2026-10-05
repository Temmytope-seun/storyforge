import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  const shot = await db.shot.findUnique({ where: { id } });
  if (!shot) {
    return NextResponse.json({ error: "Shot not found" }, { status: 404 });
  }

  const siblings = await db.shot.findMany({
    where: { sceneId: shot.sceneId },
    orderBy: { order: "asc" },
  });

  const insertAt = siblings.findIndex((s) => s.id === id) + 1;

  await db.$transaction(async (tx) => {
    const created = await tx.shot.create({
      data: {
        sceneId: shot.sceneId,
        shotNumber: shot.shotNumber,
        shotType: shot.shotType,
        cameraAngle: shot.cameraAngle,
        lens: shot.lens,
        movement: shot.movement,
        duration: shot.duration,
        description: shot.description,
        dialogue: shot.dialogue,
        order: insertAt, // temporary; renumbered below
      },
    });

    const reordered = [...siblings];
    reordered.splice(insertAt, 0, created);
    await Promise.all(
      reordered.map((s, index) => tx.shot.update({ where: { id: s.id }, data: { order: index } }))
    );
  });

  const scene = await db.scene.findUnique({
    where: { id: shot.sceneId },
    include: { characters: true, shots: { orderBy: { order: "asc" }, include: { frame: true } } },
  });

  return NextResponse.json(scene);
}
