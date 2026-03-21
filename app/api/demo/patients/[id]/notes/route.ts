import { NextRequest, NextResponse } from "next/server";
import { addPatientNote } from "@/lib/demo-store";
import { canPsychologistAccessPatient, getCurrentUserAndRole } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await req.json()) as {
    text?: string;
    author?: "paciente" | "psicólogo" | "psicologo";
  };

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
  }

  const author = body.author === "psicologo" ? "psicólogo" : body.author ?? "paciente";

  if (!isSupabaseAdminConfigured()) {
    const note = await addPatientNote(id, { text, author });
    if (!note) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ note }, { status: 201 });
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
  const { data: note, error } = await admin
    .from("patient_notes")
    .insert({
      patient_id: patientId,
      text,
      author,
      created_at: now,
    })
    .select("id, text, author, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      note: {
        id: note.id,
        text: note.text,
        author: note.author,
        createdAt: note.created_at,
      },
    },
    { status: 201 }
  );
}
