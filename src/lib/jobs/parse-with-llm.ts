import "server-only";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { jobOfferDataSchema, type JobOfferData } from "@/lib/validations/job-offer";
import { reportError } from "@/lib/monitoring/alert";

// Enforced by the "server-only" import above (build fails if a Client
// Component ends up pulling this module in) — never rely on the comment alone.
const client = new Anthropic();

const MAX_INPUT_CHARS = 20000;

const SYSTEM_PROMPT = `You extract structured job posting data from raw text into the given JSON schema.

Hard rules — never break these:
- Never invent, infer, guess, or embellish any information that is not explicitly present in the source text.
- If a field's value is not present in the text, set it to "" (empty string, for scalar fields) or an empty array (for list fields). Do not omit fields to avoid this.
- Do not add skills, technologies, requirements, or responsibilities that are not explicitly mentioned in the text, even if they seem typical for this kind of role.
- keySkills should list concrete technologies, tools, languages, methodologies, and certifications explicitly named in the posting — not generic soft skills, unless the posting frames them as a requirement.
- requirements are must-have qualifications explicitly stated as required; niceToHave are qualifications explicitly framed as a plus/preferred/bonus. Do not guess which bucket an item belongs to if the text doesn't say — put ambiguous ones in requirements.
- Preserve the posting's own wording for the job title, company name, and responsibilities/requirements rather than paraphrasing.
- If the text is truncated, garbled, or clearly not a job posting, still return the schema with whatever real information you can find and ""/[] for the rest — do not fabricate a plausible-looking posting to fill gaps.`;

const str = z.string();
const strArray = z.array(z.string());

// Same lesson as src/lib/cv/parse-with-llm.ts: plain strings ("" for
// "not found") instead of nullable unions — deeply nested `anyOf` schemas
// blow up Anthropic's structured-output grammar compiler.
const llmJobOfferSchema = z.object({
  title: str,
  company: str,
  location: str,
  employmentType: str,
  remotePolicy: str,
  salaryRange: str,
  seniorityLevel: str,
  summary: str,
  responsibilities: strArray,
  requirements: strArray,
  niceToHave: strArray,
  keySkills: strArray,
});

type LlmJobOffer = z.infer<typeof llmJobOfferSchema>;

const n = (value: string): string | null => (value.trim() === "" ? null : value.trim());

function toJobOfferData(llm: LlmJobOffer): JobOfferData {
  return {
    title: n(llm.title),
    company: n(llm.company),
    location: n(llm.location),
    employmentType: n(llm.employmentType),
    remotePolicy: n(llm.remotePolicy),
    salaryRange: n(llm.salaryRange),
    seniorityLevel: n(llm.seniorityLevel),
    summary: n(llm.summary),
    responsibilities: llm.responsibilities,
    requirements: llm.requirements,
    niceToHave: llm.niceToHave,
    keySkills: llm.keySkills,
  };
}

/**
 * Structures raw job posting text with Claude. Returns `null` if the model's
 * output doesn't validate after a retry, or the request fails — the caller
 * marks the offer as FAILED and lets the user fill the review form manually.
 */
export async function parseJobOfferWithLlm(rawText: string): Promise<JobOfferData | null> {
  const text = rawText.slice(0, MAX_INPUT_CHARS);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.parse({
        model: "claude-opus-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        output_config: {
          effort: "medium",
          format: zodOutputFormat(llmJobOfferSchema),
        },
        messages: [
          {
            role: "user",
            content: `Extract this job posting's content into the schema. Posting text follows, delimited by <job_posting> tags:\n\n<job_posting>\n${text}\n</job_posting>`,
          },
        ],
      });

      if (response.parsed_output) {
        const converted = toJobOfferData(response.parsed_output);
        const validated = jobOfferDataSchema.safeParse(converted);
        if (validated.success) {
          return validated.data;
        }
        console.error("[job-offer] LLM output converted but failed app schema validation:", validated.error);
      }
    } catch (error) {
      console.error(`[job-offer] LLM parse attempt ${attempt + 1} failed:`, error);
    }
  }

  reportError("job-offer-parse", "all attempts exhausted");
  return null;
}
