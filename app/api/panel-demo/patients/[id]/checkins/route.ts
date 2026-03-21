import { NextRequest, NextResponse } from "next/server";
import { addPatientCheckin } from "@/lib/demo-store";
import { resolveDemoPatientId } from "@/lib/demo-patient";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patientId = await resolveDemoPatientId(id);
  const body = (await req.json()) as { mood?: string; text?: string };

  if (!body.mood) {
    return NextResponse.json({ error: "Registro requerido" }, { status: 400 });
  }

  const checkin = patientId
    ? await addPatientCheckin(patientId, {
        mood: body.mood,
        text: (body.text ?? "").trim(),
      })
    : null;

  if (!checkin) {
    return NextResponse.json(
      { error: "No se pudo guardar el check-in. Revisa paciente y escala." },
      { status: 400 }
    );
  }

  return NextResponse.json({ checkin }, { status: 201 });
}
