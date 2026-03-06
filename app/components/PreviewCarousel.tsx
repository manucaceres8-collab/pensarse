"use client";

import { useMemo, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  badge: string;
  emoji: string;
  rows: { label: string; value: string }[];
  pills: string[];
};

export default function PreviewCarousel() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        title: "Panel del psicólogo",
        subtitle: "Resumen antes de sesión",
        badge: "Dashboard",
        emoji: "🧠",
        rows: [
          { label: "Pacientes activos", value: "6" },
          { label: "Check-ins hoy", value: "3" },
          { label: "Tareas pendientes", value: "4" },
        ],
        pills: ["Hoy", "Últimos 7 días", "Tareas"],
      },
      {
        title: "Lista de pacientes",
        subtitle: "Estado de un vistazo",
        badge: "CRM",
        emoji: "📋",
        rows: [
          { label: "😐 María", value: "hoy · 2 tareas" },
          { label: "🙂 Juan", value: "ayer · 1 tarea" },
          { label: "😔 Carlos", value: "ayer · 3 tareas" },
        ],
        pills: ["Activos", "En seguimiento", "Nuevos"],
      },
      {
        title: "Ficha del paciente",
        subtitle: "Evolución + tareas",
        badge: "Paciente",
        emoji: "📈",
        rows: [
          { label: "Evolución", value: "🙂 😐 🙂 😄 🙂" },
          { label: "Notas", value: "3" },
          { label: "Tareas", value: "2 pendientes" },
        ],
        pills: ["Evolución", "Notas", "Tareas"],
      },
    ],
    []
  );

  const [i, setI] = useState(0);

  function prev() {
    setI((v) => (v - 1 + slides.length) % slides.length);
  }
  function next() {
    setI((v) => (v + 1) % slides.length);
  }

  const s = slides[i];

  return (
    <section className="mt-10 rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
            Vista previa del producto
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Pantallas demo para que un psicólogo entienda el flujo en 10 segundos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50"
          >
            ←
          </button>
          <div className="text-xs text-slate-500">
            {i + 1} / {slides.length}
          </div>
          <button
            onClick={next}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50"
          >
            →
          </button>
        </div>
      </div>

      {/* “Mockup” tipo app */}
      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm">
          <div className="absolute -right-8 -top-8 text-7xl opacity-[0.10]">
            {s.emoji}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-500">{s.subtitle}</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {s.title}
              </div>
            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              {s.badge}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {s.pills.map((p) => (
              <span
                key={p}
                className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {s.rows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="text-sm text-slate-700">{r.label}</div>
                <div className="text-sm font-semibold text-slate-900">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500">Demo UI</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              Sin datos reales
            </span>
          </div>
        </div>

        {/* Columna “por qué importa” */}
        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            ¿Qué ve el psicólogo?
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Resumen de proceso entre sesiones: emociones, notas rápidas y tareas.
            La sesión empieza con foco.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              ✅ Menos tiempo “poniéndose al día”
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              ✅ Más continuidad entre sesiones
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              ✅ Tareas con seguimiento claro
            </div>
          </div>

          <a href="/panel" className="mt-6 block">
            <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow hover:bg-slate-800">
              Abrir demo psicólogo
            </button>
          </a>
        </div>
      </div>

      {/* puntos */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={[
              "h-2 w-2 rounded-full",
              idx === i ? "bg-slate-900" : "bg-slate-300",
            ].join(" ")}
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
