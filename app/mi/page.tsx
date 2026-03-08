"use client";

import Link from "next/link";
import ProfileAvatar from "../components/ProfileAvatar";
import { useEffect, useMemo, useState } from "react";

type TrackingScale = "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";

type DemoTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: "Pendiente" | "En curso" | "Completada";
};

type DemoPatient = {
  id: string;
  name: string;
  avatar: string;
  lastCheckinAt: string;
  trackingScale: TrackingScale;
  tasks: DemoTask[];
  notes: { id: string; text: string }[];
};

const SCALE_UI: Record<
  TrackingScale,
  {
    label: string;
    helper: string;
    options: string[];
    compact?: boolean;
  }
> = {
  emoji: {
    label: "Escala emocional",
    helper: "Selecciona el emoji que mejor te represente hoy.",
    options: ["😣", "😔", "😐", "🙂", "😄"],
    compact: true,
  },
  numeric_5: {
    label: "Escala numérica 1-5",
    helper: "1 es muy bajo y 5 es muy alto.",
    options: ["1", "2", "3", "4", "5"],
  },
  numeric_10: {
    label: "Escala numérica 1-10",
    helper: "1 es muy bajo y 10 es muy alto.",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  wellbeing_text: {
    label: "Escala de bienestar",
    helper: "Describe tu estado general del día.",
    options: ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"],
  },
  anxiety_text: {
    label: "Escala de ansiedad",
    helper: "Indica el nivel de ansiedad que has sentido hoy.",
    options: ["Nada", "Poca", "Media", "Alta", "Muy alta"],
  },
};

function formatDate(value: string) {
  if (!value) return "Sin registros";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MiHome() {
  const [patient, setPatient] = useState<DemoPatient | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [registroHoy, setRegistroHoy] = useState("");
  const [notas, setNotas] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [savingCheckin, setSavingCheckin] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  async function loadPatient() {
    const res = await fetch("/api/demo/patients/maria", { cache: "no-store" });
    if (!res.ok) return;

    const data = (await res.json()) as { patient: DemoPatient };
    setPatient(data.patient);
  }

  useEffect(() => {
    loadPatient();
  }, []);

  const scale = patient?.trackingScale ?? "emoji";
  const scaleConfig = SCALE_UI[scale];
  const moodOptions = scaleConfig.options;

  useEffect(() => {
    if (selectedMood && !moodOptions.includes(selectedMood)) {
      setSelectedMood(null);
    }
  }, [moodOptions, selectedMood]);

  async function guardarCheckin() {
    if (!selectedMood) return;

    setSavingCheckin(true);
    try {
      const res = await fetch("/api/demo/patients/maria/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, text: registroHoy.trim() }),
      });

      if (!res.ok) {
        return;
      }

      setGuardado(true);
      setTimeout(() => setGuardado(false), 1800);
      setRegistroHoy("");
      await loadPatient();
    } finally {
      setSavingCheckin(false);
    }
  }

  async function guardarNota() {
    if (!notas.trim()) return;

    setSavingNote(true);
    try {
      await fetch("/api/demo/patients/maria/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: notas.trim(), author: "paciente" }),
      });

      setNotas("");
      await loadPatient();
    } finally {
      setSavingNote(false);
    }
  }

  const taskPreview = patient?.tasks.slice(0, 3) ?? [];
  const pendientes = useMemo(
    () => patient?.tasks.filter((t) => t.status === "Pendiente" || t.status === "En curso").length ?? 0,
    [patient]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Tu seguimiento</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#4f617b]">
              Todo lo que guardes aquí se sincroniza con tu psicólogo.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Último check-in</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{formatDate(patient?.lastCheckinAt ?? "")}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Tareas activas</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{pendientes}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Notas enviadas</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{patient?.notes.length ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d9e1ee] bg-white p-4 text-center">
            <ProfileAvatar
              src={patient?.avatar ?? "/profiles/paciente-1.jpg"}
              fallbackSrc="/paciente-maria.svg"
              alt="Foto del paciente"
              className="mx-auto h-28 w-28 rounded-full border border-[#cfdae9] bg-[#f7f9fd] object-cover"
            />
            <p className="mt-3 text-sm font-semibold text-[#1f2d45]">{patient?.name ?? "Paciente"}</p>
            <p className="text-xs text-[#607794]">Paciente en seguimiento</p>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f172a]">Check-in diario</h2>
            <p className="mt-1 text-sm text-[#607794]">Registro rápido en menos de 20 segundos.</p>
          </div>
          {guardado && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              Guardado y enviado al psicólogo
            </span>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
          <p className="text-sm font-semibold text-[#1f2d45]">{scaleConfig.label}</p>
          <p className="mt-1 text-xs text-[#607794]">{scaleConfig.helper}</p>

          <div
            className={[
              "mt-3 grid gap-2",
              scaleConfig.compact ? "grid-cols-5" : "sm:grid-cols-5",
              scale === "numeric_10" ? "sm:grid-cols-10" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {moodOptions.map((option) => {
              const active = selectedMood === option;
              return (
                <button
                  key={option}
                  onClick={() => setSelectedMood(option)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm transition",
                    scaleConfig.compact ? "text-xl leading-none" : "",
                    active
                      ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                      : "border-[#d9e1ee] bg-white text-[#1f304b] hover:bg-[#eef4ff]",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#607794]">Nota opcional</label>
          <textarea
            value={registroHoy}
            onChange={(e) => setRegistroHoy(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#1f2d45] outline-none focus:border-[#b9c9de]"
            rows={3}
            placeholder="Si quieres, añade una nota breve..."
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={guardarCheckin}
            disabled={!selectedMood || savingCheckin}
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium text-white",
              selectedMood && !savingCheckin
                ? "bg-[#0f1f3f] hover:bg-[#1a2c4f]"
                : "cursor-not-allowed bg-slate-300",
            ].join(" ")}
          >
            {savingCheckin ? "Guardando..." : "Guardar registro"}
          </button>
          <span className="text-xs text-[#607794]">
            {selectedMood ? `Valor seleccionado: ${selectedMood}` : "Selecciona un valor"}
          </span>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f172a]">Tareas</h2>
            <p className="mt-1 text-sm text-[#607794]">Ejercicios enviados por tu psicólogo.</p>
          </div>

          <Link
            href="/mi/tareas"
            className="rounded-full border border-[#cbd8ea] bg-[#edf4ff] px-4 py-2 text-xs font-medium text-[#1f304b]"
          >
            Ver todas
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {taskPreview.length === 0 && <p className="text-sm text-[#4f617b]">No hay tareas asignadas todavía.</p>}
          {taskPreview.map((task) => (
            <Link
              key={task.id}
              href={`/mi/tareas/${task.id}`}
              className="block rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 transition hover:bg-[#eef4ff]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1f2d45]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#4f617b]">{task.description}</p>
                </div>

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
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Notas personales</h2>
        <p className="mt-1 text-sm text-[#607794]">Se guardan y se comparten con el psicólogo.</p>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm outline-none focus:border-[#b9c9de]"
          rows={5}
          placeholder="Escribe aquí una nota personal..."
        />
        <button
          onClick={guardarNota}
          disabled={!notas.trim() || savingNote}
          className="mt-3 rounded-xl bg-[#0f1f3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {savingNote ? "Guardando..." : "Guardar nota"}
        </button>
      </section>
    </div>
  );
}
