import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { parsedCvSchema, type ParsedCv } from "@/lib/validations/cv";
import { llmCvSchema, llmToParsedCv, parsedCvToLlm } from "@/lib/cv/llm-schema";
import { formatCvForAnalysis, formatJobOfferForAnalysis } from "@/lib/ats/format";
import type { JobOfferData } from "@/lib/validations/job-offer";
import type { AtsAnalysisData } from "@/lib/validations/ats-analysis";
import { reportError } from "@/lib/monitoring/alert";

// Enforced by the "server-only" import above (build fails if a Client
// Component ends up pulling this module in) — never rely on the comment alone.
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

const SYSTEM_PROMPT = `You tailor a candidate's master CV for a specific job posting, returning the full CV in the given JSON schema.

Hard rules — never break these:
- Never invent, add, or imply an employer, job title, degree, certification, skill, technology, project, or achievement that is not already present in the source CV. Tailoring means reordering, re-prioritizing, and rewording — never fabricating.
- Every experience, education entry, certification, and project from the source CV must still appear in the output. You may reorder them (most relevant to this job first) but never delete one.
- You may reword the summary and experience descriptions/achievements to use terminology and emphasis that better match the job posting — but only to describe the same underlying facts more clearly for this audience. Do not change what was actually done, the technologies actually used, or invent metrics.
- You may reorder items within each skills category (technical, tools, frameworks, etc.) to put job-relevant ones first, and reorder achievements/technologies within an experience — but do not add or remove any skill or technology that wasn't already listed somewhere in the source CV.
- The summary should be rewritten as a short, honest pitch connecting the candidate's real background to this specific role.
- If a field was empty ("") or an array was empty in the source CV, it's fine for it to stay that way — do not fill it in with invented content.
- Preserve dates and contact information exactly as given in the source CV.`;

/**
 * Produces a version of the CV reordered/reworded for a specific job
 * posting. Returns `null` if the model's output doesn't validate after a
 * retry, or the request fails.
 */
export async function generateTailoredCv(
  sourceCv: ParsedCv,
  jobOffer: JobOfferData,
  atsAnalysis: AtsAnalysisData | null,
): Promise<ParsedCv | null> {
  const cvText = formatCvForAnalysis(sourceCv);
  const jobText = formatJobOfferForAnalysis(jobOffer);
  const sourceLlmCv = parsedCvToLlm(sourceCv);

  const gapsNote = atsAnalysis?.missingSkills.length
    ? `\n\nNote: an ATS analysis found these job-required skills are not demonstrated anywhere in the CV: ${atsAnalysis.missingSkills.join(", ")}. Do not add them — they are listed only so you don't waste emphasis pretending the CV covers them.`
    : "";

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await getClient().messages.parse({
        model: "claude-opus-5",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        output_config: {
          effort: "high",
          format: zodOutputFormat(llmCvSchema),
        },
        messages: [
          {
            role: "user",
            content: `Tailor this CV for the job posting below. Return the complete CV — every section, reordered and reworded for this role.\n\n<cv_summary_for_context>\n${cvText}\n</cv_summary_for_context>\n\n<cv_full_source_json>\n${JSON.stringify(sourceLlmCv)}\n</cv_full_source_json>\n\n<job_posting>\n${jobText}\n</job_posting>${gapsNote}`,
          },
        ],
      });

      if (response.parsed_output) {
        const converted = llmToParsedCv(response.parsed_output);
        const validated = parsedCvSchema.safeParse(converted);
        if (validated.success) {
          return validated.data;
        }
        console.error("[tailored-cv] LLM output failed app schema validation:", validated.error);
      }
    } catch (error) {
      console.error(`[tailored-cv] generation attempt ${attempt + 1} failed:`, error);
    }
  }

  reportError("tailored-cv", "all attempts exhausted");
  return null;
}
