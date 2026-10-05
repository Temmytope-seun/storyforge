import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;

  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const sceneCount = await db.scene.count({ where: { projectId: id } });

  const scene = await db.scene.create({
    data: {
      projectId: id,
      sceneNumber: sceneCount + 1,
      title: "New Scene",
      location: "",
      order: sceneCount,
    },
    include: {
      characters: true,
      shots: { orderBy: { order: "asc" }, include: { frame: true } },
    },
  });

  return NextResponse.json(scene, { status: 201 });
}
