import { NextResponse } from "next/server";
import { getCurrentUserAndRole, getPsychologistPatientReports } from "@/lib/pilot-db";

export async function GET() {
  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const reports = await getPsychologistPatientReports(user.id);
    return NextResponse.json({ reports });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar los informes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
