import { NextRequest, NextResponse } from "next/server";
import { updateTask } from "@/lib/demo-store";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await context.params;
  const body = (await req.json()) as {
    status?: "Pendiente" | "Completada";
    lastAnswer?: string;
  };

  const task = await updateTask(id, taskId, {
    status: body.status,
    lastAnswer: body.lastAnswer,
  });

  if (!task) {
    return NextResponse.json({ error: "Tarea o paciente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ task });
}
