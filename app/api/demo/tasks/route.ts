import { NextRequest, NextResponse } from "next/server";
import {
  addTaskTemplate,
  getTaskTemplates,
  isTaskResponseType,
} from "@/lib/demo-store";

export async function GET() {
  const tasks = await getTaskTemplates();
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

  const template = await addTaskTemplate({
    title,
    description: body.description?.trim() || "",
    duration: body.duration?.trim() || "3 min",
    responseType: body.responseType,
    instructions: body.instructions?.trim() || "",
  });

  return NextResponse.json({ template }, { status: 201 });
}
