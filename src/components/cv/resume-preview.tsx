import type { ParsedCv } from "@/lib/validations/cv";

function formatDateRange(start: string | null, end: string | null, current: boolean) {
  const from = start ?? "?";
  const to = current ? "Présent" : (end ?? "?");
  return `${from} — ${to}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      {children}
    </h2>
  );
}

/** Print-oriented, read-only resume layout — no app chrome, meant to be exported via the browser's print dialog. */
export function ResumePreview({ cv }: { cv: ParsedCv }) {
  const fullName = [cv.personalInfo.firstName, cv.personalInfo.lastName].filter(Boolean).join(" ");
  const contactLine = [
    cv.personalInfo.email,
    cv.personalInfo.phone,
    cv.personalInfo.location,
    cv.personalInfo.linkedinUrl,
    cv.personalInfo.portfolioUrl,
    cv.personalInfo.githubUrl,
  ]
    .filter(Boolean)
    .join(" · ");

  const skillGroups: { label: string; values: string[] }[] = [
    { label: "Techniques", values: cv.skills.technical },
    { label: "Outils", values: cv.skills.tools },
    { label: "Frameworks", values: cv.skills.frameworks },
    { label: "Bases de données", values: cv.skills.databases },
    { label: "Savoir-être", values: cv.skills.soft },
    { label: "Autres", values: cv.skills.other },
  ].filter((group) => group.values.length > 0);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 text-neutral-900 print:p-0">
      <header className="mb-6 border-b border-neutral-300 pb-4 text-center">
        <h1 className="text-2xl font-semibold">{fullName || "—"}</h1>
        {cv.personalInfo.title && <p className="mt-1 text-neutral-600">{cv.personalInfo.title}</p>}
        {contactLine && <p className="mt-2 text-xs text-neutral-500">{contactLine}</p>}
      </header>

      {cv.summary && (
        <section className="mb-6">
          <SectionTitle>Résumé</SectionTitle>
          <p className="text-sm leading-relaxed">{cv.summary}</p>
        </section>
      )}

      {cv.experiences.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Expériences</SectionTitle>
          <div className="space-y-4">
            {cv.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-medium">
                    {exp.jobTitle ?? "—"}
                    {exp.company && <span className="font-normal text-neutral-600"> · {exp.company}</span>}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                </div>
                {exp.location && <p className="text-xs text-neutral-500">{exp.location}</p>}
                {exp.description && <p className="mt-1 text-sm leading-relaxed">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm leading-relaxed">
                    {exp.achievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies.length > 0 && (
                  <p className="mt-1 text-xs text-neutral-500">{exp.technologies.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.education.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Formation</SectionTitle>
          <div className="space-y-3">
            {cv.education.map((edu, index) => (
              <div key={index}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-medium">
                    {[edu.degree, edu.field].filter(Boolean).join(", ") || "—"}
                    {edu.school && <span className="font-normal text-neutral-600"> · {edu.school}</span>}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                </div>
                {edu.description && <p className="mt-1 text-sm leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skillGroups.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Compétences</SectionTitle>
          <div className="space-y-1 text-sm">
            {skillGroups.map((group) => (
              <p key={group.label}>
                <span className="font-medium">{group.label} : </span>
                {group.values.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {cv.projects.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Projets</SectionTitle>
          <div className="space-y-3">
            {cv.projects.map((project, index) => (
              <div key={index}>
                <p className="text-sm font-medium">{project.name ?? "—"}</p>
                {project.description && <p className="text-sm leading-relaxed">{project.description}</p>}
                {project.technologies.length > 0 && (
                  <p className="text-xs text-neutral-500">{project.technologies.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="space-y-0.5 text-sm">
            {cv.certifications.map((cert, index) => (
              <li key={index}>
                {[cert.name, cert.organization, cert.date].filter(Boolean).join(" · ") || "—"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {cv.languages.length > 0 && (
        <section className="mb-6">
          <SectionTitle>Langues</SectionTitle>
          <p className="text-sm">
            {cv.languages.map((lang) => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ""}`).join(", ")}
          </p>
        </section>
      )}

      {cv.customSections.map((section, index) => (
        <section key={index} className="mb-6">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
        </section>
      ))}
    </div>
  );
}
