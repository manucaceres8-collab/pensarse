import { NextRequest, NextResponse } from "next/server";
import { addPatientNote } from "@/lib/demo-store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await req.json()) as {
    text?: string;
    author?: "paciente" | "psicologo";
  };

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
  }

  const note = await addPatientNote(id, {
    text,
    author: body.author ?? "paciente",
  });

  if (!note) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ note }, { status: 201 });
}
