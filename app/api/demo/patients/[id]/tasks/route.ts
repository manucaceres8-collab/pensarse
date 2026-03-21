import { NextRequest, NextResponse } from "next/server";
import { assignTaskToPatient } from "@/lib/demo-store";
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

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Titulo requerido" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    const result = await assignTaskToPatient(id, {
      id: body.taskId?.trim(),
      title,
      description: body.description?.trim() ?? "",
    });

    if (!result) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
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

  const { data: task, error } = await admin
    .from("tasks_assigned")
    .insert({
      patient_id: id,
      task_library_id: body.taskId?.trim() || null,
      goal: title,
      instructions: body.description?.trim() ?? "",
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
      duplicate: false,
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
