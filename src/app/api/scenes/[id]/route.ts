import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateSceneSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSceneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { characterIds, ...rest } = parsed.data;

  const scene = await db.scene.update({
    where: { id },
    data: {
      ...rest,
      ...(characterIds
        ? { characters: { set: characterIds.map((cid) => ({ id: cid })) } }
        : {}),
    },
    include: { characters: true, shots: { orderBy: { order: "asc" }, include: { frame: true } } },
  });

  return NextResponse.json(scene);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await db.scene.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
