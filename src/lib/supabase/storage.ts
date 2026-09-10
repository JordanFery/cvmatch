import type { SupabaseClient } from "@supabase/supabase-js";
import type { CvFileType } from "@/lib/validations/cv";

const CV_BUCKET = "cvs";

export function cvStoragePath(userId: string, cvId: string, fileType: CvFileType) {
  const ext = fileType === "PDF" ? "pdf" : "docx";
  return `${userId}/${cvId}/original.${ext}`;
}

export async function uploadCvFile(
  supabase: SupabaseClient,
  path: string,
  bytes: Buffer,
  mimeType: string,
) {
  const { error } = await supabase.storage.from(CV_BUCKET).upload(path, bytes, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw error;
}

export async function downloadCvFile(supabase: SupabaseClient, path: string): Promise<Buffer> {
  const { data, error } = await supabase.storage.from(CV_BUCKET).download(path);
  if (error || !data) throw error ?? new Error("Fichier introuvable.");
  return Buffer.from(await data.arrayBuffer());
}

export async function deleteCvFile(supabase: SupabaseClient, path: string) {
  const { error } = await supabase.storage.from(CV_BUCKET).remove([path]);
  if (error) throw error;
}

/** Short-lived signed URL — CV files are never served from a public URL. */
export async function getSignedCvUrl(
  supabase: SupabaseClient,
  path: string,
  expiresInSeconds = 60,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw error ?? new Error("Impossible de générer le lien de téléchargement.");
  return data.signedUrl;
}
