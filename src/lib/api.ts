import type { Frame } from "@prisma/client";
import type { ProjectWithRelations, SceneWithRelations, ShotWithFrame } from "@/lib/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      typeof body?.error === "string" ? body.error : JSON.stringify(body?.error ?? res.statusText);
    throw new Error(message);
  }
  return res.json();
}

export function fetchProject(id: string) {
  return request<ProjectWithRelations>(`/api/projects/${id}`);
}

export function analyzeProject(id: string) {
  return request<ProjectWithRelations>(`/api/projects/${id}/analyze`, { method: "POST" });
}

export function updateProject(
  id: string,
  data: Partial<{ title: string; idea: string; visualStyle: string; aspectRatio: string }>
) {
  return request<ProjectWithRelations>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function createScene(projectId: string) {
  return request<SceneWithRelations>(`/api/projects/${projectId}/scenes`, { method: "POST" });
}

export function reorderScenes(projectId: string, orderedIds: string[]) {
  return request(`/api/projects/${projectId}/scenes/reorder`, {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
}

export function updateScene(
  id: string,
  data: Partial<{
    title: string;
    location: string;
    timeOfDay: string | null;
    mood: string | null;
    duration: number | null;
    characterIds: string[];
  }>
) {
  return request<SceneWithRelations>(`/api/scenes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteScene(id: string) {
  return request(`/api/scenes/${id}`, { method: "DELETE" });
}

export function regenerateScene(id: string) {
  return request<SceneWithRelations>(`/api/scenes/${id}/regenerate`, { method: "POST" });
}

export function reorderShots(sceneId: string, orderedIds: string[]) {
  return request(`/api/scenes/${sceneId}/shots/reorder`, {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
}

export function updateShot(
  id: string,
  data: Partial<{
    shotType: string;
    cameraAngle: string | null;
    lens: string | null;
    movement: string | null;
    duration: number | null;
    description: string;
    dialogue: string | null;
  }>
) {
  return request<ShotWithFrame>(`/api/shots/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteShot(id: string) {
  return request(`/api/shots/${id}`, { method: "DELETE" });
}

export function duplicateShot(id: string) {
  return request<SceneWithRelations>(`/api/shots/${id}/duplicate`, { method: "POST" });
}

export function generateFrame(shotId: string) {
  return request<Frame>(`/api/shots/${shotId}/generate-frame`, { method: "POST" });
}

export function createCharacter(data: { projectId: string; name: string; description: string }) {
  return request(`/api/characters`, { method: "POST", body: JSON.stringify(data) });
}

export function updateCharacter(id: string, data: Partial<{ name: string; description: string }>) {
  return request(`/api/characters/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteCharacter(id: string) {
  return request(`/api/characters/${id}`, { method: "DELETE" });
}

export function joinWaitlist(data: { email: string; name?: string; note?: string; company?: string }) {
  return request(`/api/waitlist`, { method: "POST", body: JSON.stringify(data) });
}
