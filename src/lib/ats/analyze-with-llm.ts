import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { atsAnalysisDataSchema, type AtsAnalysisData } from "@/lib/validations/ats-analysis";
import { formatCvForAnalysis, formatJobOfferForAnalysis } from "@/lib/ats/format";
import type { ParsedCv } from "@/lib/validations/cv";
import type { JobOfferData } from "@/lib/validations/job-offer";
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

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) compatibility analyst. You compare a candidate's CV against a job posting and report how well they match, using only the information given.

Hard rules — never break these:
- Write every text field (summary, strengths, gaps, recommendations) in French, regardless of what language the CV or job posting are written in. Keep proper nouns, technology/tool names, and skill names exactly as they're commonly written (e.g. "React", "Google Analytics") rather than translating them.
- Base every finding strictly on the CV and job posting text provided. Never invent skills, experience, or requirements that aren't stated in either document.
- matchedSkills: skills/technologies/qualifications the job asks for that the CV genuinely demonstrates (from experience, skills lists, or projects).
- missingSkills: skills/technologies/qualifications the job explicitly asks for (requirements or key skills) that the CV does not demonstrate anywhere. Do not list a skill as missing if it only appears in "nice to have" and the CV shows related/transferable experience — use judgment, but stay grounded in what's written.
- strengths: concrete ways this candidate's actual background aligns well with this specific role — reference real items from the CV.
- gaps: concrete, real shortfalls relative to this specific posting — not generic career advice.
- recommendations: 3-5 specific, actionable suggestions for how the candidate could improve their match for THIS posting (e.g. highlight a specific existing experience differently, learn a specific missing tool) — grounded in the actual gap, not generic platitudes.
- score: an integer 0-100 reflecting overall fit, weighted mainly by how many hard requirements and key skills are covered. A score of 100 means the CV covers essentially everything asked; a low score means major required skills/experience are absent. Be honest and calibrated, not inflated.
- summary: 2-3 sentences giving the candidate a clear, honest read on their fit for this role.`;

/**
 * Compares structured CV data against a structured job offer and returns a
 * validated ATS-style compatibility analysis. Returns `null` if the model's
 * output doesn't validate after a retry, or the request fails.
 */
export async function analyzeAtsCompatibility(cv: ParsedCv, jobOffer: JobOfferData): Promise<AtsAnalysisData | null> {
  const cvText = formatCvForAnalysis(cv);
  const jobText = formatJobOfferForAnalysis(jobOffer);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await getClient().messages.parse({
        model: "claude-opus-5",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        output_config: {
          effort: "medium",
          format: zodOutputFormat(atsAnalysisDataSchema),
        },
        messages: [
          {
            role: "user",
            content: `Compare this candidate's CV against this job posting.\n\n<cv>\n${cvText}\n</cv>\n\n<job_posting>\n${jobText}\n</job_posting>`,
          },
        ],
      });

      if (response.parsed_output) {
        const validated = atsAnalysisDataSchema.safeParse(response.parsed_output);
        if (validated.success) {
          return validated.data;
        }
        console.error("[ats] LLM output failed schema validation:", validated.error);
      }
    } catch (error) {
      console.error(`[ats] analysis attempt ${attempt + 1} failed:`, error);
    }
  }

  reportError("ats-analysis", "all attempts exhausted");
  return null;
}
