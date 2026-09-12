/**
 * Translation dictionaries for the marketing site, auth pages, and dashboard
 * shell (sidebar/topbar chrome). Deeper dashboard feature pages (CV editor,
 * job editor, applications table, badges catalog, admin) remain French-only
 * for now — see the language switcher's usage sites for exactly what's
 * wired up to read from here.
 */

const fr = {
  meta: {
    title: "CVMatch — Optimisez votre CV pour chaque offre d'emploi",
    description:
      "Adaptez votre CV aux offres d'emploi, améliorez votre compatibilité ATS et centralisez vos candidatures. Analyse de CV, matching automatique et suivi des candidatures propulsés par l'IA.",
  },
  nav: {
    login: "Se connecter",
    register: "Commencer gratuitement",
    pricing: "Tarifs",
    dashboard: "Tableau de bord",
  },
  hero: {
    eyebrow: "L'IA qui adapte votre CV à chaque offre d'emploi",
    titleLine1: "Décrochez plus d'entretiens.",
    titleLine2: "Sans y passer vos soirées.",
    description:
      "CVMatch analyse chaque offre, adapte votre CV aux mots-clés recherchés et centralise toutes vos candidatures — pour postuler plus, mieux, et plus vite.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Se connecter",
    ctaAuthenticated: "Accéder à mon tableau de bord",
  },
  heroShowcase: {
    cv: {
      tabLabel: "Mon CV",
      name: "Camille Dubois",
      title: "Développeuse Frontend",
      experienceLabel: "Expérience",
      experience1: "Développeuse Frontend — NovaSoft",
      experience2: "Stage développement web — StudioPixel",
      skillsLabel: "Compétences",
      doneLabel: "CV importé",
    },
    job: {
      tabLabel: "Nouvelle offre",
      pasteLabel: "Coller le lien de l'offre…",
      jobTitle: "Développeur Frontend",
      jobCompany: "TechCorp",
      jobLocation: "Paris, France · Hybride",
      doneLabel: "Offre importée",
    },
    ats: {
      tabLabel: "Analyse ATS",
      subtitle: "Offre TechCorp — Développeur Frontend",
      matchedLabel: "Compétences correspondantes",
      missingLabel: "Compétences manquantes",
    },
    tracking: {
      tabLabel: "Mes candidatures",
      activeLabel: "candidatures actives",
      company1: "TechCorp",
      company2: "Innovatech",
      company3: "Digital Solutions",
      statusSent: "Envoyée",
      statusInterview: "Entretien",
      statusReplied: "Répondu",
    },
  },
  problem: {
    title: "Chercher un emploi ne devrait pas être un travail à temps plein",
    points: [
      {
        title: "Un CV générique, filtré avant d'être lu",
        description:
          "Le même CV envoyé partout ne reprend jamais les mots-clés exacts de l'offre — beaucoup sont écartés par les logiciels de tri avant qu'un recruteur ne les voie.",
      },
      {
        title: "Adapter un CV à la main prend du temps",
        description:
          "Relire l'offre, repérer les compétences attendues, réécrire le résumé et réordonner les expériences — pour chaque candidature, à chaque fois.",
      },
      {
        title: "Le suivi se perd entre onglets et fichiers",
        description:
          "Sans centralisation, difficile de savoir où vous en êtes : quelles offres, quel CV envoyé, quelle entreprise déjà contactée.",
      },
    ],
  },
  howItWorks: {
    title: "Comment ça marche",
    description: "Cinq étapes pour passer de l'offre à la candidature.",
    steps: [
      { title: "Importez votre CV", description: "Ajoutez votre CV principal en quelques secondes." },
      { title: "Trouvez une offre", description: "Renseignez ou importez l'offre qui vous intéresse." },
      { title: "Adaptez votre CV", description: "Ajustez votre CV aux critères de l'offre." },
      { title: "Postulez", description: "Envoyez votre candidature en toute confiance." },
      { title: "Suivez votre candidature", description: "Gardez une vue d'ensemble sur vos candidatures." },
    ],
  },
  features: {
    title: "Tout ce qu'il faut pour une recherche organisée",
    description: "Des outils concrets, pas des promesses.",
    items: [
      { title: "Analyse ATS", description: "Mesurez la compatibilité de votre CV avec chaque offre, avec un score détaillé et des recommandations." },
      { title: "CV sur mesure", description: "Générez une version de votre CV adaptée à chaque poste, sans jamais inventer une expérience." },
      { title: "Bibliothèque de CV", description: "Gérez plusieurs versions de votre CV et marquez vos favorites pour les retrouver en un clic." },
      { title: "Suivi des candidatures", description: "Centralisez l'état de chacune de vos candidatures, de l'envoi jusqu'à la réponse." },
      { title: "Import instantané", description: "Importez une offre depuis un lien ou un texte collé — elle est structurée automatiquement." },
      { title: "Objectifs quotidiens", description: "Fixez-vous un nombre de candidatures par jour et suivez votre progression en temps réel." },
      { title: "Récompenses", description: "Débloquez des badges au fil de votre recherche, avec des crédits bonus à la clé." },
      { title: "Alertes de doublons", description: "Soyez averti si vous avez déjà postulé chez une entreprise avant de recandidater." },
    ],
  },
  productPreview: {
    title: "Voyez exactement où vous en êtes",
    description: "Un aperçu de l'analyse de compatibilité que vous obtenez pour chaque offre.",
    exampleLabel: "Compatibilité ATS — exemple",
    summary:
      "Bonne compatibilité — votre profil couvre la majorité des critères recherchés pour ce poste de Développeur Frontend.",
    matched: "Compétences correspondantes",
    missing: "Compétences manquantes",
    generated: "Généré automatiquement à partir de votre CV et de l'offre",
  },
  pricingTeaser: {
    title: "Des forfaits simples, sans surprise",
    description: "Commencez gratuitement, évoluez quand votre recherche s'intensifie.",
    cta: "Voir le détail des forfaits",
  },
  cta: {
    title: "Prêt à optimiser votre prochaine candidature ?",
    button: "Créer mon compte",
    buttonAuthenticated: "Accéder à mon tableau de bord",
  },
  footer: {
    links: {
      features: "Fonctionnalités",
      pricing: "Tarifs",
      blog: "Blog",
      about: "À propos",
      contact: "Contact",
      privacy: "Confidentialité",
      terms: "Conditions d'utilisation",
    },
    manageCookies: "Gérer les cookies",
  },
  auth: {
    login: {
      title: "Se connecter",
      description: "Accédez à votre tableau de bord CVMatch.",
      email: "E-mail",
      password: "Mot de passe",
      submit: "Se connecter",
      submitting: "Connexion...",
      noAccount: "Pas encore de compte ?",
      createAccount: "Créer un compte",
    },
    register: {
      title: "Créer un compte",
      description: "Commencez à optimiser vos candidatures gratuitement.",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Créer mon compte",
      submitting: "Création du compte...",
      hasAccount: "Déjà un compte ?",
      login: "Se connecter",
      checkEmailTitle: "Vérifiez votre boîte mail",
      checkEmailDescription:
        "Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour activer votre compte et accéder à votre tableau de bord.",
    },
  },
  dashboardShell: {
    groups: {
      workspace: "Espace de travail",
      tools: "Outils",
      account: "Compte",
      admin: "Administration",
    },
    links: {
      dashboard: "Dashboard",
      cv: "Mon CV",
      jobs: "Offres",
      applications: "Candidatures",
      badges: "Récompenses",
      billing: "Facturation",
      profile: "Profil",
      admin: "Administration",
    },
    creditsRemaining: "{count} crédits restants",
    creditsUnlimited: "Crédits illimités",
    userMenu: {
      account: "Mon compte",
      profile: "Profil",
      logout: "Se déconnecter",
    },
    theme: {
      light: "Clair",
      dark: "Sombre",
      system: "Système",
    },
  },
} satisfies Record<string, unknown>;

const en: typeof fr = {
  meta: {
    title: "CVMatch — Optimize your resume for every job",
    description:
      "Tailor your resume to job postings, improve your ATS compatibility, and keep all your applications in one place. AI-powered resume analysis, matching, and application tracking.",
  },
  nav: {
    login: "Log in",
    register: "Start for free",
    pricing: "Pricing",
    dashboard: "Dashboard",
  },
  hero: {
    eyebrow: "The AI that tailors your resume to every job posting",
    titleLine1: "Land more interviews.",
    titleLine2: "Without giving up your evenings.",
    description:
      "CVMatch analyzes every job posting, tailors your resume to the keywords that matter, and keeps every application in one place — so you can apply more, better, and faster.",
    ctaPrimary: "Start for free",
    ctaSecondary: "Log in",
    ctaAuthenticated: "Go to my dashboard",
  },
  heroShowcase: {
    cv: {
      tabLabel: "My resume",
      name: "Camille Dubois",
      title: "Frontend Developer",
      experienceLabel: "Experience",
      experience1: "Frontend Developer — NovaSoft",
      experience2: "Web development intern — StudioPixel",
      skillsLabel: "Skills",
      doneLabel: "Resume imported",
    },
    job: {
      tabLabel: "New job posting",
      pasteLabel: "Paste the job posting link…",
      jobTitle: "Frontend Developer",
      jobCompany: "TechCorp",
      jobLocation: "Paris, France · Hybrid",
      doneLabel: "Posting imported",
    },
    ats: {
      tabLabel: "ATS analysis",
      subtitle: "TechCorp posting — Frontend Developer",
      matchedLabel: "Matched skills",
      missingLabel: "Missing skills",
    },
    tracking: {
      tabLabel: "My applications",
      activeLabel: "active applications",
      company1: "TechCorp",
      company2: "Innovatech",
      company3: "Digital Solutions",
      statusSent: "Sent",
      statusInterview: "Interview",
      statusReplied: "Replied",
    },
  },
  problem: {
    title: "Job hunting shouldn't be a full-time job",
    points: [
      {
        title: "A generic resume, filtered before it's even read",
        description:
          "The same resume sent everywhere never matches a posting's exact keywords — many get screened out by applicant tracking systems before a recruiter ever sees them.",
      },
      {
        title: "Tailoring a resume by hand takes time",
        description:
          "Re-reading the posting, spotting the expected skills, rewriting the summary, reordering experience — for every single application, every time.",
      },
      {
        title: "Tracking gets lost across tabs and files",
        description:
          "Without a central place, it's hard to know where you stand: which postings, which resume version was sent, which company you already contacted.",
      },
    ],
  },
  howItWorks: {
    title: "How it works",
    description: "Five steps from job posting to application.",
    steps: [
      { title: "Import your resume", description: "Add your master resume in a few seconds." },
      { title: "Find a job posting", description: "Paste or import the posting you're interested in." },
      { title: "Tailor your resume", description: "Adjust your resume to the posting's requirements." },
      { title: "Apply", description: "Send your application with confidence." },
      { title: "Track your application", description: "Keep a clear overview of all your applications." },
    ],
  },
  features: {
    title: "Everything you need for an organized job search",
    description: "Concrete tools, not promises.",
    items: [
      { title: "ATS analysis", description: "Measure your resume's compatibility with each posting, with a detailed score and recommendations." },
      { title: "Tailored resumes", description: "Generate a version of your resume tailored to each role, without ever inventing an experience." },
      { title: "Resume library", description: "Manage multiple versions of your resume and star your favorites to find them instantly." },
      { title: "Application tracking", description: "Centralize the status of every application, from sent to response." },
      { title: "Instant import", description: "Import a posting from a link or pasted text — it's structured automatically." },
      { title: "Daily goals", description: "Set a daily application target and track your progress in real time." },
      { title: "Rewards", description: "Unlock badges as you search, with bonus credits along the way." },
      { title: "Duplicate alerts", description: "Get warned if you've already applied to a company before reapplying." },
    ],
  },
  productPreview: {
    title: "See exactly where you stand",
    description: "A preview of the compatibility analysis you get for every job posting.",
    exampleLabel: "ATS compatibility — example",
    summary:
      "Good match — your profile covers most of the criteria this Frontend Developer role is looking for.",
    matched: "Matched skills",
    missing: "Missing skills",
    generated: "Generated automatically from your resume and the job posting",
  },
  pricingTeaser: {
    title: "Simple plans, no surprises",
    description: "Start for free, upgrade as your search picks up.",
    cta: "See full plan details",
  },
  cta: {
    title: "Ready to optimize your next application?",
    button: "Create my account",
    buttonAuthenticated: "Go to my dashboard",
  },
  footer: {
    links: {
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms of service",
    },
    manageCookies: "Manage cookies",
  },
  auth: {
    login: {
      title: "Log in",
      description: "Access your CVMatch dashboard.",
      email: "Email",
      password: "Password",
      submit: "Log in",
      submitting: "Logging in...",
      noAccount: "No account yet?",
      createAccount: "Create an account",
    },
    register: {
      title: "Create an account",
      description: "Start optimizing your applications for free.",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      submit: "Create my account",
      submitting: "Creating account...",
      hasAccount: "Already have an account?",
      login: "Log in",
      checkEmailTitle: "Check your inbox",
      checkEmailDescription:
        "We've sent you a confirmation link. Click it to activate your account and access your dashboard.",
    },
  },
  dashboardShell: {
    groups: {
      workspace: "Workspace",
      tools: "Tools",
      account: "Account",
      admin: "Admin",
    },
    links: {
      dashboard: "Dashboard",
      cv: "My Resume",
      jobs: "Job Postings",
      applications: "Applications",
      badges: "Rewards",
      billing: "Billing",
      profile: "Profile",
      admin: "Admin",
    },
    creditsRemaining: "{count} credits remaining",
    creditsUnlimited: "Unlimited credits",
    userMenu: {
      account: "My account",
      profile: "Profile",
      logout: "Log out",
    },
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
};

export const dictionaries = { fr, en };
export type Dictionary = typeof fr;
