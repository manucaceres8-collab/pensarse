import { NextRequest, NextResponse } from "next/server";
import { canPsychologistAccessPatient, getCurrentUserAndRole, getPatientPayload } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

type TrackingScale = "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";

function isTrackingScale(value: unknown): value is TrackingScale {
  return ["emoji", "numeric_5", "numeric_10", "wellbeing_text", "anxiety_text"].includes(String(value));
}

function toDbTrackingScale(value: TrackingScale) {
  if (value === "numeric_5") return "oneToFive";
  if (value === "numeric_10") return "oneToTen";
  if (value === "wellbeing_text") return "bienestar";
  if (value === "anxiety_text") return "ansiedad";
  return "emoji";
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase no está configurado para el flujo real." }, { status: 500 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const allowed = await canPsychologistAccessPatient(user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  const patient = await getPatientPayload(id);
  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await req.json()) as { trackingScale?: string };

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase no está configurado para el flujo real." }, { status: 500 });
  }

  if (!body.trackingScale || !isTrackingScale(body.trackingScale)) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const allowed = await canPsychologistAccessPatient(user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("patients")
    .update({ tracking_scale: toDbTrackingScale(body.trackingScale) })
    .eq("id", id)
    .eq("psychologist_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const patient = await getPatientPayload(id);
  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase no está configurado para el flujo real." }, { status: 500 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const allowed = await canPsychologistAccessPatient(user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  const admin = createAdminClient();

  const { data: deletedPatient, error: patientError } = await admin
    .from("patients")
    .delete()
    .eq("id", id)
    .eq("psychologist_id", user.id)
    .select("id")
    .maybeSingle();

  if (patientError || !deletedPatient) {
    return NextResponse.json({ error: patientError?.message ?? "Paciente no encontrado" }, { status: 400 });
  }

  await admin.from("profiles").delete().eq("id", id).eq("role", "paciente");
  await admin.auth.admin.deleteUser(id);

  return NextResponse.json({ ok: true });
}
