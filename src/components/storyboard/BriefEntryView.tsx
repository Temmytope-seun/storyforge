"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Label, Select, Textarea } from "@/components/ui/Field";
import { GenerateProgress } from "./GenerateProgress";
import { ASPECT_RATIOS, VISUAL_STYLES } from "@/lib/constants";
import { analyzeProject, updateProject } from "@/lib/api";
import type { ProjectWithRelations } from "@/lib/types";

const PROGRESS_MESSAGES = [
  "Analysing story…",
  "Identifying characters and locations…",
  "Planning scenes…",
  "Planning shots and camera coverage…",
  "Finalising storyboard structure…",
];

export function BriefEntryView({ project }: { project: ProjectWithRelations }) {
  const queryClient = useQueryClient();
  const [idea, setIdea] = useState(project.idea);
  const [visualStyle, setVisualStyle] = useState(project.visualStyle);
  const [aspectRatio, setAspectRatio] = useState(project.aspectRatio);
  const [error, setError] = useState<string | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      await updateProject(project.id, { idea, visualStyle, aspectRatio });
      return analyzeProject(project.id);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["project", project.id], updated);
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="font-display text-xl font-semibold text-ink">{project.title}</h1>
      <p className="mt-1 text-sm text-ink-dim">
        Review your idea, then generate a scene and shot breakdown.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <Label>Idea / brief</Label>
          <Textarea
            rows={6}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Visual style</Label>
            <Select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)}>
              {VISUAL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Aspect ratio</Label>
            <Select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {error && <p className="text-xs text-critical">{error}</p>}

        {analyzeMutation.isPending ? (
          <GenerateProgress messages={PROGRESS_MESSAGES} />
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              setError(null);
              analyzeMutation.mutate();
            }}
          >
            Generate Storyboard
          </Button>
        )}
      </div>
    </main>
  );
}
