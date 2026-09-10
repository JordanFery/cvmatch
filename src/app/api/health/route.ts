import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Liveness/readiness check for uptime monitors — confirms the app is up AND can reach the database. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
