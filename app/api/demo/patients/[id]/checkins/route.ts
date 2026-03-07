import { NextRequest, NextResponse } from "next/server";
import { addPatientCheckin } from "@/lib/demo-store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await req.json()) as { mood?: string; text?: string };

  if (!body.mood) {
    return NextResponse.json({ error: "Mood requerido" }, { status: 400 });
  }

  const checkin = await addPatientCheckin(id, {
    mood: body.mood,
    text: (body.text ?? "").trim(),
  });

  if (!checkin) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ checkin }, { status: 201 });
}
