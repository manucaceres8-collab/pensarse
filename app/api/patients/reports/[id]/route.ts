import { NextResponse } from "next/server";
import { canPsychologistAccessPatient, getCurrentUserAndRole, getPsychologistPatientReport } from "@/lib/pilot-db";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { user, role } = await getCurrentUserAndRole();

  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const allowed = await canPsychologistAccessPatient(user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  try {
    const report = await getPsychologistPatientReport(user.id, id);
    if (!report) {
      return NextResponse.json({ error: "Informe no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar el informe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
