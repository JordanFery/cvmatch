import { ALLOWED_CV_MIME_TYPES, MAX_CV_FILE_SIZE, type CvFileType } from "@/lib/validations/cv";

type ValidationResult = { ok: true; fileType: CvFileType } | { ok: false; error: string };

const PDF_MAGIC = Buffer.from("%PDF");
// DOCX (and any OOXML file) is a ZIP archive — ZIP local file headers start with "PK\x03\x04".
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

/**
 * Validates a CV upload without trusting the filename extension: checks the
 * declared MIME type against an allowlist, the file size, and the file's
 * actual magic bytes (a renamed .exe with a .pdf extension won't pass).
 */
export function validateCvFile(file: { type: string; size: number }, bytes: Buffer): ValidationResult {
  if (file.size === 0) {
    return { ok: false, error: "Ce fichier est vide." };
  }

  if (file.size > MAX_CV_FILE_SIZE) {
    return { ok: false, error: "Le fichier dépasse la taille maximale autorisée (10 Mo)." };
  }

  const fileType = ALLOWED_CV_MIME_TYPES[file.type as keyof typeof ALLOWED_CV_MIME_TYPES];
  if (!fileType) {
    return { ok: false, error: "Format non supporté. Seuls les fichiers PDF et DOCX sont acceptés." };
  }

  const magic = bytes.subarray(0, 4);
  const matchesDeclaredType =
    fileType === "PDF" ? magic.subarray(0, 4).equals(PDF_MAGIC) : magic.equals(ZIP_MAGIC);

  if (!matchesDeclaredType) {
    return {
      ok: false,
      error: "Le contenu du fichier ne correspond pas à un PDF ou DOCX valide.",
    };
  }

  return { ok: true, fileType };
}
