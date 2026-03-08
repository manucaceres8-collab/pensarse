"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DemoTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: "Pendiente" | "En curso" | "Completada";
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
    () => tasks.filter((t) => t.status === "Pendiente" || t.status === "En curso").length,
    [tasks]
  );
  const hechas = useMemo(
    () => tasks.filter((t) => t.status === "Completada").length,
    [tasks]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Tareas</h1>
        <p className="mt-2 text-sm text-[#4f617b]">
          Aquí ves lo que te ha asignado tu psicólogo y tu progreso real.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Pendientes</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{pendientes}</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Hechas</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{hechas}</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Total</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{tasks.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        {loading && (
          <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
            Cargando tareas...
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
            Aún no tienes tareas asignadas.
          </div>
        )}

        {!loading &&
          tasks.map((task) => (
            <Link
              key={task.id}
              href={`/mi/tareas/${task.id}`}
              className="block rounded-[24px] border border-[#d7deea] bg-white p-6 transition hover:bg-[#f8fbff]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold text-[#1f2d45]">{task.title}</h2>
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
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#4f617b]">{task.description}</p>
                </div>
                <span className="rounded-full border border-[#cbd8ea] bg-[#edf4ff] px-3 py-2 text-xs font-medium text-[#1f304b]">
                  Abrir tarea
                </span>
              </div>
            </Link>
          ))}
      </section>
    </div>
  );
}
