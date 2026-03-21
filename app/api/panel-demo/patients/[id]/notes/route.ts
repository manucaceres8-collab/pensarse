import { NextRequest, NextResponse } from "next/server";
import { addPatientNote } from "@/lib/demo-store";
import { resolveDemoPatientId } from "@/lib/demo-patient";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patientId = await resolveDemoPatientId(id);
  const body = (await req.json()) as {
    text?: string;
    author?: "paciente" | "psicólogo" | "psicologo";
  };

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
  }

  const note = patientId
    ? await addPatientNote(patientId, {
        text,
        author: body.author === "psicologo" ? "psicólogo" : body.author ?? "paciente",
      })
    : null;

  if (!note) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ note }, { status: 201 });
}
