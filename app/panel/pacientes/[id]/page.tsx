"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProfileAvatar from "../../../components/ProfileAvatar";

type PatientTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: "Pendiente" | "En curso" | "Completada";
  createdAt: string;
  updatedAt: string;
  lastAnswer: string;
};

type PatientNote = {
  id: string;
  text: string;
  author: "paciente" | "psicólogo";
  createdAt: string;
};

type PatientCheckin = {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
};

type PatientPayload = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  trackingScale: "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";
  lastCheckinAt: string;
  tasks: PatientTask[];
  notes: PatientNote[];
  checkins: PatientCheckin[];
};

type PatientReport = {
  patientId: string;
  name: string;
  avatar: string;
  trackingScale: "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";
  periodLabel: string;
  lastUpdatedAt: string;
  averageLabel: string;
  trendLabel: string;
  completedCheckins: number;
  activeTasks: number;
  completedTasks: number;
  progressPercent: number;
  progressLabel: string;
  summary: string;
  bars: Array<{ label: string; value: number; hasData: boolean }>;
};

type TaskLibraryItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  responseType: "texto corto" | "escala" | "selección" | "emojis" | "formulario breve";
  therapyType: "tcc" | "act" | "dbt" | "soluciones" | "personalizadas";
  kind: "base" | "personalizada";
};

const scaleOptions = [
  { value: "emoji", label: "Emojis emocionales" },
  { value: "numeric_5", label: "Escala numérica 1-5" },
  { value: "numeric_10", label: "Escala numérica 1-10" },
  { value: "wellbeing_text", label: "Escala textual bienestar" },
  { value: "anxiety_text", label: "Escala de ansiedad" },
] as const;

const responseTone: Record<TaskLibraryItem["responseType"], string> = {
  "texto corto": "border-sky-200 bg-sky-50 text-sky-700",
  escala: "border-indigo-200 bg-indigo-50 text-indigo-700",
  selección: "border-cyan-200 bg-cyan-50 text-cyan-700",
  emojis: "border-amber-200 bg-amber-50 text-amber-700",
  "formulario breve": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const therapyTone: Record<TaskLibraryItem["therapyType"], string> = {
  tcc: "border-blue-200 bg-blue-50 text-blue-700",
  act: "border-teal-200 bg-teal-50 text-teal-700",
  dbt: "border-rose-200 bg-rose-50 text-rose-700",
  soluciones: "border-lime-200 bg-lime-50 text-lime-700",
  personalizadas: "border-violet-200 bg-violet-50 text-violet-700",
};

const therapyLabel: Record<TaskLibraryItem["therapyType"], string> = {
  tcc: "TCC",
  act: "ACT",
  dbt: "DBT",
  soluciones: "Terapia centrada en soluciones",
  personalizadas: "Personalizadas",
};

const therapyFilters: Array<{ value: "todas" | TaskLibraryItem["therapyType"]; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "tcc", label: "TCC" },
  { value: "act", label: "ACT" },
  { value: "dbt", label: "DBT" },
  { value: "soluciones", label: "Soluciones" },
  { value: "personalizadas", label: "Personalizadas" },
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
  const router = useRouter();
  const patientId = String(params.id ?? "");

  const [patient, setPatient] = useState<PatientPayload | null>(null);
  const [report, setReport] = useState<PatientReport | null>(null);
  const [repo, setRepo] = useState<TaskLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [mostrarRepositorio, setMostrarRepositorio] = useState(false);
  const [updatingScale, setUpdatingScale] = useState(false);
  const [therapyFilter, setTherapyFilter] = useState<"todas" | TaskLibraryItem["therapyType"]>("todas");
  const [deletingPatient, setDeletingPatient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPatient() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients/${patientId}`, { cache: "no-store" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setPatient(null);
        setError(data.error ?? "No se pudo cargar la ficha del paciente.");
        return;
      }

      const data = (await res.json()) as { patient: PatientPayload };
      setPatient(data.patient);
    } finally {
      setLoading(false);
    }
  }

  async function loadRepositorio() {
    const res = await fetch("/api/patients/tasks", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { tasks: TaskLibraryItem[] };
    setRepo(data.tasks ?? []);
  }

  async function loadReport() {
    const res = await fetch(`/api/patients/reports/${patientId}`, { cache: "no-store" });
    if (!res.ok) {
      setReport(null);
      return;
    }

    const data = (await res.json()) as { report: PatientReport };
    setReport(data.report);
  }

  useEffect(() => {
    if (!patientId) return;

    loadPatient();
    loadRepositorio();
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function asignarTarea(item: TaskLibraryItem) {
    setSavingTask(item.id);
    setError(null);

    try {
      const res = await fetch(`/api/patients/${patientId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: item.id,
          title: item.title,
          description: item.description,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo asignar la tarea.");
        return;
      }

      await loadPatient();
      await loadReport();
    } finally {
      setSavingTask(null);
    }
  }

  async function guardarEscala(trackingScale: PatientPayload["trackingScale"]) {
    setUpdatingScale(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingScale }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo actualizar la escala.");
        return;
      }

      await loadPatient();
      await loadReport();
    } finally {
      setUpdatingScale(false);
    }
  }

  async function eliminarPaciente() {
    if (!patient) return;

    const confirmed = window.confirm(`¿Eliminar paciente ${patient.name}? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeletingPatient(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo eliminar el paciente.");
        return;
      }

      router.push("/panel/pacientes");
      router.refresh();
    } finally {
      setDeletingPatient(false);
    }
  }

  const pendientes = useMemo(
    () => patient?.tasks.filter((t) => t.status === "Pendiente" || t.status === "En curso").length ?? 0,
    [patient]
  );

  const repoFiltrado = useMemo(() => {
    if (therapyFilter === "todas") return repo;
    return repo.filter((item) => item.therapyType === therapyFilter);
  }, [repo, therapyFilter]);

  if (loading) {
    return (
      <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
        Cargando ficha del paciente...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="rounded-[24px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
        {error ?? "Paciente no encontrado."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">{patient.name}</h1>
                <p className="mt-1 text-sm text-[#4f617b]">Seguimiento individual del paciente</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMostrarRepositorio((value) => !value)}
                  className="rounded-xl !bg-[#0f1f3f] px-4 py-2 text-sm font-medium !text-white transition hover:!bg-[#1a2c4f]"
                >
                  {mostrarRepositorio ? "Cerrar repositorio" : "Asignar tarea"}
                </button>
                <button
                  onClick={eliminarPaciente}
                  disabled={deletingPatient}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingPatient ? "Eliminando..." : "Eliminar paciente"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Último check-in</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{formatDate(patient.lastCheckinAt)}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Estado actual</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">{patient.status}</p>
              </div>
              <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                <p className="text-xs text-[#607794]">Escala de seguimiento</p>
                <p className="mt-1 text-sm font-semibold text-[#1f2d45]">
                  {scaleOptions.find((scale) => scale.value === patient.trackingScale)?.label ?? "Emojis emocionales"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d9e1ee] bg-white p-4 text-center">
            <ProfileAvatar
              src={patient.avatar}
              fallbackSrc="/avatars/placeholder.svg"
              alt={`Foto de ${patient.name}`}
              size={80}
              className="mx-auto h-20 w-20 rounded-full border border-[#cfdae9] bg-[#f7f9fd] object-cover"
            />
            <p className="mt-3 text-sm font-semibold text-[#1f2d45]">{patient.name}</p>
            <p className="text-xs text-[#607794]">Plan activo</p>
          </div>
        </div>
      </section>

      {error && (
        <section className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </section>
      )}

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Configuración de registro diario</h2>
        <p className="mt-1 text-sm text-[#4f617b]">
          El paciente verá esta escala en su check-in de menos de 20 segundos.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={patient.trackingScale}
            onChange={(e) => guardarEscala(e.target.value as PatientPayload["trackingScale"])}
            disabled={updatingScale}
            className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#1f2d45] outline-none focus:border-[#b8c8de] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {scaleOptions.map((scale) => (
              <option key={scale.value} value={scale.value}>
                {scale.label}
              </option>
            ))}
          </select>
          {updatingScale && <span className="text-xs text-[#607794]">Guardando...</span>}
          {!updatingScale && <span className="text-xs text-[#607794]">Tareas pendientes: {pendientes}</span>}
        </div>
      </section>

      {report && (
        <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#0f172a]">Informe de evolución</h2>
              <p className="mt-1 text-sm text-[#4f617b]">{report.summary}</p>
            </div>
            <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#607794]">
              {report.periodLabel}
            </span>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <div className="flex items-center justify-between text-xs text-[#607794]">
                <span>{report.periodLabel}</span>
                <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1">
                  media {report.averageLabel}
                </span>
              </div>

              <div className="mt-4 flex h-28 items-end justify-between gap-2">
                {(report.bars.length > 0 ? report.bars : [{ label: "-", value: 16, hasData: false }]).map((bar, index) => (
                  <div key={`${bar.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={[
                        "w-7 rounded-t-2xl shadow-[0_4px_12px_rgba(17,111,177,0.22)] sm:w-8",
                        bar.hasData ? "bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef]" : "bg-[#dbe7f4]",
                      ].join(" ")}
                      style={{ height: `${bar.value}px` }}
                    />
                    <span className="text-[10px] text-[#607794]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#607794]">Progreso terapéutico</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0f172a]">{report.progressPercent}%</p>
                </div>
                <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                  {report.progressLabel}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#deebf8]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0f1f3f] via-[#1272b7] to-[#21b5ee]"
                  style={{ width: `${report.progressPercent}%` }}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                  <p className="text-xs text-[#607794]">Registros</p>
                  <p className="mt-1 text-lg font-semibold text-[#0f172a]">{report.completedCheckins}</p>
                </div>
                <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                  <p className="text-xs text-[#607794]">Activas</p>
                  <p className="mt-1 text-lg font-semibold text-[#0f172a]">{report.activeTasks}</p>
                </div>
                <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                  <p className="text-xs text-[#607794]">Completadas</p>
                  <p className="mt-1 text-lg font-semibold text-[#0f172a]">{report.completedTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {mostrarRepositorio && (
        <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Repositorio de tareas</h2>
          <p className="mt-1 text-sm text-[#4f617b]">
            Puedes asignar tareas base o personalizadas. Cada asignación crea una nueva instancia pendiente.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {therapyFilters.map((filter) => {
              const active = therapyFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setTherapyFilter(filter.value)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    active
                      ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                      : "border-[#d5deea] bg-[#f6f9ff] text-[#1f304b] hover:bg-white",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {repoFiltrado.length === 0 && (
              <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
                No hay tareas disponibles para este filtro.
              </div>
            )}

            {repoFiltrado.map((item) => {
              const busy = savingTask === item.id;

              return (
                <div key={item.id} className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1f2d45]">{item.title}</p>
                    <span className={["rounded-full border px-3 py-1 text-xs", therapyTone[item.therapyType]].join(" ")}>
                      {therapyLabel[item.therapyType]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#4f617b]">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                      {item.duration}
                    </span>
                    <span className={["rounded-full border px-3 py-1 text-xs", responseTone[item.responseType]].join(" ")}>
                      {item.responseType}
                    </span>
                  </div>
                  <button
                    onClick={() => asignarTarea(item)}
                    disabled={busy}
                    className={[
                      "mt-4 rounded-xl px-3 py-2 text-xs font-medium",
                      busy
                        ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                        : "border border-[#d5deea] bg-[#f6f9ff] text-[#1f304b] hover:bg-white",
                    ].join(" ")}
                  >
                    {busy ? "Asignando..." : "Asignar tarea"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Últimos check-ins</h2>
          <div className="mt-4 space-y-2">
            {patient.checkins.length === 0 && (
              <p className="text-sm text-[#4f617b]">Aún no hay check-ins.</p>
            )}
            {patient.checkins.slice(0, 4).map((checkin) => (
              <div key={checkin.id} className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3">
                <p className="text-xs text-[#607794]">
                  {formatDate(checkin.createdAt)} · {checkin.mood}
                </p>
                <p className="mt-1 text-sm text-[#1f2d45]">{checkin.text || "Sin texto"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Notas recientes</h2>
          <div className="mt-4 space-y-2">
            {patient.notes.length === 0 && (
              <p className="text-sm text-[#4f617b]">Aún no hay notas.</p>
            )}
            {patient.notes.slice(0, 4).map((note) => (
              <div key={note.id} className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#1f2d45]">
                <p className="text-xs text-[#607794]">
                  {formatDate(note.createdAt)} · {note.author}
                </p>
                <p className="mt-1">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Tareas terapéuticas</h2>
        <div className="mt-4 space-y-3">
          {patient.tasks.length === 0 && (
            <p className="text-sm text-[#4f617b]">No hay tareas asignadas.</p>
          )}
          {patient.tasks.map((task) => (
            <Link
              key={task.id}
              href={`/panel/pacientes/${patient.id}/tareas/${task.id}`}
              className="block rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 transition hover:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1f2d45]">{task.title}</p>
                  <p className="mt-1 text-sm text-[#4f617b]">{task.description}</p>
                  <p className="mt-2 text-xs text-[#607794]">Asignada: {formatDate(task.createdAt)}</p>
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
    </div>
  );
}
