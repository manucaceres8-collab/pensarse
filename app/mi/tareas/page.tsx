"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DemoTask = {
  id: string;
  title: string;
  description: string;
  status: "Pendiente" | "Completada";
};

type DemoPatient = {
  tasks: DemoTask[];
};

export default function TareasPage() {
  const [tasks, setTasks] = useState<DemoTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadTasks() {
      try {
        const res = await fetch("/api/demo/patients/maria", { cache: "no-store" });
        const data = (await res.json()) as { patient: DemoPatient };
        if (mounted) {
          setTasks(data.patient?.tasks ?? []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      mounted = false;
    };
  }, []);

  const pendientes = useMemo(
    () => tasks.filter((t) => t.status === "Pendiente").length,
    [tasks]
  );
  const hechas = useMemo(
    () => tasks.filter((t) => t.status === "Completada").length,
    [tasks]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tareas</h1>
        <p className="mt-2 text-sm text-slate-600">
          Estas tareas llegan desde el panel del psicologo y se guardan con tu progreso.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{pendientes}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Hechas</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{hechas}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Total</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{tasks.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        {loading && (
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-slate-500">
            Cargando tareas...
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-slate-500">
            Aun no tienes tareas asignadas.
          </div>
        )}

        {!loading &&
          tasks.map((task) => (
            <Link
              key={task.id}
              href={`/mi/tareas/${task.id}`}
              className="block rounded-3xl border border-[var(--border)] bg-white p-6 transition hover:bg-blue-50"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>
                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-xs",
                        task.status === "Completada"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                </div>
                <span className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                  Abrir tarea
                </span>
              </div>
            </Link>
          ))}
      </section>
    </div>
  );
}
