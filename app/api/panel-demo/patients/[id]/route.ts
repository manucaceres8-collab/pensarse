import { NextRequest, NextResponse } from "next/server";
import { deletePatientById, getPatientById, isTrackingScale, updatePatientTrackingScale } from "@/lib/demo-store";
import { resolveDemoPatientId } from "@/lib/demo-patient";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patientId = await resolveDemoPatientId(id);
  const patient = patientId ? await getPatientById(patientId) : null;

  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patientId = await resolveDemoPatientId(id);
  const body = (await req.json()) as { trackingScale?: string };

  if (!body.trackingScale || !isTrackingScale(body.trackingScale)) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  const patient = patientId ? await updatePatientTrackingScale(patientId, body.trackingScale) : null;
  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = await deletePatientById(id);

  if (!deleted) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
