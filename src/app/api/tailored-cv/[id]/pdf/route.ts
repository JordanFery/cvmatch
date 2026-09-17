import { NextResponse } from "next/server";
import { getOwnedTailoredCv, toParsedCvFromTailored } from "@/lib/data/tailored-cv";
import { renderResumePdf } from "@/lib/cv/pdf";

function fileNameFor(cv: ReturnType<typeof toParsedCvFromTailored>): string {
  const name = [cv.personalInfo.firstName, cv.personalInfo.lastName].filter(Boolean).join("-") || "CV";
  const safe = name.replace(/[^\p{L}\p{N}-]/gu, "");
  return `${safe}.pdf`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tailored = await getOwnedTailoredCv(id);
  if (!tailored) return NextResponse.json({ error: "CV introuvable." }, { status: 404 });

  const data = toParsedCvFromTailored(tailored.data);
  const pdf = await renderResumePdf(data);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileNameFor(data)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
