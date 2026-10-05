"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { createCharacter, deleteCharacter, updateCharacter } from "@/lib/api";
import type { ProjectWithRelations } from "@/lib/types";

export function CharacterManager({
  project,
  onClose,
}: {
  project: ProjectWithRelations;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["project", project.id] });

  const createMutation = useMutation({
    mutationFn: () => createCharacter({ projectId: project.id, name, description }),
    onSuccess: () => {
      setName("");
      setDescription("");
      invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => updateCharacter(id, { name, description }),
    onSuccess: () => {
      setEditingId(null);
      setName("");
      setDescription("");
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCharacter(id),
    onSuccess: invalidate,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/60" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-studio-border-strong bg-base/95 p-6 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink">Character Vault</h2>
          <button onClick={onClose} className="text-ink-dim hover:text-ink">
            ✕
          </button>
        </div>

        <div className="mb-5 space-y-2">
          {project.characters.map((character) => (
            <div
              key={character.id}
              className="rounded border border-studio-border border-l-2 border-l-tally bg-elevated/60 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{character.name}</p>
                <div className="flex gap-2">
                  <button
                    className="text-xs text-ink-dim hover:text-ink"
                    onClick={() => {
                      setEditingId(character.id);
                      setName(character.name);
                      setDescription(character.description);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-critical/80 hover:text-critical"
                    onClick={() => deleteMutation.mutate(character.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-ink-dim">{character.description}</p>
            </div>
          ))}
          {project.characters.length === 0 && (
            <p className="text-xs text-ink-dim">No characters yet.</p>
          )}
        </div>

        <div className="space-y-2 border-t border-studio-border pt-4">
          <Label>{editingId ? "Edit character" : "Add character"}</Label>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            placeholder="Description (appearance, clothing, personality…)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            {editingId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setDescription("");
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={!name || !description}
              onClick={() =>
                editingId ? updateMutation.mutate(editingId) : createMutation.mutate()
              }
            >
              {editingId ? "Save" : "Add Character"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
