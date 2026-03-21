import { NextRequest, NextResponse } from "next/server";
import { addTaskTemplate, getTaskTemplates, isTaskResponseType } from "@/lib/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { getCurrentUserAndRole } from "@/lib/pilot-db";
import { getTaskResponseProfile } from "@/lib/task-response-ui";

function toDurationLabel(minutes: number | null) {
  if (!minutes || Number.isNaN(minutes)) return "5 min";
  return `${minutes} min`;
}

function parseMinutes(value: string | undefined) {
  const raw = (value ?? "").trim();
  const match = raw.match(/\d+/);
  return match ? Number(match[0]) : 5;
}

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    const tasks = (await getTaskTemplates()).map((item) => ({
      ...item,
      responseProfile: getTaskResponseProfile(item),
    }));
    return NextResponse.json({ tasks });
  }

  const { user, role } = await getCurrentUserAndRole();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("tasks_library")
    .select("id, title, description, therapy_type, response_type, duration_minutes, is_custom, psychologist_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tasks = (data ?? [])
    .filter((item) => !item.is_custom || (user && role === "psicologo" && item.psychologist_id === user.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      duration: toDurationLabel(item.duration_minutes),
      responseType: (item.response_type as "texto corto" | "escala" | "selección" | "emojis" | "formulario breve") ?? "texto corto",
      therapyType: (item.therapy_type as "tcc" | "act" | "dbt" | "soluciones" | "personalizadas") ?? "personalizadas",
      instructions: item.description ?? "",
      kind: item.is_custom ? "personalizada" : "base",
      createdAt: item.created_at,
    }))
    .map((item) => ({
      ...item,
      responseProfile: getTaskResponseProfile(item),
    }));

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    title?: string;
    description?: string;
    duration?: string;
    responseType?: string;
    instructions?: string;
  };

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }

  if (!isTaskResponseType(body.responseType)) {
    return NextResponse.json({ error: "Tipo de respuesta no válido" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    const template = await addTaskTemplate({
      title,
      description: body.description?.trim() || "",
      duration: body.duration?.trim() || "3 min",
      responseType: body.responseType,
      instructions: body.instructions?.trim() || "",
    });

    return NextResponse.json({ template }, { status: 201 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: template, error } = await admin
    .from("tasks_library")
    .insert({
      title,
      description: body.description?.trim() || body.instructions?.trim() || "",
      therapy_type: "personalizadas",
      response_type: body.responseType,
      duration_minutes: parseMinutes(body.duration),
      is_custom: true,
      psychologist_id: user.id,
    })
    .select("id, title, description, therapy_type, response_type, duration_minutes, is_custom, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      template: {
        id: template.id,
        title: template.title,
        description: template.description ?? "",
        duration: toDurationLabel(template.duration_minutes),
        responseType: template.response_type,
        therapyType: template.therapy_type,
        instructions: template.description ?? "",
        kind: template.is_custom ? "personalizada" : "base",
        createdAt: template.created_at,
      },
    },
    { status: 201 }
  );
}
