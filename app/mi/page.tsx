"use client";

import Link from "next/link";
import ProfileAvatar from "../components/ProfileAvatar";
import { useEffect, useState } from "react";

type Mood = "Muy bien" | "Bien" | "Neutro" | "Bajo" | "Muy bajo";

type DemoTask = {
  id: string;
  title: string;
  description: string;
  status: "Pendiente" | "Completada";
};

type DemoPatient = {
  id: string;
  name: string;
  avatar: string;
  lastCheckinAt: string;
  tasks: DemoTask[];
  notes: { id: string; text: string }[];
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
  const moods: Mood[] = ["Muy bien", "Bien", "Neutro", "Bajo", "Muy bajo"];

  const [patient, setPatient] = useState<DemoPatient | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
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

  async function guardarCheckin() {
    if (!selectedMood) return;

    setSavingCheckin(true);
    try {
      await fetch("/api/demo/patients/maria/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, text: registroHoy.trim() }),
      });

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
  const pendientes = patient?.tasks.filter((t) => t.status === "Pendiente").length ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tu seguimiento</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Lo que registres aqui se refleja en la ficha del psicologo.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Ultimo check-in</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(patient?.lastCheckinAt ?? "")}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Tareas activas</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{pendientes}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Notas enviadas</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{patient?.notes.length ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-center">
            <ProfileAvatar
              src={patient?.avatar ?? "/profiles/paciente-1.jpg"}
              fallbackSrc="/paciente-maria.svg"
              alt="Foto del paciente"
              className="mx-auto h-28 w-28 rounded-full border border-blue-100 bg-blue-50 object-cover"
            />
            <p className="mt-3 text-sm font-semibold text-slate-900">{patient?.name ?? "Paciente"}</p>
            <p className="text-xs text-slate-500">Paciente en seguimiento</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Check-in diario</h2>
            <p className="mt-1 text-sm text-slate-500">En menos de 1 minuto.</p>
          </div>
          {guardado && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              Guardado y enviado al psicologo
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {moods.map((m) => {
            const active = selectedMood === m;

            return (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  active
                    ? "border-blue-300 bg-blue-600 text-white"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-slate-700 hover:bg-blue-50",
                ].join(" ")}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-600">Que te ha pasado hoy</label>
          <textarea
            value={registroHoy}
            onChange={(e) => setRegistroHoy(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm outline-none focus:border-blue-300"
            rows={3}
            placeholder="Escribe aqui..."
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={guardarCheckin}
            disabled={!selectedMood || savingCheckin}
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium text-white",
              selectedMood && !savingCheckin
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-300",
            ].join(" ")}
          >
            {savingCheckin ? "Guardando..." : "Guardar registro"}
          </button>
          <span className="text-xs text-slate-500">
            {selectedMood ? `Estado seleccionado: ${selectedMood}` : "Selecciona un estado"}
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tareas</h2>
            <p className="mt-1 text-sm text-slate-500">Ejercicios enviados por tu psicologo.</p>
          </div>

          <Link
            href="/mi/tareas"
            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
          >
            Ver todas
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {taskPreview.length === 0 && (
            <p className="text-sm text-slate-500">No hay tareas asignadas todavia.</p>
          )}
          {taskPreview.map((task) => (
            <Link
              key={task.id}
              href={`/mi/tareas/${task.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 transition hover:bg-blue-50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                </div>

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
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Notas personales</h2>
        <p className="mt-1 text-sm text-slate-500">Se guardan y se comparten con el psicologo.</p>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm outline-none focus:border-blue-300"
          rows={5}
          placeholder="Escribe aqui una nota personal..."
        />
        <button
          onClick={guardarNota}
          disabled={!notas.trim() || savingNote}
          className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {savingNote ? "Guardando..." : "Guardar nota"}
        </button>
      </section>
    </div>
  );
}
