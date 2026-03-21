import { NextRequest, NextResponse } from "next/server";
import { assignTaskToPatient } from "@/lib/demo-store";
import { resolveDemoPatientId } from "@/lib/demo-patient";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patientId = await resolveDemoPatientId(id);
  const body = (await req.json()) as {
    taskId?: string;
    title?: string;
    description?: string;
  };

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Titulo requerido" }, { status: 400 });
  }

  const result = patientId
    ? await assignTaskToPatient(patientId, {
        id: body.taskId?.trim(),
        title,
        description: body.description?.trim() ?? "",
      })
    : null;

  if (!result) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
}
