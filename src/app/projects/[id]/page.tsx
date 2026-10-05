import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projectInclude } from "@/lib/types";
import { ProjectWorkspace } from "@/components/storyboard/ProjectWorkspace";

type Params = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: projectInclude,
  });

  if (!project) {
    notFound();
  }

  return <ProjectWorkspace initialProject={project} />;
}
