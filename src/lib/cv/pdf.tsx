import "server-only";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ParsedCv } from "@/lib/validations/cv";

// A real, standalone PDF generated from structured data — deliberately not
// the browser's print-to-PDF (window.print()). That path bakes in whatever
// header/footer the browser is configured to show (page title, a
// timestamp, the page's own URL), which is exactly the kind of thing that
// tells an ATS or a recruiter a resume was produced by a tool rather than
// the candidate. This document contains only the resume's own content —
// nothing else — full stop.

const styles = StyleSheet.create({
  page: { paddingVertical: 36, paddingHorizontal: 40, fontSize: 10, color: "#171717", fontFamily: "Helvetica" },
  header: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#d4d4d4", alignItems: "center" },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  title: { marginTop: 2, fontSize: 11, color: "#525252" },
  contactLine: { marginTop: 6, fontSize: 8.5, color: "#737373", textAlign: "center" },
  section: { marginBottom: 14 },
  sectionTitle: {
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  entry: { marginBottom: 8 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  entryCompany: { fontFamily: "Helvetica" },
  entryMeta: { fontSize: 8.5, color: "#737373" },
  bodyText: { marginTop: 2, lineHeight: 1.4 },
  bullet: { flexDirection: "row", marginTop: 1 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, lineHeight: 1.4 },
  techLine: { marginTop: 2, fontSize: 8.5, color: "#737373" },
  skillLine: { marginBottom: 3 },
});

function formatDateRange(start: string | null, end: string | null, current: boolean) {
  const from = start ?? "?";
  const to = current ? "Présent" : (end ?? "?");
  return `${from} — ${to}`;
}

export function ResumePdfDocument({ cv }: { cv: ParsedCv }) {
  const fullName = [cv.personalInfo.firstName, cv.personalInfo.lastName].filter(Boolean).join(" ") || "—";
  const contactLine = [
    cv.personalInfo.email,
    cv.personalInfo.phone,
    cv.personalInfo.location,
    cv.personalInfo.linkedinUrl,
    cv.personalInfo.portfolioUrl,
    cv.personalInfo.githubUrl,
  ]
    .filter(Boolean)
    .join("   ·   ");

  const skillGroups: { label: string; values: string[] }[] = [
    { label: "Techniques", values: cv.skills.technical },
    { label: "Outils", values: cv.skills.tools },
    { label: "Frameworks", values: cv.skills.frameworks },
    { label: "Bases de données", values: cv.skills.databases },
    { label: "Savoir-être", values: cv.skills.soft },
    { label: "Autres", values: cv.skills.other },
  ].filter((group) => group.values.length > 0);

  return (
    <Document
      title={fullName !== "—" ? `CV — ${fullName}` : "CV"}
      author={fullName !== "—" ? fullName : undefined}
      creator=""
      producer=""
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {cv.personalInfo.title && <Text style={styles.title}>{cv.personalInfo.title}</Text>}
          {contactLine && <Text style={styles.contactLine}>{contactLine}</Text>}
        </View>

        {cv.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résumé</Text>
            <Text style={styles.bodyText}>{cv.summary}</Text>
          </View>
        )}

        {cv.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expériences</Text>
            {cv.experiences.map((exp, index) => (
              <View key={index} style={styles.entry}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {exp.jobTitle ?? "—"}
                    {exp.company && <Text style={styles.entryCompany}> · {exp.company}</Text>}
                  </Text>
                  <Text style={styles.entryMeta}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.location && <Text style={styles.entryMeta}>{exp.location}</Text>}
                {exp.description && <Text style={styles.bodyText}>{exp.description}</Text>}
                {exp.achievements.map((item, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
                {exp.technologies.length > 0 && <Text style={styles.techLine}>{exp.technologies.join(" · ")}</Text>}
              </View>
            ))}
          </View>
        )}

        {cv.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formation</Text>
            {cv.education.map((edu, index) => (
              <View key={index} style={styles.entry}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {[edu.degree, edu.field].filter(Boolean).join(", ") || "—"}
                    {edu.school && <Text style={styles.entryCompany}> · {edu.school}</Text>}
                  </Text>
                  <Text style={styles.entryMeta}>{formatDateRange(edu.startDate, edu.endDate, false)}</Text>
                </View>
                {edu.description && <Text style={styles.bodyText}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {skillGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            {skillGroups.map((group) => (
              <Text key={group.label} style={styles.skillLine}>
                <Text style={styles.entryTitle}>{group.label} : </Text>
                {group.values.join(", ")}
              </Text>
            ))}
          </View>
        )}

        {cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projets</Text>
            {cv.projects.map((project, index) => (
              <View key={index} style={styles.entry}>
                <Text style={styles.entryTitle}>{project.name ?? "—"}</Text>
                {project.description && <Text style={styles.bodyText}>{project.description}</Text>}
                {project.technologies.length > 0 && <Text style={styles.techLine}>{project.technologies.join(" · ")}</Text>}
              </View>
            ))}
          </View>
        )}

        {cv.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {cv.certifications.map((cert, index) => (
              <Text key={index} style={styles.skillLine}>
                {[cert.name, cert.organization, cert.date].filter(Boolean).join(" · ") || "—"}
              </Text>
            ))}
          </View>
        )}

        {cv.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Langues</Text>
            <Text>{cv.languages.map((lang) => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ""}`).join(", ")}</Text>
          </View>
        )}

        {cv.customSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.bodyText}>{section.content}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

/** Renders a CV to a downloadable PDF buffer — the resume's content only, nothing else (see the note above). */
export async function renderResumePdf(cv: ParsedCv): Promise<Buffer> {
  return renderToBuffer(<ResumePdfDocument cv={cv} />);
}
