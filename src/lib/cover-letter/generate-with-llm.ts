import "server-only";
import Anthropic, { type ParsedMessage } from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { coverLetterDataSchema, type CoverLetterData } from "@/lib/validations/cover-letter";
import { formatCvForAnalysis, formatJobOfferForAnalysis } from "@/lib/ats/format";
import type { ParsedCv } from "@/lib/validations/cv";
import type { JobOfferData } from "@/lib/validations/job-offer";
import type { Locale } from "@/lib/i18n/config";
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

function systemPrompt(locale: Locale): string {
  const conventionsRule =
    locale === "fr"
      ? `Write the entire letter in French, following formal French business-letter conventions ("vous" throughout, "Madame, Monsieur," opening, a professional closing such as "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées." or "Cordialement," followed by the candidate's name).`
      : `Write the entire letter in English, following formal North American business-letter conventions ("Dear Hiring Manager," or the hiring contact's name if known, a professional closing such as "Sincerely," or "Best regards," followed by the candidate's name).`;
  const headerRule =
    locale === "fr"
      ? `Start the letter with a short header block: the candidate's name and the contact details actually given (only the ones present — never invent a missing one), the date given to you, the company name, and a line "Objet : Candidature au poste de {job title}". Then a blank line, then the salutation and body.`
      : `Start the letter with a short header block: the candidate's name and the contact details actually given (only the ones present — never invent a missing one), the date given to you, the company name, and a line "Re: Application for the {job title} position". Then a blank line, then the salutation and body.`;

  return `You write a personalized, professional cover letter for a candidate applying to a specific job posting.

Hard rules — never break these:
- ${conventionsRule}
- ${headerRule}
- Base every claim about the candidate strictly on the CV provided. Never invent skills, experience, achievements, or qualifications that aren't in the CV.
- Use the web_search and web_fetch tools to find genuine, current, relevant facts about the company — its mission, products/services, recent news, culture, values — ideally from the company's own official website. Use these facts to show authentic, specific interest in this company, not generic enthusiasm.
- Only state a company fact if you actually found it via search/fetch or it was already given in the job posting text. If search turns up nothing useful or reliable, write a strong letter anchored on the job posting and candidate fit alone — never invent or guess a company detail.
- companyInsights: list the specific factual points about the company you found via search/fetch and used in the letter. Empty array if none were found or used.
- Body: 3-4 paragraphs, roughly 250-400 words — why this company specifically (grounded in what you found), why this candidate fits this role (grounded in real CV content), and a brief call to action.
- content: the complete letter as a single string, ready to send, including the header block described above, with paragraphs separated by blank lines.`;
}

/**
 * Writes a cover letter for the given CV/job pairing. Searches the web for
 * genuine company facts to personalize it, grounding every company claim in
 * what was actually found (or in the job posting) — never fabricated.
 * Returns `null` if the model's output doesn't validate after a retry, or
 * the request fails.
 */
export async function generateCoverLetter(
  cv: ParsedCv,
  jobOffer: JobOfferData,
  companyName: string | null,
  sourceUrl: string | null,
  locale: Locale,
): Promise<CoverLetterData | null> {
  const cvText = formatCvForAnalysis(cv);
  const jobText = formatJobOfferForAnalysis(jobOffer);
  const candidateName = [cv.personalInfo.firstName, cv.personalInfo.lastName].filter(Boolean).join(" ") || "the candidate";
  const today = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long" }).format(new Date());

  const sourceUrlNote = sourceUrl
    ? `\n\nThe original job posting was found at this URL, which may help you identify the right company: ${sourceUrl}`
    : "";
  const companyNote = companyName
    ? `\n\nThe company's name is: ${companyName}. Search the web for this company to find real, current facts about it.`
    : "\n\nNo company name is given — do not guess one; write the letter without company-specific claims.";

  const userContent = `Write a cover letter for this candidate applying to this job posting. Today's date is ${today}.\n\n<cv>\n${cvText}\n</cv>\n\n<candidate_name>\n${candidateName}\n</candidate_name>\n\n<job_posting>\n${jobText}\n</job_posting>${companyNote}${sourceUrlNote}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let messages: Anthropic.MessageParam[] = [{ role: "user", content: userContent }];
      let finalResponse: ParsedMessage<CoverLetterData> | null = null;

      // Server tools (web_search/web_fetch) usually resolve within a single
      // call, but a long research turn can pause on an iteration limit —
      // resume by re-sending the paused assistant turn, per Anthropic's
      // server-tool docs. Bounded so a stuck loop can't run forever.
      for (let turn = 0; turn < 4; turn++) {
        const response = await getClient().messages.parse({
          model: "claude-opus-5",
          max_tokens: 4096,
          system: systemPrompt(locale),
          tools: [
            { type: "web_search_20260209", name: "web_search", max_uses: 3 },
            { type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 },
          ],
          output_config: {
            effort: "medium",
            format: zodOutputFormat(coverLetterDataSchema),
          },
          messages,
        });

        if (response.stop_reason === "pause_turn") {
          messages = [...messages, { role: "assistant", content: response.content }];
          continue;
        }

        finalResponse = response;
        break;
      }

      if (finalResponse?.parsed_output) {
        const validated = coverLetterDataSchema.safeParse(finalResponse.parsed_output);
        if (validated.success) {
          return validated.data;
        }
        console.error("[cover-letter] LLM output failed schema validation:", validated.error);
      }
    } catch (error) {
      console.error(`[cover-letter] generation attempt ${attempt + 1} failed:`, error);
    }
  }

  reportError("cover-letter", "all attempts exhausted");
  return null;
}
