"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ResponseType =
  | "texto corto"
  | "escala"
  | "selección"
  | "emojis"
  | "formulario breve";

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
  const [form1, setForm1] = useState("");
  const [form2, setForm2] = useState("");
  const [form3, setForm3] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTask() {
      const [patientRes, templatesRes] = await Promise.all([
        fetch("/api/demo/patients/maria", { cache: "no-store" }),
        fetch("/api/demo/tasks", { cache: "no-store" }),
      ]);

      if (!patientRes.ok || !templatesRes.ok) return;

      const patientData = (await patientRes.json()) as { patient: DemoPatient };
      const templatesData = (await templatesRes.json()) as { tasks: TaskTemplate[] };

      const found = patientData.patient.tasks.find((item) => item.id === taskId) ?? null;
      if (!mounted || !found) return;

      const foundTemplate = templatesData.tasks.find((item) => item.id === found.templateId) ?? null;

      setTask(found);
      setTemplate(foundTemplate);

      const answer = found.lastAnswer ?? "";
      const type = foundTemplate?.responseType ?? "texto corto";

      if (type === "texto corto") {
        setTextAnswer(answer);
      }
      if (type === "escala") {
        setScaleAnswer(answer || null);
      }
      if (type === "selección") {
        setSelectionAnswer(answer || null);
      }
      if (type === "emojis") {
        setEmojiAnswer(answer || null);
      }
      if (type === "formulario breve") {
        const [a = "", b = "", c = ""] = answer.split("\n---\n");
        setForm1(a);
        setForm2(b);
        setForm3(c);
      }
    }

    loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const responseType = template?.responseType ?? "texto corto";

  const instructions = useMemo(() => {
    if (template?.instructions?.trim()) return template.instructions;
    return task?.description || "Completa el ejercicio y guárdalo para tu psicólogo.";
  }, [template?.instructions, task?.description]);

  function buildAnswer() {
    if (responseType === "texto corto") {
      return textAnswer.trim();
    }
    if (responseType === "escala") {
      return scaleAnswer ?? "";
    }
    if (responseType === "selección") {
      return selectionAnswer ?? "";
    }
    if (responseType === "emojis") {
      return emojiAnswer ?? "";
    }
    return [form1, form2, form3].map((v) => v.trim()).join("\n---\n");
  }

  async function guardar() {
    if (!task) return;

    setSaving(true);
    try {
      const answer = buildAnswer();

      await fetch(`/api/demo/patients/maria/tasks/${task.id}`, {
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
      <Link href="/mi/tareas" className="text-sm text-[#607794] hover:text-[#1f304b]">
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

        {responseType === "texto corto" && (
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#1f2d45]"
            rows={5}
            placeholder="Escribe aquí tu respuesta..."
          />
        )}

        {responseType === "escala" && (
          <div className="mt-4 grid gap-2 sm:grid-cols-5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((value) => {
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
        )}

        {responseType === "selección" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {["Sí", "Parcial", "No", "No aplica"].map((option) => {
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

        {responseType === "emojis" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {["😣", "😔", "😐", "🙂", "😄"].map((emoji) => {
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

        {responseType === "formulario breve" && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-[#607794]">Situación</label>
              <textarea
                value={form1}
                onChange={(e) => setForm1(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-[#607794]">Pensamiento o interpretación</label>
              <textarea
                value={form2}
                onChange={(e) => setForm2(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-[#607794]">Respuesta o siguiente paso</label>
              <textarea
                value={form3}
                onChange={(e) => setForm3(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm"
                rows={2}
              />
            </div>
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
