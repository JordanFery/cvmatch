import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";
import { llmCvSchema, llmToParsedCv } from "@/lib/cv/llm-schema";
import { reportError } from "@/lib/monitoring/alert";

// Enforced by the "server-only" import above (build fails if a Client
// Component ends up pulling this module in) — the API key never reaches the browser.
//
// Lazily constructed — see src/lib/stripe.ts for why: a top-level `new
// Anthropic()` would run during Next.js's build-time page-data-collection
// pass and crash the whole build if ANTHROPIC_API_KEY isn't set in that
// environment, even though this module never actually runs at build time.
let client: Anthropic | undefined;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const MAX_INPUT_CHARS = 20000;

const SYSTEM_PROMPT = `You extract structured resume data from raw text into the given JSON schema.

Hard rules — never break these:
- Never invent, infer, guess, or embellish any information that is not explicitly present in the source text.
- If a field's value is not present in the text, set it to "" (empty string, for scalar fields) or an empty array (for list fields). Do not omit fields to avoid this.
- Do not add skills, technologies, tools, or achievements that are not explicitly mentioned in the text, even if they seem implied by a job title or industry.
- Preserve dates exactly as they appear in the source (e.g. "2024", "Jan 2024", "01/2024"). Do not normalize, guess, or fill in a day/month that isn't stated.
- Preserve the candidate's own wording for job titles, company names, and descriptions rather than paraphrasing.
- If the resume text is truncated, garbled, or clearly not a resume, still return the schema with whatever real information you can find and ""/[] for the rest — do not fabricate a plausible-looking resume to fill gaps.
- Anything you cannot confidently place into an existing section (unrecognized headings, extra content) goes into customSections as {title, content} — never drop information from the source silently.`;

/**
 * Sends extracted resume text to Claude and returns it as validated,
 * schema-conformant structured data. Returns `null` if the model's output
 * doesn't validate after a retry, or if the request itself fails — the
 * caller is expected to mark the CV as FAILED and let the user fill the
 * review form in manually rather than surface an error message to them.
 */
export async function parseCvWithLlm(rawText: string): Promise<ParsedCv | null> {
  const text = rawText.slice(0, MAX_INPUT_CHARS);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await getClient().messages.parse({
        model: "claude-opus-5",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        output_config: {
          effort: "medium",
          format: zodOutputFormat(llmCvSchema),
        },
        messages: [
          {
            role: "user",
            content: `Extract this resume's content into the schema. Resume text follows, delimited by <resume_text> tags:\n\n<resume_text>\n${text}\n</resume_text>`,
          },
        ],
      });

      if (response.parsed_output) {
        const converted = llmToParsedCv(response.parsed_output);
        const validated = parsedCvSchema.safeParse(converted);
        if (validated.success) {
          return validated.data;
        }
        console.error(`[cv] LLM output converted but failed app schema validation:`, validated.error);
      }
    } catch (error) {
      console.error(`[cv] LLM parse attempt ${attempt + 1} failed:`, error);
    }
  }

  reportError("cv-parse", "all attempts exhausted");
  return null;
}
