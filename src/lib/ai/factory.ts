import { AnthropicLLMProvider } from "./llm/anthropic";
import { OpenAIImageProvider } from "./image/openai";
import { HuggingFaceImageProvider } from "./image/huggingface";
import type { ImageGenerationProvider, LLMProvider } from "./types";

export function getLLMProvider(): LLMProvider {
  const provider = process.env.AI_LLM_PROVIDER || "anthropic";
  switch (provider) {
    case "anthropic":
      return new AnthropicLLMProvider();
    default:
      throw new Error(`Unknown AI_LLM_PROVIDER: "${provider}"`);
  }
}

export function getImageProvider(): ImageGenerationProvider {
  const provider = process.env.AI_IMAGE_PROVIDER || "openai";
  switch (provider) {
    case "openai":
      return new OpenAIImageProvider();
    case "huggingface":
      return new HuggingFaceImageProvider();
    default:
      throw new Error(`Unknown AI_IMAGE_PROVIDER: "${provider}"`);
  }
}
