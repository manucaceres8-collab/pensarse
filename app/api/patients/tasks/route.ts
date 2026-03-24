import { NextResponse } from "next/server";
import { getCurrentUserAndRole } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

type TaskResponseType = "texto corto" | "escala" | "selección" | "emojis" | "formulario breve";
type TherapyType = "tcc" | "act" | "dbt" | "soluciones" | "personalizadas";

function toDurationLabel(minutes: number | null) {
  if (!minutes || Number.isNaN(minutes)) return "5 min";
  return `${minutes} min`;
}

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase no está configurado para el flujo real." }, { status: 500 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tasks_library")
    .select("id, title, description, therapy_type, response_type, duration_minutes, is_custom, psychologist_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tasks = (data ?? [])
    .filter((item) => !item.is_custom || item.psychologist_id === user.id)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      duration: toDurationLabel(item.duration_minutes),
      responseType: (item.response_type as TaskResponseType) ?? "texto corto",
      therapyType: (item.therapy_type as TherapyType) ?? "personalizadas",
      instructions: item.description ?? "",
      kind: item.is_custom ? "personalizada" : "base",
      createdAt: item.created_at,
    }));

  return NextResponse.json({ tasks });
}
