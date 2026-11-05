import "server-only";
import { Document, Page, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

// Same rationale as src/lib/cv/pdf.tsx — a real generated PDF instead of
// window.print(), which would otherwise bake the browser's own
// header/footer (page title, timestamp, this app's URL) onto the letter.

const styles = StyleSheet.create({
  page: { paddingVertical: 48, paddingHorizontal: 56, fontSize: 10.5, color: "#171717", fontFamily: "Helvetica" },
  // See src/lib/cv/pdf.tsx for why this isn't ~1.3-1.5 like a CSS line-height
  // would be: react-pdf's multiplier stacks on this font's own oversized
  // line box, so 1.5 made a wrapped line within one paragraph read almost
  // as far apart as two separate paragraphs. 0.8 brings it back in line.
  paragraph: { marginBottom: 10, lineHeight: 0.8 },
});

export function CoverLetterPdfDocument({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Document title="Lettre de motivation" creator="" producer="">
      <Page size="A4" style={styles.page}>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

export async function renderCoverLetterPdf(content: string): Promise<Buffer> {
  return renderToBuffer(<CoverLetterPdfDocument content={content} />);
}
