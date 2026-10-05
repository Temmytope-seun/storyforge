import Image from "next/image";
import Link from "next/link";
import { Film } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LogoMark } from "@/components/marketing/Logo";

export const dynamic = "force-dynamic";

const STATUS_DOT = {
  DRAFT: "amber",
  ANALYZED: "cyan",
  STORYBOARDED: "green",
} as const;

export default async function DashboardPage() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      scenes: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          shots: {
            orderBy: { order: "asc" },
            select: { frame: { select: { imageUrl: true } } },
          },
        },
      },
    },
  });

  const cards = projects.map((project) => {
    const thumbnail = project.scenes
      .flatMap((s) => s.shots)
      .find((shot) => shot.frame?.imageUrl)?.frame?.imageUrl;
    return { project, thumbnail, sceneCount: project.scenes.length };
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-dim hover:text-ink"
          >
            <LogoMark className="h-5 w-5" />
            StoryForge AI
          </Link>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">My Projects</h1>
          <p className="mt-1 text-sm text-ink-dim">
            Turn ideas into professional storyboards in minutes.
          </p>
        </div>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-studio-border px-8 py-16 text-center">
          <p className="text-ink-dim">
            No projects yet. Create your first storyboard from an idea.
          </p>
          <Link href="/projects/new" className="mt-4 inline-block">
            <Button>Create Your First Storyboard</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ project, thumbnail, sceneCount }) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group overflow-hidden rounded-lg border border-studio-border bg-elevated/60 transition-colors hover:border-studio-border-strong hover:bg-elevated"
            >
              <div className="relative aspect-video w-full bg-base">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Film className="h-6 w-6 text-ink-dim/40" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <Badge dot={STATUS_DOT[project.status]}>{project.status}</Badge>
                  <span className="font-mono text-[10px] tabular-nums text-ink-dim">
                    {sceneCount} scene{sceneCount === 1 ? "" : "s"}
                  </span>
                </div>
                <h2 className="truncate text-base font-medium text-ink group-hover:text-tally">
                  {project.title}
                </h2>
                <p className="mt-1 text-xs text-ink-dim">
                  {project.visualStyle} · {project.aspectRatio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
