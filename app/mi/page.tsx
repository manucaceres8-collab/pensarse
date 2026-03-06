"use client";

import { useState } from "react";

type Mood = "😄" | "🙂" | "😐" | "😔" | "😣";

type Task = {
  id: string;
  title: string;
  subtitle: string;
  status: "pendiente" | "hecha";
};

export default function MiHome() {
  const moods: Mood[] = ["😄", "🙂", "😐", "😔", "😣"];
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [registroHoy, setRegistroHoy] = useState("");
  const [notas, setNotas] = useState("");
  const [guardado, setGuardado] = useState(false);

  const tasks: Task[] = [
    {
      id: "registro",
      title: "Registro diario breve",
      subtitle: "Escribe en 1–2 frases cómo ha ido el día.",
      status: "pendiente",
    },
    {
      id: "abc",
      title: "Registro ABC",
      subtitle: "Situación, pensamiento, emoción y conducta.",
      status: "pendiente",
    },
    {
      id: "reestructuracion",
      title: "Reestructuración cognitiva simple",
      subtitle: "Busca un pensamiento alternativo más equilibrado.",
      status: "hecha",
    },
  ];

  function guardarCheckin() {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">María López</h1>
        <p className="text-sm text-slate-500">Tu seguimiento</p>
      </div>

      <section
        id="checkin"
        className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Registro diario
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Haz tu check-in en 20 segundos.
            </p>
          </div>

          {guardado && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              ✅ Guardado (demo)
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-2xl">
          {moods.map((m) => {
            const active = selectedMood === m;

            return (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={[
                  "rounded-2xl border px-5 py-4 shadow-sm transition",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <label className="text-sm text-slate-600">
            ¿Qué me ha pasado hoy?
          </label>

          <textarea
            value={registroHoy}
            onChange={(e) => setRegistroHoy(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-slate-300"
            rows={3}
            placeholder="Escribe aquí..."
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={guardarCheckin}
            disabled={!selectedMood}
            className={[
              "rounded-2xl px-5 py-3 text-sm text-white shadow",
              selectedMood
                ? "bg-slate-900 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-300",
            ].join(" ")}
          >
            Guardar registro
          </button>

          <span className="text-xs text-slate-500">
            {selectedMood
              ? `Emoción seleccionada: ${selectedMood}`
              : "Selecciona una emoción"}
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tareas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ejercicios enviados por tu psicólogo.
            </p>
          </div>

          <a
            href="/mi/tareas"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50"
          >
            Ver todas
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {tasks.map((task) => (
            <a
              key={task.id}
              href={`/mi/tareas/${task.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {task.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {task.subtitle}
                  </div>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full border px-3 py-1 text-xs",
                    task.status === "hecha"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {task.status === "hecha" ? "Hecha" : "Pendiente"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Notas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Para registrar algo importante si te apetece.
        </p>

        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-slate-300"
          rows={5}
          placeholder="Escribe aquí una nota personal..."
        />
      </section>
    </div>
  );
}
