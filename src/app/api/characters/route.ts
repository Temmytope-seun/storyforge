import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCharacterSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createCharacterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const character = await db.character.create({ data: parsed.data });
  return NextResponse.json(character, { status: 201 });
}
