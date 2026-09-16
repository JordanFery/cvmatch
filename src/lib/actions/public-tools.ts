"use server";

import { parseCvWithLlm } from "@/lib/cv/parse-with-llm";
import { parseJobOfferWithLlm } from "@/lib/jobs/parse-with-llm";
import { analyzeAtsCompatibility } from "@/lib/ats/analyze-with-llm";
import { clientIp, tryReserveSlot } from "@/lib/rate-limit";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import type { AtsAnalysisData } from "@/lib/validations/ats-analysis";

// Free, no-login entry point for the public ATS score tool (see the SEO
// growth plan — "free tool as an acquisition surface"). Deliberately
// separate from src/lib/actions/ats-analysis.ts: that one is credit-metered
// and tied to a saved CV/job offer; this one runs the same underlying
// engine anonymously, so it needs its own (tighter) abuse controls instead
// of the credits ledger.
const FREE_USES_PER_IP_PER_DAY = 3;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_TEXT_LENGTH = 20000;

type ToolResult =
  | { error: string; rateLimited?: boolean }
  | { success: true; data: AtsAnalysisData };

const MESSAGES: Record<Locale, { rateLimited: string; tooShort: string; tooLong: string; cvFailed: string; jobFailed: string; analysisFailed: string }> = {
  fr: {
    rateLimited: "Vous avez atteint la limite d'essais gratuits pour aujourd'hui. Créez un compte gratuit pour continuer à analyser vos candidatures.",
    tooShort: "Merci de coller un texte plus complet pour obtenir une analyse fiable.",
    tooLong: "Ce texte est trop long — merci de le raccourcir.",
    cvFailed: "Nous n'avons pas réussi à lire ce CV. Vérifiez qu'il s'agit bien de texte de CV et réessayez.",
    jobFailed: "Nous n'avons pas réussi à lire cette offre d'emploi. Réessayez avec le texte complet de l'annonce.",
    analysisFailed: "L'analyse a échoué. Vous pouvez réessayer.",
  },
  en: {
    rateLimited: "You've reached today's free-trial limit. Create a free account to keep analyzing your applications.",
    tooShort: "Please paste more complete text for a reliable analysis.",
    tooLong: "This text is too long — please shorten it.",
    cvFailed: "We couldn't read this resume. Check that it's actual resume text and try again.",
    jobFailed: "We couldn't read this job posting. Try again with the full text of the listing.",
    analysisFailed: "The analysis failed. You can try again.",
  },
};

export async function runPublicAtsScoreAction(
  cvText: string,
  jobText: string,
  locale: string,
): Promise<ToolResult> {
  const loc = isLocale(locale) ? locale : defaultLocale;
  const t = MESSAGES[loc];

  if (cvText.trim().length < 50 || jobText.trim().length < 50) {
    return { error: t.tooShort };
  }
  if (cvText.length > MAX_TEXT_LENGTH || jobText.length > MAX_TEXT_LENGTH) {
    return { error: t.tooLong };
  }

  const ip = await clientIp();
  // Fails closed for "unknown" IP (local/no-proxy dev) is the wrong default
  // here unlike signup — this endpoint has no account behind it to fall
  // back on, so an untraceable caller is rate-limited too rather than
  // getting unlimited free runs.
  const allowed = await tryReserveSlot("ats-score-tool", ip, FREE_USES_PER_IP_PER_DAY, RATE_LIMIT_WINDOW_MS);
  if (!allowed) {
    return { error: t.rateLimited, rateLimited: true };
  }

  const cv = await parseCvWithLlm(cvText);
  if (!cv) return { error: t.cvFailed };

  const jobOffer = await parseJobOfferWithLlm(jobText);
  if (!jobOffer) return { error: t.jobFailed };

  const result = await analyzeAtsCompatibility(cv, jobOffer, loc);
  if (!result) return { error: t.analysisFailed };

  return { success: true, data: result };
}
