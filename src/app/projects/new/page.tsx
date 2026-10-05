"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { ASPECT_RATIOS, VISUAL_STYLES } from "@/lib/constants";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  idea: z.string().min(10, "Describe your idea in a bit more detail").max(5000),
  visualStyle: z.string(),
  aspectRatio: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProjectPage() {
  return (
    <Suspense fallback={null}>
      <NewProjectForm />
    </Suspense>
  );
}

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillIdea = searchParams.get("idea") ?? "";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      idea: prefillIdea,
      visualStyle: VISUAL_STYLES[0],
      aspectRatio: ASPECT_RATIOS[0],
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setSubmitError(body?.error ? JSON.stringify(body.error) : "Failed to create project");
      return;
    }
    const project = await res.json();
    router.push(`/projects/${project.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="font-display text-xl font-semibold text-ink">
        Let&rsquo;s turn your idea into a storyboard.
      </h1>
      <p className="mt-1 text-sm text-ink-dim">
        Describe your story. StoryForge will break it into scenes, shots and
        storyboard frames.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label>What are you creating?</Label>
          <Input placeholder="e.g. Lagos Rush Hour" {...register("title")} />
          {errors.title && (
            <p className="mt-1 text-xs text-critical">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label>Tell us about your story</Label>
          <Textarea
            rows={5}
            placeholder="A young Nigerian man wakes up late for work, rushes through Lagos traffic on a motorcycle, narrowly avoids a danfo, arrives at the office and discovers he has an important presentation."
            {...register("idea")}
          />
          {errors.idea && (
            <p className="mt-1 text-xs text-critical">{errors.idea.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Visual style</Label>
            <Select {...register("visualStyle")}>
              {VISUAL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Aspect ratio</Label>
            <Select {...register("aspectRatio")}>
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {submitError && <p className="text-xs text-critical">{submitError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating…" : "Create Project"}
        </Button>
      </form>
    </main>
  );
}
