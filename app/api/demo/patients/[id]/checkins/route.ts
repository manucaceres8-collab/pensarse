import { NextRequest, NextResponse } from "next/server";
import { addPatientCheckin } from "@/lib/demo-store";
import { canPsychologistAccessPatient, getCurrentUserAndRole } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await req.json()) as { mood?: string; text?: string };

  if (!body.mood) {
    return NextResponse.json({ error: "Registro requerido" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    const checkin = await addPatientCheckin(id, {
      mood: body.mood,
      text: (body.text ?? "").trim(),
    });

    if (!checkin) {
      return NextResponse.json(
        { error: "No se pudo guardar el check-in. Revisa paciente y escala." },
        { status: 400 }
      );
    }

    return NextResponse.json({ checkin }, { status: 201 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || !role) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const patientId = id === "me" ? user.id : id;

  if (role === "paciente" && patientId !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (role === "psicologo") {
    const allowed = await canPsychologistAccessPatient(user.id, patientId);
    if (!allowed) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: checkin, error } = await admin
    .from("daily_checkins")
    .insert({
      patient_id: patientId,
      value: body.mood,
      note: (body.text ?? "").trim(),
      created_at: now,
    })
    .select("id, value, note, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      checkin: {
        id: checkin.id,
        mood: checkin.value ?? "",
        text: checkin.note ?? "",
        createdAt: checkin.created_at,
      },
    },
    { status: 201 }
  );
}
