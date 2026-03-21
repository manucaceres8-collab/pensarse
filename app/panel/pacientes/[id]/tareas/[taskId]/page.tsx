"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type ResponseType,
  type TaskResponseProfile,
  getTaskResponseProfile,
  parseAbcAnswer,
  parseBriefFormAnswer,
} from "@/lib/task-response-ui";

type DemoTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: "Pendiente" | "En curso" | "Completada";
  createdAt: string;
  updatedAt: string;
  lastAnswer: string;
};

type DemoPatient = {
  id: string;
  name: string;
  tasks: DemoTask[];
};

type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  responseType: ResponseType;
  responseProfile?: TaskResponseProfile;
  therapyType: "tcc" | "act" | "dbt" | "soluciones" | "personalizadas";
  kind: "base" | "personalizada";
};

const responseTone: Record<ResponseType, string> = {
  "texto corto": "border-sky-200 bg-sky-50 text-sky-700",
  escala: "border-indigo-200 bg-indigo-50 text-indigo-700",
  selección: "border-cyan-200 bg-cyan-50 text-cyan-700",
  emojis: "border-amber-200 bg-amber-50 text-amber-700",
  "formulario breve": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function formatDate(value: string) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TareaPacienteDetallePage() {
  const params = useParams();
  const patientId = String(params.id ?? "");
  const taskId = String(params.taskId ?? "");

  const [patient, setPatient] = useState<DemoPatient | null>(null);
  const [task, setTask] = useState<DemoTask | null>(null);
  const [template, setTemplate] = useState<TaskTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const [patientRes, templatesRes] = await Promise.all([
          fetch(`/api/demo/patients/${patientId}`, { cache: "no-store" }),
          fetch("/api/demo/tasks", { cache: "no-store" }),
        ]);

        if (!patientRes.ok || !templatesRes.ok) {
          if (mounted) {
            setPatient(null);
            setTask(null);
          }
          return;
        }

        const patientData = (await patientRes.json()) as { patient: DemoPatient };
        const templatesData = (await templatesRes.json()) as { tasks: TaskTemplate[] };

        const foundTask = patientData.patient.tasks.find((item) => item.id === taskId) ?? null;
        const foundTemplate = templatesData.tasks.find((item) => item.id === foundTask?.templateId) ?? null;

        if (!mounted) return;

        setPatient(patientData.patient);
        setTask(foundTask);
        setTemplate(foundTemplate);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [patientId, taskId]);

  const responseType = template?.responseType ?? "texto corto";

  const responseProfile = useMemo(() => {
    if (template?.responseProfile) return template.responseProfile;
    return getTaskResponseProfile({
      id: template?.id ?? task?.templateId,
      title: template?.title ?? task?.title,
      description: template?.description ?? task?.description,
      instructions: template?.instructions,
      responseType,
    });
  }, [template, task?.templateId, task?.title, task?.description, responseType]);

  const parsedAnswer = useMemo(() => {
    if (!task?.lastAnswer?.trim()) return null;

    if (responseProfile.kind === "abc") {
      return parseAbcAnswer(task.lastAnswer);
    }

    if (responseProfile.kind === "brief_form") {
      return parseBriefFormAnswer(task.lastAnswer, responseProfile.fields.length);
    }

    return task.lastAnswer;
  }, [task?.lastAnswer, responseProfile]);

  if (loading) {
    return (
      <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
        Cargando detalle de tarea...
      </div>
    );
  }

  if (!patient || !task) {
    return (
      <div className="space-y-4">
        <Link href={`/panel/pacientes/${patientId}`} className="text-sm text-[#607794] hover:text-[#1f304b]">
          Volver a ficha del paciente
        </Link>
        <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
          Tarea no encontrada para este paciente.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/panel/pacientes/${patient.id}`} className="text-sm text-[#607794] hover:text-[#1f304b]">
        Volver a ficha del paciente
      </Link>

      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">{task.title}</h1>
        <p className="mt-2 text-sm text-[#4f617b]">{task.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={["rounded-full border px-3 py-1 text-xs", responseTone[responseType]].join(" ")}>
            Tipo de tarea: {responseType}
          </span>
          <span
            className={[
              "rounded-full border px-3 py-1 text-xs",
              task.status === "Completada" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              task.status === "En curso" && "border-sky-200 bg-sky-50 text-sky-700",
              task.status === "Pendiente" && "border-amber-200 bg-amber-50 text-amber-700",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            Estado: {task.status}
          </span>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Detalle clínico</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3">
            <p className="text-xs text-[#607794]">Fecha de asignación</p>
            <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{formatDate(task.createdAt)}</p>
          </div>
          <div className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3">
            <p className="text-xs text-[#607794]">Fecha de completado</p>
            <p className="mt-1 text-sm font-semibold text-[#1f2d45]">
              {task.status === "Completada" ? formatDate(task.updatedAt) : "Aún no completada"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
          <p className="text-sm font-semibold text-[#1f2d45]">Respuesta del paciente</p>

          {!parsedAnswer && <p className="mt-2 text-sm text-[#4f617b]">No hay respuesta registrada todavía.</p>}

          {parsedAnswer && typeof parsedAnswer === "string" && responseProfile.kind === "scale" && (
            <div className="mt-2 rounded-xl border border-[#d9e1ee] bg-white p-3 text-sm text-[#1f2d45]">
              Puntuación: <strong>{parsedAnswer}</strong> / {responseProfile.max}
            </div>
          )}

          {parsedAnswer && typeof parsedAnswer === "string" && responseProfile.kind === "emoji" && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#d9e1ee] bg-white p-3 text-sm text-[#1f2d45]">
              <span className="text-2xl">{parsedAnswer}</span>
              <span>Emoji seleccionado</span>
            </div>
          )}

          {parsedAnswer && typeof parsedAnswer === "string" && responseProfile.kind !== "scale" && responseProfile.kind !== "emoji" && (
            <div className="mt-2 rounded-xl border border-[#d9e1ee] bg-white p-3 text-sm text-[#1f2d45]">
              {parsedAnswer}
            </div>
          )}

          {parsedAnswer && Array.isArray(parsedAnswer) && responseProfile.kind === "brief_form" && (
            <div className="mt-3 space-y-3">
              {responseProfile.fields.map((label, index) => (
                <div key={`${label}-${index}`} className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                  <p className="text-xs text-[#607794]">{label}</p>
                  <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer[index] || "Sin respuesta"}</p>
                </div>
              ))}
            </div>
          )}

          {parsedAnswer && !Array.isArray(parsedAnswer) && typeof parsedAnswer === "object" && responseProfile.kind === "abc" && (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Situación</p>
                <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer.situacion || "Sin respuesta"}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Pensamiento</p>
                <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer.pensamiento || "Sin respuesta"}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Emoción</p>
                <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer.emocion || "Sin respuesta"}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Conducta</p>
                <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer.conducta || "Sin respuesta"}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Pensamiento alternativo</p>
                <p className="mt-1 text-sm text-[#1f2d45]">{parsedAnswer.pensamiento_alternativo || "Sin respuesta"}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
