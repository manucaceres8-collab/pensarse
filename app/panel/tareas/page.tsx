"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  duration: string;
  responseType:
    | "texto corto"
    | "escala 1-5"
    | "escala 1-10"
    | "selección emoji"
    | "formulario breve";
  instructions: string;
  kind: "base" | "personalizada";
};

const responseTone: Record<TaskTemplate["responseType"], string> = {
  "texto corto": "border-sky-200 bg-sky-50 text-sky-700",
  "escala 1-5": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "escala 1-10": "border-blue-200 bg-blue-50 text-blue-700",
  "selección emoji": "border-amber-200 bg-amber-50 text-amber-700",
  "formulario breve": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function TareasPanelPage() {
  const [biblioteca, setBiblioteca] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBiblioteca() {
      try {
        const res = await fetch("/api/demo/tasks", { cache: "no-store" });
        const data = (await res.json()) as { tasks: TaskTemplate[] };
        if (mounted) {
          setBiblioteca(data.tasks ?? []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBiblioteca();

    return () => {
      mounted = false;
    };
  }, []);

  const totalPersonalizadas = useMemo(
    () => biblioteca.filter((item) => item.kind === "personalizada").length,
    [biblioteca]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Tareas</h1>
            <p className="mt-2 text-sm text-[#4f617b]">
              Gestiona tu biblioteca y crea tareas personalizadas para asignar a pacientes.
            </p>
          </div>
          <Link
            href="/panel/tareas/nueva"
            className="rounded-xl !bg-[#0f1f3f] px-4 py-2 text-sm font-medium !text-white transition hover:!bg-[#1a2c4f]"
          >
            Crear tarea personalizada
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-[#0f172a]">A) Biblioteca de tareas</h2>
            <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#1f304b]">
              {biblioteca.length} plantillas
            </span>
          </div>

          <div className="mt-4 max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {loading && (
              <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
                Cargando biblioteca...
              </div>
            )}

            {!loading &&
              biblioteca.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1f2d45]">{item.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.kind === "personalizada" && (
                        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
                          Personalizada
                        </span>
                      )}
                      <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-[#4f617b]">{item.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={["rounded-full border px-3 py-1 text-xs", responseTone[item.responseType]].join(" ")}>
                      {item.responseType}
                    </span>
                    <Link
                      href="/panel/pacientes"
                      className="rounded-full border border-[#cbd8ea] bg-[#edf4ff] px-3 py-1 text-xs font-medium text-[#1f304b] hover:bg-white"
                    >
                      Asignar a paciente
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </article>

        <article className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">B) Crear tarea personalizada</h2>
          <p className="mt-2 text-sm text-[#4f617b]">
            Diseña tareas reutilizables para tu práctica clínica. Al guardarlas, se añaden automáticamente a la biblioteca.
          </p>

          <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
            <p className="text-sm font-semibold text-[#1f2d45]">Tu biblioteca ahora</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Plantillas base</p>
                <p className="mt-1 text-lg font-semibold text-[#0f172a]">{biblioteca.length - totalPersonalizadas}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Personalizadas</p>
                <p className="mt-1 text-lg font-semibold text-[#0f172a]">{totalPersonalizadas}</p>
              </div>
            </div>
          </div>

          <Link
            href="/panel/tareas/nueva"
            className="mt-4 inline-flex rounded-xl border border-[#cbd8ea] bg-[#edf4ff] px-4 py-2 text-sm font-medium text-[#1f304b] hover:bg-white"
          >
            Ir al creador de tareas
          </Link>
        </article>
      </section>
    </div>
  );
}
