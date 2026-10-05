"use client";

import Image from "next/image";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { createScene, reorderScenes } from "@/lib/api";
import type { ProjectWithRelations, SceneWithRelations } from "@/lib/types";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sceneDuration(scene: SceneWithRelations): number {
  return scene.shots.reduce((sum, shot) => sum + (shot.duration ?? 0), 0);
}

function SceneSidebarItem({
  scene,
  startSec,
}: {
  scene: SceneWithRelations;
  startSec: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id });
  const duration = sceneDuration(scene);
  const thumbnail = scene.shots.find((s) => s.frame?.imageUrl)?.frame?.imageUrl;

  return (
    <button
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
      onClick={() => {
        document.getElementById(`scene-${scene.id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
      className="flex w-full cursor-grab items-center gap-2.5 rounded border border-studio-border bg-elevated/60 p-2 text-left hover:border-studio-border-strong"
    >
      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-base">
        {thumbnail && (
          <Image src={thumbnail} alt="" fill unoptimized className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {scene.sceneNumber}. {scene.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="font-mono text-[10px] tabular-nums text-ink-dim">
            {formatTime(startSec)}-{formatTime(startSec + duration)}
          </span>
          <span className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[9px] text-ink-dim">
            {scene.shots.length} SHOT{scene.shots.length === 1 ? "" : "S"}
          </span>
        </div>
      </div>
    </button>
  );
}

export function SceneSidebar({
  project,
  characterFilter,
  onCharacterFilterChange,
}: {
  project: ProjectWithRelations;
  characterFilter: string | null;
  onCharacterFilterChange: (characterId: string | null) => void;
}) {
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderScenes(project.id, orderedIds),
  });

  const addSceneMutation = useMutation({
    mutationFn: () => createScene(project.id),
    onSuccess: (scene) => {
      queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
        if (!old) return old;
        return { ...old, scenes: [...old.scenes, scene] };
      });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = project.scenes.map((s) => s.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newOrder = arrayMove(ids, oldIndex, newIndex);

    queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
      if (!old) return old;
      const sceneMap = new Map(old.scenes.map((s) => [s.id, s]));
      return { ...old, scenes: newOrder.map((id) => sceneMap.get(id)!) };
    });

    reorderMutation.mutate(newOrder);
  }

  const totalShots = project.scenes.reduce((sum, s) => sum + s.shots.length, 0);
  const totalRunTime = project.scenes.reduce((sum, s) => sum + sceneDuration(s), 0);

  const scenesWithStart = project.scenes.reduce<
    { scene: SceneWithRelations; start: number }[]
  >((acc, scene) => {
    const prev = acc[acc.length - 1];
    const start = prev ? prev.start + sceneDuration(prev.scene) : 0;
    return [...acc, { scene, start }];
  }, []);

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-studio-border bg-base p-3">
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-dim">
        Scene Structure
      </h2>

      <div className="mb-3 grid grid-cols-3 gap-1.5 rounded border border-studio-border bg-elevated/60 p-2 text-center">
        <div>
          <p className="font-mono text-sm font-semibold text-ink">{totalShots}</p>
          <p className="text-[9px] uppercase tracking-wide text-ink-dim">Shots</p>
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-ink">{formatTime(totalRunTime)}</p>
          <p className="text-[9px] uppercase tracking-wide text-ink-dim">Run Time</p>
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-ink">{project.characters.length}</p>
          <p className="text-[9px] uppercase tracking-wide text-ink-dim">Characters</p>
        </div>
      </div>

      {project.characters.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          <button
            onClick={() => onCharacterFilterChange(null)}
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase transition-colors ${
              characterFilter === null
                ? "bg-tally text-tally-on"
                : "bg-white/[0.06] text-ink-dim hover:text-ink"
            }`}
          >
            All
          </button>
          {project.characters.map((c) => (
            <button
              key={c.id}
              onClick={() => onCharacterFilterChange(c.id)}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                characterFilter === c.id
                  ? "bg-telemetry text-void"
                  : "bg-white/[0.06] text-ink-dim hover:text-ink"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {c.name}
            </button>
          ))}
        </div>
      )}

      <DndContext
        id={`scene-sidebar-${project.id}`}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={project.scenes.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1.5">
            {scenesWithStart.map(({ scene, start }) => (
              <SceneSidebarItem key={scene.id} scene={scene} startSec={start} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => addSceneMutation.mutate()}
        disabled={addSceneMutation.isPending}
        className="mt-3 flex items-center justify-center gap-1.5 rounded border border-dashed border-studio-border py-1.5 text-xs text-ink-dim transition-colors hover:border-studio-border-strong hover:text-ink disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" />
        {addSceneMutation.isPending ? "Adding…" : "Add Scene"}
      </button>
    </aside>
  );
}
