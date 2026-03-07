"use client";

import ProfileAvatar from "../../../components/ProfileAvatar";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DemoTask = {
  id: string;
  title: string;
  description: string;
  status: "Pendiente" | "Completada";
  updatedAt: string;
};

type DemoNote = {
  id: string;
  text: string;
  author: "paciente" | "psicologo";
  createdAt: string;
};

type DemoCheckin = {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
};

type DemoPatient = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastCheckinAt: string;
  tasks: DemoTask[];
  notes: DemoNote[];
  checkins: DemoCheckin[];
};

type TareaRepo = {
  id: string;
  titulo: string;
  descripcion: string;
};

const repositorio: TareaRepo[] = [
  {
    id: "abc",
    titulo: "Registro ABC",
    descripcion: "Situacion, pensamiento, emocion y conducta.",
  },
  {
    id: "registro",
    titulo: "Registro diario breve",
    descripcion: "Sintesis rapida de como ha ido el dia.",
  },
  {
    id: "reestructuracion",
    titulo: "Reestructuracion cognitiva",
    descripcion: "Crear pensamiento alternativo equilibrado.",
  },
  {
    id: "respiracion",
    titulo: "Respiracion 2 minutos",
    descripcion: "Respiracion lenta para bajar activacion.",
  },
];

function formatDate(value: string) {
  if (!value) return "Sin actividad";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PacienteDetalle() {
  const params = useParams();
  const patientId = String(params.id ?? "maria");

  const [patient, setPatient] = useState<DemoPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [mostrarRepositorio, setMostrarRepositorio] = useState(false);

  async function loadPatient() {
    setLoading(true);
    try {
      const res = await fetch(`/api/demo/patients/${patientId}`, { cache: "no-store" });
      if (!res.ok) {
        setPatient(null);
        return;
      }
      const data = (await res.json()) as { patient: DemoPatient };
      setPatient(data.patient);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function asignarTarea(item: TareaRepo) {
    setSavingTask(item.id);
    try {
      await fetch(`/api/demo/patients/${patientId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: item.id,
          title: item.titulo,
          description: item.descripcion,
        }),
      });
      await loadPatient();
    } finally {
      setSavingTask(null);
    }
  }

  const pendientes = useMemo(
    () => patient?.tasks.filter((t) => t.status === "Pendiente").length ?? 0,
    [patient]
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-slate-500">
        Cargando ficha del paciente...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-sm text-slate-500">
        Paciente no encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{patient.name}</h1>
                <p className="mt-1 text-sm text-slate-500">Seguimiento individual del paciente</p>
              </div>

              <button
                onClick={() => setMostrarRepositorio((v) => !v)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {mostrarRepositorio ? "Cerrar repositorio" : "Asignar tarea"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Ultimo check-in</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(patient.lastCheckinAt)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Estado actual</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{patient.status}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <p className="text-xs text-slate-500">Tareas pendientes</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{pendientes}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-center">
            <ProfileAvatar
              src={patient.avatar}
              fallbackSrc="/paciente-maria.svg"
              alt={`Foto de ${patient.name}`}
              className="mx-auto h-28 w-28 rounded-full border border-blue-100 bg-blue-50 object-cover"
            />
            <p className="mt-3 text-sm font-semibold text-slate-900">{patient.name}</p>
            <p className="text-xs text-slate-500">Plan activo</p>
          </div>
        </div>
      </section>

      {mostrarRepositorio && (
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Repositorio de tareas</h2>
          <p className="mt-1 text-sm text-slate-500">Al asignar, aparece en la zona del paciente.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {repositorio.map((item) => {
              const yaAsignada = patient.tasks.some((t) => t.id === item.id);
              const busy = savingTask === item.id;

              return (
                <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.descripcion}</p>
                  <button
                    onClick={() => asignarTarea(item)}
                    disabled={yaAsignada || busy}
                    className={[
                      "mt-4 rounded-xl px-3 py-2 text-xs font-medium",
                      yaAsignada || busy
                        ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                        : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
                    ].join(" ")}
                  >
                    {yaAsignada ? "Ya asignada" : busy ? "Asignando..." : "Asignar"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Ultimos check-ins</h2>
          <div className="mt-4 space-y-2">
            {patient.checkins.length === 0 && (
              <p className="text-sm text-slate-500">Aun no hay check-ins.</p>
            )}
            {patient.checkins.slice(0, 4).map((checkin) => (
              <div key={checkin.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="text-xs text-slate-500">{formatDate(checkin.createdAt)} · {checkin.mood}</p>
                <p className="mt-1 text-sm text-slate-700">{checkin.text || "Sin texto"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Notas recientes</h2>
          <div className="mt-4 space-y-2">
            {patient.notes.length === 0 && (
              <p className="text-sm text-slate-500">Aun no hay notas.</p>
            )}
            {patient.notes.slice(0, 4).map((note) => (
              <div key={note.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-slate-600">
                <p className="text-xs text-slate-500">
                  {formatDate(note.createdAt)} · {note.author}
                </p>
                <p className="mt-1">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Tareas terapeuticas</h2>
        <div className="mt-4 space-y-3">
          {patient.tasks.length === 0 && (
            <p className="text-sm text-slate-500">No hay tareas asignadas.</p>
          )}
          {patient.tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Actualizado: {formatDate(task.updatedAt)}</p>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
