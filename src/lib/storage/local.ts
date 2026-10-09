import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const GENERATED_DIR = path.join(process.cwd(), "public", "generated");

/**
 * Saves a generated frame image and returns the URL to serve it from.
 *
 * Vercel's serverless functions have an ephemeral, non-public filesystem, so
 * writing to public/generated/ at runtime (the local-dev behavior below)
 * would silently vanish in production. When BLOB_READ_WRITE_TOKEN is present
 * (set automatically once a Vercel Blob store is attached to the project)
 * this uploads to Blob storage instead and returns its public URL.
 */
export async function saveGeneratedImage(
  projectId: string,
  frameId: string,
  buffer: Buffer
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`generated/${projectId}/${frameId}.png`, buffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(GENERATED_DIR, projectId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${frameId}.png`);
  await writeFile(filePath, buffer);
  return `/generated/${projectId}/${frameId}.png`;
}
