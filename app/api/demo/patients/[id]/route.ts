import { NextRequest, NextResponse } from "next/server";
import { deletePatientById, getPatientById, isTrackingScale, updatePatientTrackingScale } from "@/lib/demo-store";
import { canPsychologistAccessPatient, getCurrentUserAndRole, getPatientPayload } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isSupabaseAdminConfigured()) {
    const patient = await getPatientById(id);
    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || !role) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const patientId = id === "me" ? user.id : id;

  if (role === "psicologo") {
    const allowed = await canPsychologistAccessPatient(user.id, patientId);
    if (!allowed) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }
  }

  if (role === "paciente" && patientId !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const patient = await getPatientPayload(patientId);
  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await req.json()) as { trackingScale?: string };

  if (!body.trackingScale || !isTrackingScale(body.trackingScale)) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    const patient = await updatePatientTrackingScale(id, body.trackingScale);
    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const patientId = id === "me" ? user.id : id;
  const allowed = await canPsychologistAccessPatient(user.id, patientId);
  if (!allowed) {
    return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("patients")
    .update({ tracking_scale: body.trackingScale })
    .eq("id", patientId)
    .eq("psychologist_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const patient = await getPatientPayload(patientId);
  return NextResponse.json({ patient });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isSupabaseAdminConfigured()) {
    const deleted = await deletePatientById(id);
    if (!deleted) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
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
