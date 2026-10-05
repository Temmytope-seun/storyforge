# StoryForge AI — MVP Core Slice

Idea → AI scene/shot breakdown (Claude) → storyboard frames (OpenAI `gpt-image-1`) → edit/reorder/regenerate → PDF export.

See `PRD.md` for the full product vision and `.claude` plan history for the scoping decisions behind this slice (no auth/billing/collaboration/motion yet).

## Setup

```bash
docker compose up -d        # starts Postgres on localhost:5432
npm install
npx prisma migrate dev      # applies schema (prisma.config.ts reads DATABASE_URL from .env)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required API keys

Add these to `.env` before using the AI features:

```
ANTHROPIC_API_KEY=...   # story/scene/shot analysis
OPENAI_API_KEY=...      # storyboard frame image generation (gpt-image-1), paid
```

Without them, you can still create projects and browse the dashboard, but
"Generate Storyboard" and frame generation will fail with a clear error until
the keys are set.

### Free image generation for testing

`gpt-image-1` costs real money per image. For testing without burning paid
credits, switch to Hugging Face's free-tier serverless inference of
open-source models (default: FLUX.1-schnell, Apache-2.0):

```
HUGGINGFACE_API_KEY=...   # free token at https://hf.co/settings/tokens
AI_IMAGE_PROVIDER=huggingface
```

Most popular image models (FLUX included) have moved off Hugging Face's own
free `hf-inference` backend onto paid third-party providers (fal-ai,
together, replicate, ...) — those aren't free. The default model here,
`stabilityai/stable-diffusion-3-medium-diffusers`, is one of the few still
actually hosted on `hf-inference`. It's gated (auto-approved): visit its
[model page](https://huggingface.co/stabilityai/stable-diffusion-3-medium-diffusers)
and click "Agree", logged in as the account that owns your token, before it
will work.

Free-tier inference is rate-limited and can be slower / lower quality than
`gpt-image-1`, but costs nothing. Switch back by setting `AI_IMAGE_PROVIDER=openai`.

## Architecture notes

- **AI providers are swappable.** `src/lib/ai/factory.ts` picks the LLM/image
  provider from `AI_LLM_PROVIDER` / `AI_IMAGE_PROVIDER` env vars. Add a new
  adapter implementing `LLMProvider` or `ImageGenerationProvider`
  (`src/lib/ai/types.ts`) to switch providers later.
- **Prisma 7** requires a driver adapter at runtime (no more `url` in the
  `datasource` block) — see `prisma.config.ts` (CLI/migrate connection) and
  `src/lib/db.ts` (`@prisma/adapter-pg` for the runtime client).
- Generated frame images are written to `public/generated/{projectId}/{frameId}.png`
  (gitignored). Out of MVP scope: swap this for S3/R2 later.
