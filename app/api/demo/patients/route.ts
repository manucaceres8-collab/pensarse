import { NextRequest, NextResponse } from "next/server";
import { addPatient, getPatients, isTrackingScale } from "@/lib/demo-store";

export async function GET() {
  const patients = await getPatients();
  return NextResponse.json({ patients });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    objective?: string;
    trackingScale?: string;
    avatar?: string;
  };

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const trackingScale =
    body.trackingScale && isTrackingScale(body.trackingScale)
      ? body.trackingScale
      : undefined;

  if (body.trackingScale && !trackingScale) {
    return NextResponse.json(
      { error: "Escala de seguimiento no válida" },
      { status: 400 }
    );
  }

  const patient = await addPatient({
    name,
    email: body.email?.trim() || "",
    objective: body.objective?.trim() || "",
    trackingScale,
    avatar: body.avatar?.trim() || "",
  });

  return NextResponse.json({ patient }, { status: 201 });
}
