"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Frame } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LogoMark } from "@/components/marketing/Logo";
import { BriefEntryView } from "./BriefEntryView";
import { SceneSidebar } from "./SceneSidebar";
import { FrameGrid } from "./FrameGrid";
import { ShotEditorPanel } from "./ShotEditorPanel";
import { CharacterManager } from "@/components/characters/CharacterManager";
import { fetchProject, generateFrame } from "@/lib/api";
import { runWithConcurrency } from "@/lib/concurrency";
import type { ProjectWithRelations } from "@/lib/types";

const STATUS_DOT = {
  DRAFT: "amber",
  ANALYZED: "cyan",
  STORYBOARDED: "green",
} as const;

export function ProjectWorkspace({
  initialProject,
}: {
  initialProject: ProjectWithRelations;
}) {
  const queryClient = useQueryClient();
  const { data: project } = useQuery({
    queryKey: ["project", initialProject.id],
    queryFn: () => fetchProject(initialProject.id),
    initialData: initialProject,
  });

  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const [showCharacters, setShowCharacters] = useState(false);
  const [characterFilter, setCharacterFilter] = useState<string | null>(null);
  const [generateProgress, setGenerateProgress] = useState<{ done: number; total: number } | null>(
    null
  );
  const [generatingShotIds, setGeneratingShotIds] = useState<Set<string>>(new Set());
  const [generateSummary, setGenerateSummary] = useState<{
    succeeded: number;
    failed: { sceneTitle: string; shotNumber: number }[];
  } | null>(null);

  const allShots = useMemo(
    () => project.scenes.flatMap((scene) => scene.shots),
    [project.scenes]
  );
  const editingShot = allShots.find((s) => s.id === editingShotId) ?? null;
  const editingScene = project.scenes.find((scene) =>
    scene.shots.some((s) => s.id === editingShotId)
  );

  function patchShotFrame(shotId: string, frame: Frame) {
    queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
      if (!old) return old;
      return {
        ...old,
        scenes: old.scenes.map((scene) => ({
          ...scene,
          shots: scene.shots.map((s) => (s.id === shotId ? { ...s, frame } : s)),
        })),
      };
    });
  }

  async function handleGenerateAll() {
    setGenerateSummary(null);
    const targets = project.scenes.flatMap((scene) =>
      scene.shots.map((shot) => ({ shot, sceneTitle: scene.title }))
    );
    setGenerateProgress({ done: 0, total: targets.length });
    setGeneratingShotIds(new Set(targets.map(({ shot }) => shot.id)));

    const results = await runWithConcurrency(
      targets.map(({ shot }) => async () => {
        try {
          const frame = await generateFrame(shot.id);
          patchShotFrame(shot.id, frame);
        } catch (err) {
          // The failed row (status/errorMessage) only exists in the DB at this point.
          await queryClient.invalidateQueries({ queryKey: ["project", project.id] });
          throw err;
        } finally {
          setGeneratingShotIds((prev) => {
            const next = new Set(prev);
            next.delete(shot.id);
            return next;
          });
          setGenerateProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
        }
      }),
      3
    );

    // One final refresh to pick up aggregate fields (e.g. project.status).
    await queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    setGenerateProgress(null);

    const failed = results
      .map((r, i) => ({ r, meta: targets[i] }))
      .filter(({ r }) => r.status === "rejected")
      .map(({ meta }) => ({ sceneTitle: meta.sceneTitle, shotNumber: meta.shot.shotNumber }));

    setGenerateSummary({ succeeded: targets.length - failed.length, failed });
  }

  if (project.scenes.length === 0) {
    return <BriefEntryView project={project} />;
  }

  return (
    <div className="flex h-screen flex-col bg-void">
      <header className="flex items-center justify-between border-b border-studio-border bg-base px-6 py-3">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2 text-ink-dim hover:text-ink">
            <LogoMark className="h-6 w-6" />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">
            Projects
          </span>
          <span className="text-studio-border-strong">/</span>
          <h1 className="font-display text-sm font-semibold text-ink">{project.title}</h1>
          <Badge dot={STATUS_DOT[project.status]}>{project.status}</Badge>
          <span className="hidden items-center gap-1.5 text-[11px] text-ink-dim sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-ready" />
            Auto-saved
          </span>
          <span className="hidden rounded border border-studio-border px-1.5 py-0.5 font-mono text-[10px] text-ink-dim md:inline">
            {project.aspectRatio}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowCharacters(true)}>
            Asset Vault ({project.characters.length})
          </Button>
          <Button size="sm" variant="secondary" disabled={!!generateProgress} onClick={handleGenerateAll}>
            {generateProgress
              ? `Generating… ${generateProgress.done}/${generateProgress.total}`
              : "Generate All Frames"}
          </Button>
          <a href={`/api/projects/${project.id}/export/pdf`}>
            <Button size="sm">Export PDF</Button>
          </a>
          <Button
            size="sm"
            variant="ghost"
            disabled
            title="Presentation mode — roadmap"
            className="hidden lg:inline-flex"
          >
            Present
          </Button>
        </div>
      </header>

      {generateSummary && (
        <div
          className={`flex items-center justify-between border-b border-studio-border px-6 py-2 text-xs ${
            generateSummary.failed.length ? "bg-tally/10 text-tally" : "bg-ready/10 text-ready"
          }`}
        >
          <span>
            {generateSummary.succeeded} of {generateSummary.succeeded + generateSummary.failed.length}{" "}
            frames generated successfully.
            {generateSummary.failed.length > 0 && (
              <>
                {" "}
                {generateSummary.failed.length} failed —{" "}
                {generateSummary.failed
                  .map((f) => `"${f.sceneTitle}" Shot ${f.shotNumber}`)
                  .join(", ")}
                . Scroll to the card and click Regenerate to retry.
              </>
            )}
          </span>
          <button
            onClick={() => setGenerateSummary(null)}
            className="ml-4 shrink-0 text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <SceneSidebar
          project={project}
          characterFilter={characterFilter}
          onCharacterFilterChange={setCharacterFilter}
        />
        <FrameGrid
          project={project}
          onEditShot={setEditingShotId}
          generatingShotIds={generatingShotIds}
          characterFilter={characterFilter}
        />
      </div>

      {editingShot && (
        <ShotEditorPanel
          key={editingShot.id}
          shot={editingShot}
          projectId={project.id}
          sceneCharacters={editingScene?.characters ?? []}
          onClose={() => setEditingShotId(null)}
        />
      )}

      {showCharacters && (
        <CharacterManager project={project} onClose={() => setShowCharacters(false)} />
      )}
    </div>
  );
}
