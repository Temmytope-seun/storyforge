import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import sharp from "sharp";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { projectInclude } from "@/lib/types";
import { StoryboardDocument } from "@/lib/pdf/StoryboardDocument";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // @react-pdf/renderer's local-path detection misreads a Windows drive
  // letter (e.g. "C:") as a URL scheme and falls through to fetch(), which
  // fails. Reading the bytes ourselves and handing it a Buffer sidesteps
  // that path/URL resolution entirely. The source PNGs are also full
  // generation resolution (1-4MB each) for a 160x100pt thumbnail, so they're
  // downscaled here too — otherwise a 16-shot storyboard produces a 50MB+ PDF.
  const frameBuffers = new Map<string, Buffer>();
  for (const scene of project.scenes) {
    for (const shot of scene.shots) {
      if (shot.frame?.imageUrl && !frameBuffers.has(shot.frame.imageUrl)) {
        try {
          const raw = shot.frame.imageUrl.startsWith("http")
            ? Buffer.from(await (await fetch(shot.frame.imageUrl)).arrayBuffer())
            : await readFile(path.join(process.cwd(), "public", shot.frame.imageUrl));
          const resized = await sharp(raw).resize({ width: 480 }).jpeg({ quality: 80 }).toBuffer();
          frameBuffers.set(shot.frame.imageUrl, resized);
        } catch {
          // Leave unset; the document renders a placeholder for a missing file.
        }
      }
    }
  }

  const buffer = await renderToBuffer(
    <StoryboardDocument project={project} frameBuffers={frameBuffers} />
  );

  const filename = `${project.title.replace(/[^a-z0-9-_ ]/gi, "").trim() || "storyboard"}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
