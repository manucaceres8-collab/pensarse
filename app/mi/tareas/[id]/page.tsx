"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type DemoTask = {
  id: string;
  title: string;
  description: string;
  status: "Pendiente" | "Completada";
  lastAnswer: string;
};

type DemoPatient = {
  tasks: DemoTask[];
};

export default function TareaEjercicio() {
  const params = useParams();
  const taskId = String(params.id);

  const [task, setTask] = useState<DemoTask | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const [situacion, setSituacion] = useState("");
  const [pensamiento, setPensamiento] = useState("");
  const [emocion, setEmocion] = useState("");
  const [conducta, setConducta] = useState("");

  const [pensamientoAlt, setPensamientoAlt] = useState("");
  const [registroBreve, setRegistroBreve] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTask() {
      const res = await fetch("/api/demo/patients/maria", { cache: "no-store" });
      if (!res.ok) return;

      const data = (await res.json()) as { patient: DemoPatient };
      const found = data.patient.tasks.find((item) => item.id === taskId) ?? null;

      if (!mounted || !found) {
        return;
      }

      setTask(found);
      if (taskId === "registro") {
        setRegistroBreve(found.lastAnswer || "");
      }
      if (taskId === "reestructuracion") {
        setPensamientoAlt(found.lastAnswer || "");
      }
      if (taskId === "abc" && found.lastAnswer) {
        const [a = "", b = "", c = "", d = ""] = found.lastAnswer.split("\n---\n");
        setSituacion(a);
        setPensamiento(b);
        setEmocion(c);
        setConducta(d);
      }
    }

    loadTask();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  function buildAnswer() {
    if (taskId === "registro") {
      return registroBreve.trim();
    }
    if (taskId === "abc") {
      return [situacion, pensamiento, emocion, conducta].map((v) => v.trim()).join("\n---\n");
    }
    if (taskId === "reestructuracion") {
      return pensamientoAlt.trim();
    }
    return "";
  }

  async function guardar() {
    setSaving(true);
    try {
      const answer = buildAnswer();

      await fetch(`/api/demo/patients/maria/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Completada",
          lastAnswer: answer,
        }),
      });

      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/mi/tareas" className="text-sm text-slate-500 hover:text-slate-700">
        Volver a tareas
      </Link>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <h1 className="text-2xl font-semibold text-slate-900">{task?.title ?? "Ejercicio terapeutico"}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Al guardar, se actualiza tu tarea y el psicologo lo ve en tu ficha.
        </p>
      </section>

      {taskId === "registro" && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Registro diario breve</h2>
          <p className="mt-2 text-sm text-slate-600">Escribe en 1-2 frases como te fue hoy.</p>
          <textarea
            value={registroBreve}
            onChange={(e) => setRegistroBreve(e.target.value)}
            className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
            rows={4}
            placeholder="Hoy me he sentido..."
          />
          <button
            onClick={guardar}
            disabled={saving}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </section>
      )}

      {taskId === "abc" && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Registro ABC</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-slate-600">Situacion</label>
              <textarea
                value={situacion}
                onChange={(e) => setSituacion(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Pensamiento automatico</label>
              <textarea
                value={pensamiento}
                onChange={(e) => setPensamiento(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Emocion</label>
              <textarea
                value={emocion}
                onChange={(e) => setEmocion(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Conducta</label>
              <textarea
                value={conducta}
                onChange={(e) => setConducta(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"
                rows={2}
              />
            </div>
          </div>
          <button
            onClick={guardar}
            disabled={saving}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </section>
      )}

      {taskId === "reestructuracion" && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Reestructuracion cognitiva</h2>
          <p className="mt-2 text-sm text-slate-600">Escribe un pensamiento alternativo mas equilibrado.</p>
          <textarea
            value={pensamientoAlt}
            onChange={(e) => setPensamientoAlt(e.target.value)}
            className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
            rows={4}
            placeholder="Podria ser que..."
          />
          <button
            onClick={guardar}
            disabled={saving}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </section>
      )}

      {done && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Ejercicio guardado y enviado al psicologo
        </div>
      )}
    </div>
  );
}
