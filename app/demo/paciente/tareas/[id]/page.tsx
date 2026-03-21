"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type AbcAnswer,
  type ResponseType,
  type TaskResponseProfile,
  getTaskResponseProfile,
  parseAbcAnswer,
  parseBriefFormAnswer,
  serializeAbcAnswer,
  serializeBriefFormAnswer,
} from "@/lib/task-response-ui";

type DemoTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: "Pendiente" | "En curso" | "Completada";
  lastAnswer: string;
};

type DemoPatient = {
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

const EMPTY_ABC: AbcAnswer = {
  situacion: "",
  pensamiento: "",
  emocion: "",
  conducta: "",
  pensamiento_alternativo: "",
};

export default function TareaEjercicio() {
  const params = useParams();
  const taskId = String(params.id);

  const [task, setTask] = useState<DemoTask | null>(null);
  const [template, setTemplate] = useState<TaskTemplate | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const [textAnswer, setTextAnswer] = useState("");
  const [scaleAnswer, setScaleAnswer] = useState<string | null>(null);
  const [selectionAnswer, setSelectionAnswer] = useState<string | null>(null);
  const [emojiAnswer, setEmojiAnswer] = useState<string | null>(null);
  const [abcAnswer, setAbcAnswer] = useState<AbcAnswer>(EMPTY_ABC);
  const [briefFormAnswers, setBriefFormAnswers] = useState<string[]>(["", "", ""]);

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

  useEffect(() => {
    let mounted = true;

    async function loadTask() {
      const [patientRes, templatesRes] = await Promise.all([
        fetch("/api/panel-demo/patients/me", { cache: "no-store" }),
        fetch("/api/panel-demo/tasks", { cache: "no-store" }),
      ]);

      if (!patientRes.ok || !templatesRes.ok) return;

      const patientData = (await patientRes.json()) as { patient: DemoPatient };
      const templatesData = (await templatesRes.json()) as { tasks: TaskTemplate[] };

      const found = patientData.patient.tasks.find((item) => item.id === taskId) ?? null;
      if (!mounted || !found) return;

      const foundTemplate = templatesData.tasks.find((item) => item.id === found.templateId) ?? null;

      setTask(found);
      setTemplate(foundTemplate);

      const type = foundTemplate?.responseType ?? "texto corto";
      const profile = foundTemplate?.responseProfile ??
        getTaskResponseProfile({
          id: foundTemplate?.id ?? found.templateId,
          title: foundTemplate?.title ?? found.title,
          description: foundTemplate?.description ?? found.description,
          instructions: foundTemplate?.instructions,
          responseType: type,
        });

      const answer = found.lastAnswer ?? "";
      setTextAnswer("");
      setScaleAnswer(null);
      setSelectionAnswer(null);
      setEmojiAnswer(null);
      setAbcAnswer(EMPTY_ABC);
      setBriefFormAnswers(["", "", ""]);

      if (profile.kind === "text") {
        setTextAnswer(answer);
      }

      if (profile.kind === "scale") {
        setScaleAnswer(answer || null);
      }

      if (profile.kind === "selection") {
        setSelectionAnswer(answer || null);
      }

      if (profile.kind === "emoji") {
        setEmojiAnswer(answer || null);
      }

      if (profile.kind === "abc") {
        setAbcAnswer(parseAbcAnswer(answer));
      }

      if (profile.kind === "brief_form") {
        setBriefFormAnswers(parseBriefFormAnswer(answer, profile.fields.length));
      }
    }

    loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const instructions = useMemo(() => {
    if (template?.instructions?.trim()) return template.instructions;
    return task?.description || "Completa el ejercicio y guárdalo para tu psicólogo.";
  }, [template?.instructions, task?.description]);

  function buildAnswer() {
    if (responseProfile.kind === "text") {
      return textAnswer.trim();
    }

    if (responseProfile.kind === "scale") {
      return scaleAnswer ?? "";
    }

    if (responseProfile.kind === "selection") {
      return selectionAnswer ?? "";
    }

    if (responseProfile.kind === "emoji") {
      return emojiAnswer ?? "";
    }

    if (responseProfile.kind === "abc") {
      return serializeAbcAnswer(abcAnswer);
    }

    return serializeBriefFormAnswer(briefFormAnswers);
  }

  async function guardar() {
    if (!task) return;

    setSaving(true);
    try {
      const answer = buildAnswer();

      await fetch(`/api/panel-demo/patients/me/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Completada",
          lastAnswer: answer,
        }),
      });

      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/demo/paciente/tareas" className="text-sm text-[#607794] hover:text-[#1f304b]">
        Volver a tareas
      </Link>

      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">{task?.title ?? "Ejercicio terapéutico"}</h1>
        <p className="mt-2 text-sm text-[#4f617b]">{instructions}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={["rounded-full border px-3 py-1 text-xs", responseTone[responseType]].join(" ")}>
            {responseType}
          </span>
          {template?.kind === "personalizada" && (
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
              Personalizada
            </span>
          )}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#1f2d45]">Tu respuesta</h2>

        {responseProfile.kind === "text" && (
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#1f2d45]"
            rows={5}
            placeholder={responseProfile.placeholder}
          />
        )}

        {responseProfile.kind === "scale" && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-[#607794]">Selecciona una puntuación de {responseProfile.min} a {responseProfile.max}.</p>
            <div className="grid gap-2 sm:grid-cols-5">
              {Array.from({ length: responseProfile.max }, (_, index) => String(index + 1)).map((value) => {
                const active = scaleAnswer === value;
                return (
                  <button
                    key={value}
                    onClick={() => setScaleAnswer(value)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm transition",
                      active
                        ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                        : "border-[#d9e1ee] bg-[#f8fbff] text-[#1f304b] hover:bg-white",
                    ].join(" ")}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {responseProfile.kind === "selection" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {responseProfile.options.map((option) => {
              const active = selectionAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => setSelectionAnswer(option)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm transition",
                    active
                      ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                      : "border-[#d9e1ee] bg-[#f8fbff] text-[#1f304b] hover:bg-white",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {responseProfile.kind === "emoji" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {responseProfile.options.map((emoji) => {
              const active = emojiAnswer === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => setEmojiAnswer(emoji)}
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl border text-xl transition",
                    active
                      ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                      : "border-[#d9e1ee] bg-[#f8fbff] hover:bg-white",
                  ].join(" ")}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        )}

        {responseProfile.kind === "abc" && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-[#607794]">Situación</label>
              <textarea
                value={abcAnswer.situacion}
                onChange={(e) => setAbcAnswer((prev) => ({ ...prev, situacion: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
                placeholder="¿Qué pasó?"
              />
            </div>

            <div>
              <label className="text-sm text-[#607794]">Pensamiento</label>
              <textarea
                value={abcAnswer.pensamiento}
                onChange={(e) => setAbcAnswer((prev) => ({ ...prev, pensamiento: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
                placeholder="¿Qué te dijiste en ese momento?"
              />
            </div>

            <div>
              <label className="text-sm text-[#607794]">Emoción</label>
              <input
                value={abcAnswer.emocion}
                onChange={(e) => setAbcAnswer((prev) => ({ ...prev, emocion: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm"
                placeholder="Ej. ansiedad, tristeza, enfado"
              />
            </div>

            <div>
              <label className="text-sm text-[#607794]">Conducta</label>
              <textarea
                value={abcAnswer.conducta}
                onChange={(e) => setAbcAnswer((prev) => ({ ...prev, conducta: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
                placeholder="¿Qué hiciste después?"
              />
            </div>

            <div>
              <label className="text-sm text-[#607794]">Pensamiento alternativo (opcional)</label>
              <textarea
                value={abcAnswer.pensamiento_alternativo}
                onChange={(e) => setAbcAnswer((prev) => ({ ...prev, pensamiento_alternativo: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
                placeholder="Una alternativa más equilibrada"
              />
            </div>
          </div>
        )}

        {responseProfile.kind === "brief_form" && (
          <div className="mt-4 space-y-4">
            {responseProfile.fields.map((label, index) => (
              <div key={`${label}-${index}`}>
                <label className="text-sm text-[#607794]">{label}</label>
                <textarea
                  value={briefFormAnswers[index] ?? ""}
                  onChange={(e) =>
                    setBriefFormAnswers((prev) => {
                      const next = [...prev];
                      next[index] = e.target.value;
                      return next;
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={guardar}
          disabled={saving}
          className="mt-5 rounded-xl !bg-[#0f1f3f] px-5 py-2 text-sm font-medium !text-white transition hover:!bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </section>

      {done && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Tarea guardada y enviada al psicólogo.
        </div>
      )}
    </div>
  );
}
