import { NextRequest, NextResponse } from "next/server";
import { canPsychologistAccessPatient, getCurrentUserAndRole } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await req.json()) as {
    taskId?: string;
    title?: string;
    description?: string;
  };

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
  const now = new Date().toISOString();
  const taskId = body.taskId?.trim() || null;

  let title = body.title?.trim() ?? "";
  let description = body.description?.trim() ?? "";

  if (taskId) {
    const { data: template, error: templateError } = await admin
      .from("tasks_library")
      .select("id, title, description, is_custom, psychologist_id")
      .eq("id", taskId)
      .maybeSingle();

    if (templateError) {
      return NextResponse.json({ error: templateError.message }, { status: 400 });
    }

    if (!template) {
      return NextResponse.json({ error: "Tarea no encontrada en la biblioteca." }, { status: 404 });
    }

    if (template.is_custom && template.psychologist_id !== user.id) {
      return NextResponse.json({ error: "No autorizado para asignar esta tarea." }, { status: 403 });
    }

    title = template.title;
    description = template.description ?? "";
  }

  if (!title) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }

  const { data: task, error } = await admin
    .from("tasks_assigned")
    .insert({
      patient_id: id,
      task_library_id: taskId,
      goal: title,
      instructions: description,
      status: "pendiente",
      assigned_at: now,
    })
    .select("id, task_library_id, goal, instructions, status, assigned_at, completed_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      task: {
        id: task.id,
        templateId: task.task_library_id ?? task.id,
        title: task.goal ?? title,
        description: task.instructions ?? "",
        status: task.status === "hecha" ? "Completada" : task.status === "en curso" ? "En curso" : "Pendiente",
        createdAt: task.assigned_at,
        updatedAt: task.completed_at ?? task.assigned_at,
        lastAnswer: "",
      },
    },
    { status: 201 }
  );
}
