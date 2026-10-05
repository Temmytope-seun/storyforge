import { InferenceClient } from "@huggingface/inference";
import type { GeneratedImage, ImageGenerationProvider } from "../types";

function getClient() {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY is not set. Add it to .env before generating storyboard frames."
    );
  }
  return new InferenceClient(apiKey);
}

/** Maps our aspect ratio strings to pixel dimensions (multiples of 8, as most diffusion models require). */
function dimensionsForAspectRatio(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1024, height: 576 };
    case "9:16":
      return { width: 576, height: 1024 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

/**
 * Open-source model provider via Hugging Face's own free-tier serverless
 * inference ("hf-inference"), for testing without burning paid API credits.
 *
 * Most popular image models (FLUX.1-schnell included) are no longer hosted on
 * hf-inference itself — they only route through paid third-party providers
 * (fal-ai, together, replicate, ...), which isn't "free" in the way we want
 * here. stable-diffusion-3-medium is one of the few still actually live on
 * hf-inference. It's gated (auto-approved): visit
 * https://huggingface.co/stabilityai/stable-diffusion-3-medium-diffusers and
 * click "Agree" once, logged in as the account that owns your HF token.
 */
export class HuggingFaceImageProvider implements ImageGenerationProvider {
  private model: string;

  constructor() {
    this.model =
      process.env.HUGGINGFACE_IMAGE_MODEL || "stabilityai/stable-diffusion-3-medium-diffusers";
  }

  async generateFrame(
    prompt: string,
    opts: { aspectRatio: string }
  ): Promise<GeneratedImage> {
    const client = getClient();
    const { width, height } = dimensionsForAspectRatio(opts.aspectRatio);

    const blob = await client.textToImage(
      {
        model: this.model,
        provider: "hf-inference",
        inputs: prompt,
        parameters: { width, height },
      },
      { outputType: "blob" }
    );

    const arrayBuffer = await blob.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: blob.type || "image/png",
    };
  }
}
