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

  const shots = await db.shot.findMany({
    where: { sceneId: id },
    select: { id: true },
  });
  const validIds = new Set(shots.map((s) => s.id));
  const { orderedIds } = parsed.data;

  if (!orderedIds.every((sid) => validIds.has(sid))) {
    return NextResponse.json(
      { error: "orderedIds contains a shot that does not belong to this scene" },
      { status: 400 }
    );
  }

  await db.$transaction(
    orderedIds.map((shotId, index) =>
      db.shot.update({ where: { id: shotId }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
