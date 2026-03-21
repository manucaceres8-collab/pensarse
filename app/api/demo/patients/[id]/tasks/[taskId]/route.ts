import { NextRequest, NextResponse } from "next/server";
import { updateTask } from "@/lib/demo-store";
import { canPsychologistAccessPatient, getCurrentUserAndRole } from "@/lib/pilot-db";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

function toDbStatus(status?: "Pendiente" | "En curso" | "Completada") {
  if (status === "Completada") return "hecha";
  if (status === "En curso") return "en curso";
  return "pendiente";
}

function fromDbStatus(status: string) {
  if (status === "hecha") return "Completada";
  if (status === "en curso") return "En curso";
  return "Pendiente";
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await context.params;
  const body = (await req.json()) as {
    status?: "Pendiente" | "En curso" | "Completada";
    lastAnswer?: string;
  };

  if (!isSupabaseAdminConfigured()) {
    const task = await updateTask(id, taskId, {
      status: body.status,
      lastAnswer: body.lastAnswer,
    });

    if (!task) {
      return NextResponse.json({ error: "Tarea o paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ task });
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
  const dbStatus = toDbStatus(body.status);
  const completedAt = dbStatus === "hecha" ? new Date().toISOString() : null;

  const { data: task, error } = await admin
    .from("tasks_assigned")
    .update({
      status: dbStatus,
      completed_at: completedAt,
    })
    .eq("id", taskId)
    .eq("patient_id", patientId)
    .select("id, task_library_id, goal, instructions, status, assigned_at, completed_at")
    .maybeSingle();

  if (error || !task) {
    return NextResponse.json({ error: "Tarea o paciente no encontrado" }, { status: 404 });
  }

  if (typeof body.lastAnswer === "string") {
    await admin.from("task_responses").insert({
      task_assigned_id: taskId,
      response: { raw: body.lastAnswer },
    });
  }

  return NextResponse.json({
    task: {
      id: task.id,
      templateId: task.task_library_id ?? task.id,
      title: task.goal ?? "Tarea",
      description: task.instructions ?? "",
      status: fromDbStatus(task.status),
      createdAt: task.assigned_at,
      updatedAt: task.completed_at ?? task.assigned_at,
      lastAnswer: body.lastAnswer ?? "",
    },
  });
}
