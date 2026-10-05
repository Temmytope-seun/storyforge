import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validation";

export async function GET() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      scenes: {
        select: { id: true },
      },
    },
  });

  const withCounts = projects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    visualStyle: p.visualStyle,
    aspectRatio: p.aspectRatio,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    sceneCount: p.scenes.length,
  }));

  return NextResponse.json(withCounts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const project = await db.project.create({
    data: parsed.data,
  });

  return NextResponse.json(project, { status: 201 });
}
