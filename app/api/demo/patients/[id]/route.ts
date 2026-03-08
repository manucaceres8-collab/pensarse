import { NextRequest, NextResponse } from "next/server";
import {
  getPatientById,
  isTrackingScale,
  updatePatientTrackingScale,
} from "@/lib/demo-store";

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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await req.json()) as { trackingScale?: string };

  if (!body.trackingScale || !isTrackingScale(body.trackingScale)) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  const patient = await updatePatientTrackingScale(id, body.trackingScale);

  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}
