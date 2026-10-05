import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectInclude } from "@/lib/types";
import { updateProjectSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const project = await db.project.update({
    where: { id },
    data: parsed.data,
    include: projectInclude,
  });

  return NextResponse.json(project);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await db.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
