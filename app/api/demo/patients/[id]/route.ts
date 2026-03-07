import { NextResponse } from "next/server";
import { getPatientById } from "@/lib/demo-store";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const patient = await getPatientById(id);

  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}
