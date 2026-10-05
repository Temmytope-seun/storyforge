import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateCharacterSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCharacterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const character = await db.character.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(character);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await db.character.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
