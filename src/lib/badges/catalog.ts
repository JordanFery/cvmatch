import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  FileText,
  Search,
  ScanSearch,
  Wand2,
  Send,
  Rocket,
  Flame,
  Trophy,
  Medal,
  PartyPopper,
  Gem,
  Crown,
  Star,
} from "lucide-react";

export type BadgeStats = {
  cvCount: number;
  jobOfferCount: number;
  atsAnalysisCount: number;
  tailoredCvCount: number;
  sentApplicationsCount: number;
  interviewCount: number;
  creditsUsedLifetime: number;
};

export type BadgeCategory = "onboarding" | "applications" | "interviews" | "usage";

export type BadgeReward = { creditsBonus: number; description: string };

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: BadgeCategory;
  check: (stats: BadgeStats) => boolean;
  /** Progress towards the badge, for locked badges that track a countable metric. */
  progress: (stats: BadgeStats) => { current: number; target: number };
  /** A tangible reward granted the moment the badge is earned — the first step towards bigger rewards (e.g. a free month) at higher lifetime-usage tiers. */
  reward?: BadgeReward;
};

/**
 * The full badge catalog. Anecdotal "first time" badges cost nothing and
 * reward early engagement; usage- and application-volume badges scale up to
 * real credit rewards, framed as a path towards a future "free month" perk
 * at the highest lifetime-usage tiers. See checkAndAwardBadges in
 * src/lib/badges/check.ts for how these are evaluated and granted.
 */
export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: "first_cv",
    name: "Premier pas",
    description: "Importer votre premier CV.",
    icon: FileText,
    category: "onboarding",
    check: (s) => s.cvCount >= 1,
    progress: (s) => ({ current: Math.min(s.cvCount, 1), target: 1 }),
  },
  {
    id: "first_job_offer",
    name: "En chasse",
    description: "Importer votre première offre d'emploi.",
    icon: Search,
    category: "onboarding",
    check: (s) => s.jobOfferCount >= 1,
    progress: (s) => ({ current: Math.min(s.jobOfferCount, 1), target: 1 }),
  },
  {
    id: "first_ats_analysis",
    name: "Détective ATS",
    description: "Lancer votre première analyse de compatibilité ATS.",
    icon: ScanSearch,
    category: "onboarding",
    check: (s) => s.atsAnalysisCount >= 1,
    progress: (s) => ({ current: Math.min(s.atsAnalysisCount, 1), target: 1 }),
  },
  {
    id: "first_tailored_cv",
    name: "Sur mesure",
    description: "Générer votre premier CV adapté.",
    icon: Wand2,
    category: "onboarding",
    check: (s) => s.tailoredCvCount >= 1,
    progress: (s) => ({ current: Math.min(s.tailoredCvCount, 1), target: 1 }),
  },
  {
    id: "first_application",
    name: "C'est parti !",
    description: "Envoyer votre première candidature.",
    icon: Send,
    category: "applications",
    check: (s) => s.sentApplicationsCount >= 1,
    progress: (s) => ({ current: Math.min(s.sentApplicationsCount, 1), target: 1 }),
  },
  {
    id: "applications_5",
    name: "En rythme",
    description: "Envoyer 5 candidatures.",
    icon: Rocket,
    category: "applications",
    check: (s) => s.sentApplicationsCount >= 5,
    progress: (s) => ({ current: Math.min(s.sentApplicationsCount, 5), target: 5 }),
  },
  {
    id: "applications_25",
    name: "Persévérant",
    description: "Envoyer 25 candidatures.",
    icon: Flame,
    category: "applications",
    check: (s) => s.sentApplicationsCount >= 25,
    progress: (s) => ({ current: Math.min(s.sentApplicationsCount, 25), target: 25 }),
    reward: { creditsBonus: 5, description: "+5 crédits offerts" },
  },
  {
    id: "applications_50",
    name: "Machine de guerre",
    description: "Envoyer 50 candidatures.",
    icon: Trophy,
    category: "applications",
    check: (s) => s.sentApplicationsCount >= 50,
    progress: (s) => ({ current: Math.min(s.sentApplicationsCount, 50), target: 50 }),
    reward: { creditsBonus: 10, description: "+10 crédits offerts" },
  },
  {
    id: "applications_100",
    name: "Centurion",
    description: "Envoyer 100 candidatures.",
    icon: Crown,
    category: "applications",
    check: (s) => s.sentApplicationsCount >= 100,
    progress: (s) => ({ current: Math.min(s.sentApplicationsCount, 100), target: 100 }),
    reward: { creditsBonus: 25, description: "+25 crédits offerts" },
  },
  {
    id: "interview_1",
    name: "Ça mord !",
    description: "Décrocher votre premier entretien.",
    icon: PartyPopper,
    category: "interviews",
    check: (s) => s.interviewCount >= 1,
    progress: (s) => ({ current: Math.min(s.interviewCount, 1), target: 1 }),
  },
  {
    id: "interview_5",
    name: "Demandé(e)",
    description: "Décrocher 5 entretiens.",
    icon: Medal,
    category: "interviews",
    check: (s) => s.interviewCount >= 5,
    progress: (s) => ({ current: Math.min(s.interviewCount, 5), target: 5 }),
    reward: { creditsBonus: 10, description: "+10 crédits offerts" },
  },
  {
    id: "credits_used_50",
    name: "Utilisateur assidu",
    description: "Utiliser 50 crédits au total sur CVMatch.",
    icon: Star,
    category: "usage",
    check: (s) => s.creditsUsedLifetime >= 50,
    progress: (s) => ({ current: Math.min(s.creditsUsedLifetime, 50), target: 50 }),
    reward: { creditsBonus: 5, description: "+5 crédits offerts" },
  },
  {
    id: "credits_used_150",
    name: "Power user",
    description: "Utiliser 150 crédits au total sur CVMatch.",
    icon: Gem,
    category: "usage",
    check: (s) => s.creditsUsedLifetime >= 150,
    progress: (s) => ({ current: Math.min(s.creditsUsedLifetime, 150), target: 150 }),
    reward: { creditsBonus: 15, description: "+15 crédits offerts" },
  },
  {
    id: "credits_used_400",
    name: "Légende CVMatch",
    description: "Utiliser 400 crédits au total — le prochain palier débloquera un mois gratuit.",
    icon: Sparkles,
    category: "usage",
    check: (s) => s.creditsUsedLifetime >= 400,
    progress: (s) => ({ current: Math.min(s.creditsUsedLifetime, 400), target: 400 }),
    reward: { creditsBonus: 40, description: "+40 crédits offerts" },
  },
];

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  onboarding: "Débuts",
  applications: "Candidatures",
  interviews: "Entretiens",
  usage: "Utilisation",
};

export const BADGE_CATEGORY_ORDER: BadgeCategory[] = ["onboarding", "applications", "interviews", "usage"];
