import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { CvFileType } from "@/lib/validations/cv";

/**
 * Extracts plain text from a PDF or DOCX buffer. Text-layer extraction only —
 * scanned/image-only PDFs will yield little or no text (no OCR in this
 * pipeline; the architecture below leaves room to add it as another branch
 * of this function later without touching callers).
 */
export async function extractCvText(bytes: Buffer, fileType: CvFileType): Promise<string> {
  if (fileType === "PDF") {
    const parser = new PDFParse({ data: bytes });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  const result = await mammoth.extractRawText({ buffer: bytes });
  return result.value.trim();
}
