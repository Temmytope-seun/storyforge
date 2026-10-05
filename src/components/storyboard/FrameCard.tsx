"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { deleteShot, duplicateShot, generateFrame } from "@/lib/api";
import type { ProjectWithRelations, ShotWithFrame } from "@/lib/types";

export function FrameCard({
  shot,
  projectId,
  onEdit,
  isGenerating = false,
}: {
  shot: ShotWithFrame;
  projectId: string;
  onEdit: () => void;
  isGenerating?: boolean;
}) {
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: shot.id });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["project", projectId] });

  const generateMutation = useMutation({
    mutationFn: () => generateFrame(shot.id),
    onSettled: invalidate,
  });

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateShot(shot.id),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteShot(shot.id),
    onSuccess: () => {
      queryClient.setQueryData<ProjectWithRelations>(["project", projectId], (old) => {
        if (!old) return old;
        return {
          ...old,
          scenes: old.scenes.map((scene) => ({
            ...scene,
            shots: scene.shots.filter((s) => s.id !== shot.id),
          })),
        };
      });
    },
  });

  const status = shot.frame?.status;
  const isBusy = generateMutation.isPending || isGenerating || status === "PROCESSING";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-studio-border bg-elevated"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1.5 z-10 cursor-grab rounded bg-void/60 px-1.5 py-0.5 text-[10px] text-ink-dim opacity-0 group-hover:opacity-100"
      >
        ⠿
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-base">
        {shot.frame?.imageUrl ? (
          <motion.div
            key={shot.frame.imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: isBusy ? 0.4 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={shot.frame.imageUrl}
              alt={shot.description}
              fill
              unoptimized
              className="object-cover"
            />
          </motion.div>
        ) : isBusy ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-base via-hover to-base" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-dim">
            No frame yet
          </div>
        )}
        {isBusy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/40">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-tally" />
            <span className="text-xs font-medium text-ink">Generating…</span>
          </div>
        )}
        {status === "FAILED" && !isBusy && (
          <div className="absolute inset-x-0 bottom-0 bg-critical/15 px-2 py-1 text-[10px] text-critical backdrop-blur-sm">
            Generation failed — {shot.frame?.errorMessage ?? "unknown error"}
          </div>
        )}
        {!isBusy && (
          <>
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-void/70 px-1.5 py-0.5 font-mono text-[9px] text-tally backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-tally" />
              SHOT {String(shot.shotNumber).padStart(2, "0")} · {shot.shotType.toUpperCase()}
            </div>
            {shot.duration && (
              <div className="absolute bottom-2 right-2 rounded bg-void/70 px-1.5 py-0.5 font-mono text-[10px] text-ink backdrop-blur-sm">
                {shot.duration}s
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {(shot.cameraAngle || shot.lens || shot.movement) && (
          <div className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] text-ink-dim">
            {shot.cameraAngle && <span>{shot.cameraAngle}</span>}
            {shot.lens && (
              <>
                <span className="text-studio-border-strong">•</span>
                <span className="text-telemetry">{shot.lens}</span>
              </>
            )}
            {shot.movement && (
              <>
                <span className="text-studio-border-strong">•</span>
                <span>{shot.movement}</span>
              </>
            )}
          </div>
        )}
        <p className="line-clamp-3 text-xs text-ink">{shot.description}</p>
        {shot.dialogue && (
          <p className="line-clamp-2 text-xs italic text-ink-dim">“{shot.dialogue}”</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-studio-border p-2">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          Edit
        </Button>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            disabled={isBusy}
            onClick={() => generateMutation.mutate()}
          >
            {shot.frame?.imageUrl ? "Regenerate" : "Generate"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => duplicateMutation.mutate()}>
            Duplicate
          </Button>
          <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate()}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
