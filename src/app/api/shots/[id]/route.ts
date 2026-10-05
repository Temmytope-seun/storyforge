import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateShotSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateShotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const shot = await db.shot.update({
    where: { id },
    data: parsed.data,
    include: { frame: true },
  });

  return NextResponse.json(shot);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await db.shot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
