import { NextResponse } from "next/server";
import { getOwnedCv } from "@/lib/data/cv";
import { renderResumePdf } from "@/lib/cv/pdf";

function fileNameFor(name: string): string {
  const safe = name.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "CV";
  return `${safe}.pdf`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cv = await getOwnedCv(id);
  if (!cv) return NextResponse.json({ error: "CV introuvable." }, { status: 404 });

  const pdf = await renderResumePdf(cv.parsedData);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileNameFor(cv.name)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
