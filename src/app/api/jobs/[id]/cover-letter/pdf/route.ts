import { NextResponse } from "next/server";
import { getOwnedJobOffer } from "@/lib/data/job-offer";
import { getMasterCv } from "@/lib/data/cv";
import { getCoverLetter } from "@/lib/data/cover-letter";
import { renderCoverLetterPdf } from "@/lib/cover-letter/pdf";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: jobOfferId } = await params;
  const [offer, cv] = await Promise.all([getOwnedJobOffer(jobOfferId), getMasterCv()]);
  if (!offer || !cv) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const letter = await getCoverLetter(cv.id, jobOfferId);
  if (!letter?.content) return NextResponse.json({ error: "Lettre introuvable." }, { status: 404 });

  const pdf = await renderCoverLetterPdf(letter.content);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Lettre-de-motivation.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
