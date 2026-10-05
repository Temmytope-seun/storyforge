import OpenAI from "openai";
import type { GeneratedImage, ImageGenerationProvider } from "../types";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env before generating storyboard frames."
    );
  }
  return new OpenAI({ apiKey });
}

/** Maps our aspect ratio strings to the closest size gpt-image-1 supports. */
function sizeForAspectRatio(aspectRatio: string): "1024x1024" | "1536x1024" | "1024x1536" {
  switch (aspectRatio) {
    case "16:9":
    case "4:3":
      return "1536x1024";
    case "9:16":
      return "1024x1536";
    case "1:1":
    default:
      return "1024x1024";
  }
}

export class OpenAIImageProvider implements ImageGenerationProvider {
  private model: string;

  constructor() {
    this.model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  }

  async generateFrame(
    prompt: string,
    opts: { aspectRatio: string }
  ): Promise<GeneratedImage> {
    const client = getClient();

    const result = await client.images.generate({
      model: this.model,
      prompt,
      size: sizeForAspectRatio(opts.aspectRatio),
      n: 1,
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("OpenAI image generation returned no image data.");
    }

    return {
      buffer: Buffer.from(b64, "base64"),
      mimeType: "image/png",
    };
  }
}
