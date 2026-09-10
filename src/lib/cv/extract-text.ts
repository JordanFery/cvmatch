import mammoth from "mammoth";
import type { CvFileType } from "@/lib/validations/cv";

/**
 * pdf-parse (via pdfjs-dist) expects a browser-ish `DOMMatrix` global. It
 * tries to self-polyfill from `@napi-rs/canvas` (already one of its own
 * dependencies) the first time it's actually used, but only in *some* of
 * its internal code paths — others reference the bare `DOMMatrix`
 * identifier at module-evaluation time, before that self-polyfill runs,
 * which throws `ReferenceError: DOMMatrix is not defined` the instant the
 * module loads. This was invisible locally (`npm run dev`/`next start`)
 * but crashed on Vercel, because there it's loaded via Turbopack's
 * "external module" runtime (see next.config.ts's serverExternalPackages)
 * the first time anything on the request path imports this file — so
 * setting the global here, before pdf-parse is ever imported, and lazily
 * (only inside the function that actually needs it, not at module scope)
 * closes both problems: the crash, and pages like /dashboard/cv that
 * import this file transitively (via src/lib/actions/cv.ts) without ever
 * parsing a PDF no longer pull pdf-parse's whole dependency graph in at
 * all.
 */
async function ensureDomMatrixPolyfill(): Promise<void> {
  if (typeof globalThis.DOMMatrix !== "undefined") return;
  const { DOMMatrix } = await import("@napi-rs/canvas");
  globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
}

/**
 * Extracts plain text from a PDF or DOCX buffer. Text-layer extraction only —
 * scanned/image-only PDFs will yield little or no text (no OCR in this
 * pipeline; the architecture below leaves room to add it as another branch
 * of this function later without touching callers).
 */
export async function extractCvText(bytes: Buffer, fileType: CvFileType): Promise<string> {
  if (fileType === "PDF") {
    await ensureDomMatrixPolyfill();
    const { PDFParse } = await import("pdf-parse");
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
