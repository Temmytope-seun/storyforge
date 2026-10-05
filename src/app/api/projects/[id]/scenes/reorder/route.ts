import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reorderSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const scenes = await db.scene.findMany({
    where: { projectId: id },
    select: { id: true },
  });
  const validIds = new Set(scenes.map((s) => s.id));
  const { orderedIds } = parsed.data;

  if (!orderedIds.every((sid) => validIds.has(sid))) {
    return NextResponse.json(
      { error: "orderedIds contains a scene that does not belong to this project" },
      { status: 400 }
    );
  }

  await db.$transaction(
    orderedIds.map((sceneId, index) =>
      db.scene.update({ where: { id: sceneId }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
