"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { FrameCard } from "./FrameCard";
import { deleteScene, regenerateScene, reorderShots, updateScene } from "@/lib/api";
import type { ProjectWithRelations, SceneWithRelations } from "@/lib/types";

function EditableSceneHeader({ scene, projectId }: { scene: SceneWithRelations; projectId: string }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(scene.title);
  const [location, setLocation] = useState(scene.location);

  const saveMutation = useMutation({
    mutationFn: () => updateScene(scene.id, { title, location }),
    onSuccess: (updated) => {
      queryClient.setQueryData<ProjectWithRelations>(["project", projectId], (old) => {
        if (!old) return old;
        return {
          ...old,
          scenes: old.scenes.map((s) => (s.id === scene.id ? { ...s, ...updated } : s)),
        };
      });
      setEditing(false);
    },
  });

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => saveMutation.mutate()}
          onKeyDown={(e) => e.key === "Enter" && saveMutation.mutate()}
          className="rounded border border-studio-border bg-base px-2 py-1 font-display text-sm font-semibold text-ink focus:border-tally focus:outline-none"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => saveMutation.mutate()}
          onKeyDown={(e) => e.key === "Enter" && saveMutation.mutate()}
          placeholder="Location"
          className="rounded border border-studio-border bg-base px-2 py-1 text-xs text-ink-dim focus:border-tally focus:outline-none"
        />
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="text-left">
      <h3 className="font-display text-sm font-semibold text-ink hover:text-tally">
        {scene.title}
      </h3>
      <p className="text-xs text-ink-dim">
        {[scene.location, scene.timeOfDay, scene.mood].filter(Boolean).join(" · ") || "Click to add location"}
      </p>
    </button>
  );
}

function SceneSection({
  scene,
  project,
  onEditShot,
  generatingShotIds,
}: {
  scene: SceneWithRelations;
  project: ProjectWithRelations;
  onEditShot: (shotId: string) => void;
  generatingShotIds: Set<string>;
}) {
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderShots(scene.id, orderedIds),
  });

  const regenerateMutation = useMutation({
    mutationFn: () => regenerateScene(scene.id),
    onSuccess: (updatedScene) => {
      queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          scenes: old.scenes.map((s) => (s.id === scene.id ? updatedScene : s)),
        };
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteScene(scene.id),
    onSuccess: () => {
      queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
        if (!old) return old;
        return { ...old, scenes: old.scenes.filter((s) => s.id !== scene.id) };
      });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = scene.shots.map((s) => s.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newOrder = arrayMove(ids, oldIndex, newIndex);

    queryClient.setQueryData<ProjectWithRelations>(["project", project.id], (old) => {
      if (!old) return old;
      return {
        ...old,
        scenes: old.scenes.map((s) => {
          if (s.id !== scene.id) return s;
          const shotMap = new Map(s.shots.map((shot) => [shot.id, shot]));
          return { ...s, shots: newOrder.map((id) => shotMap.get(id)!) };
        }),
      };
    });

    reorderMutation.mutate(newOrder);
  }

  return (
    <section id={`scene-${scene.id}`} className="mb-10 scroll-mt-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded bg-tally/15 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-tally">
            SCENE {String(scene.sceneNumber).padStart(2, "0")}
          </span>
          <EditableSceneHeader scene={scene} projectId={project.id} />
          {scene.characters.length > 0 && (
            <div className="hidden items-center gap-1 sm:flex">
              {scene.characters.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-dim"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            disabled={regenerateMutation.isPending}
            onClick={() => regenerateMutation.mutate()}
          >
            {regenerateMutation.isPending ? "Regenerating…" : "Regenerate Scene"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate()}>
            Delete Scene
          </Button>
        </div>
      </div>

      <DndContext
        id={`scene-shots-${scene.id}`}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={scene.shots.map((s) => s.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scene.shots.map((shot) => (
              <FrameCard
                key={shot.id}
                shot={shot}
                projectId={project.id}
                onEdit={() => onEditShot(shot.id)}
                isGenerating={generatingShotIds.has(shot.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

export function FrameGrid({
  project,
  onEditShot,
  generatingShotIds,
  characterFilter,
}: {
  project: ProjectWithRelations;
  onEditShot: (shotId: string) => void;
  generatingShotIds: Set<string>;
  characterFilter: string | null;
}) {
  const scenes = characterFilter
    ? project.scenes.filter((s) => s.characters.some((c) => c.id === characterFilter))
    : project.scenes;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {scenes.length === 0 ? (
        <p className="text-sm text-ink-dim">No scenes feature this character.</p>
      ) : (
        scenes.map((scene) => (
          <SceneSection
            key={scene.id}
            scene={scene}
            project={project}
            onEditShot={onEditShot}
            generatingShotIds={generatingShotIds}
          />
        ))
      )}
    </div>
  );
}
