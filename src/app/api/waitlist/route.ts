import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createWaitlistEntrySchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createWaitlistEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { email, name, note } = parsed.data;

  await db.waitlistEntry.upsert({
    where: { email },
    create: { email, name: name || null, note: note || null },
    update: { name: name || undefined, note: note || undefined },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
