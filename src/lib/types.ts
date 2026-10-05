import { Prisma } from "@prisma/client";

export const projectInclude = {
  characters: true,
  scenes: {
    orderBy: { order: "asc" },
    include: {
      characters: true,
      shots: {
        orderBy: { order: "asc" },
        include: { frame: true },
      },
    },
  },
} satisfies Prisma.ProjectInclude;

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

export type SceneWithRelations = ProjectWithRelations["scenes"][number];
export type ShotWithFrame = SceneWithRelations["shots"][number];

export const sceneInclude = {
  characters: true,
  shots: {
    orderBy: { order: "asc" },
    include: { frame: true },
  },
  project: {
    include: { characters: true },
  },
} satisfies Prisma.SceneInclude;

export type SceneWithContext = Prisma.SceneGetPayload<{
  include: typeof sceneInclude;
}>;
