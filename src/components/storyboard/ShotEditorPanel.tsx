"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Character } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { updateShot } from "@/lib/api";
import type { ProjectWithRelations, ShotWithFrame } from "@/lib/types";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-dim">
      {children}
    </p>
  );
}

export function ShotEditorPanel({
  shot,
  projectId,
  sceneCharacters,
  onClose,
}: {
  shot: ShotWithFrame;
  projectId: string;
  sceneCharacters: Character[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    shotType: shot.shotType,
    cameraAngle: shot.cameraAngle ?? "",
    lens: shot.lens ?? "",
    movement: shot.movement ?? "",
    duration: shot.duration ?? 0,
    description: shot.description,
    dialogue: shot.dialogue ?? "",
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateShot(shot.id, {
        shotType: form.shotType,
        cameraAngle: form.cameraAngle || null,
        lens: form.lens || null,
        movement: form.movement || null,
        duration: form.duration || null,
        description: form.description,
        dialogue: form.dialogue || null,
      }),
    onSuccess: (updatedShot) => {
      queryClient.setQueryData<ProjectWithRelations>(["project", projectId], (old) => {
        if (!old) return old;
        return {
          ...old,
          scenes: old.scenes.map((scene) => ({
            ...scene,
            shots: scene.shots.map((s) => (s.id === shot.id ? { ...s, ...updatedShot } : s)),
          })),
        };
      });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-void/60" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-studio-border-strong bg-base/90 p-6 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink">
            Shot {shot.shotNumber} <span className="text-telemetry">(Active)</span>
          </h2>
          <button onClick={onClose} className="text-ink-dim hover:text-ink">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Shot Type &amp; Framing</SectionLabel>
            <Input
              value={form.shotType}
              onChange={(e) => setForm({ ...form, shotType: e.target.value })}
            />
          </div>

          <div className="rounded border border-studio-border bg-elevated/60 p-3">
            <SectionLabel>Camera Rig &amp; Movement</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Angle</Label>
                <Input
                  value={form.cameraAngle}
                  onChange={(e) => setForm({ ...form, cameraAngle: e.target.value })}
                  placeholder="e.g. Low Angle"
                />
              </div>
              <div>
                <Label>Movement</Label>
                <Input
                  value={form.movement}
                  onChange={(e) => setForm({ ...form, movement: e.target.value })}
                  placeholder="e.g. Dolly Push-in"
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-studio-border bg-elevated/60 p-3">
            <SectionLabel>Lens &amp; Optics</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Lens</Label>
                <Input
                  value={form.lens}
                  onChange={(e) => setForm({ ...form, lens: e.target.value })}
                  placeholder="e.g. 85mm"
                />
              </div>
              <div>
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Description</SectionLabel>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <SectionLabel>Dialogue (optional)</SectionLabel>
            <Textarea
              rows={2}
              value={form.dialogue}
              onChange={(e) => setForm({ ...form, dialogue: e.target.value })}
            />
          </div>

          {sceneCharacters.length > 0 && (
            <div className="rounded border border-studio-border bg-elevated/60 p-3">
              <SectionLabel>Characters in Scene</SectionLabel>
              <div className="space-y-2">
                {sceneCharacters.map((c) => (
                  <div key={c.id} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-tally" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink">{c.name}</p>
                      <p className="line-clamp-2 text-[11px] text-ink-dim">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shot.frame?.promptUsed && (
            <div>
              <SectionLabel>Last Image Prompt Used</SectionLabel>
              <p className="rounded border border-studio-border bg-white/[0.03] p-2 font-mono text-[11px] text-ink-dim">
                {shot.frame.promptUsed}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
