import { mkdir, writeFile } from "fs/promises";
import path from "path";

const GENERATED_DIR = path.join(process.cwd(), "public", "generated");

/** Saves a generated frame image to public/generated/{projectId}/{frameId}.png and returns the served URL path. */
export async function saveGeneratedImage(
  projectId: string,
  frameId: string,
  buffer: Buffer
): Promise<string> {
  const dir = path.join(GENERATED_DIR, projectId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${frameId}.png`);
  await writeFile(filePath, buffer);
  return `/generated/${projectId}/${frameId}.png`;
}
