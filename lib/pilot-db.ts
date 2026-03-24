import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export type AppRole = "psicologo" | "paciente";

type PatientRow = {
  id: string;
  name: string | null;
  email: string | null;
  objective: string | null;
  tracking_scale: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

type DailyCheckinRow = {
  id: string;
  patient_id: string;
  value: string | null;
  note: string | null;
  created_at: string;
};

type TaskAssignedRow = {
  id: string;
  patient_id: string;
  task_library_id: string | null;
  goal: string | null;
  instructions: string | null;
  status: string;
  assigned_at: string;
  completed_at: string | null;
};

type TaskResponseRow = {
  id: string;
  task_assigned_id: string;
  response: unknown;
  created_at: string;
};

type PatientNoteRow = {
  id: string;
  patient_id: string;
  text: string;
  author: string;
  created_at: string;
};

type TaskLibraryRow = {
  id: string;
  title: string;
  description: string | null;
};

type ProgressBarPoint = {
  label: string;
  value: number;
  hasData: boolean;
};

export type PsychologistPatientReport = {
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
  bars: ProgressBarPoint[];
};

export async function getCurrentUserAndRole() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null as AppRole | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { user, role: (profile?.role as AppRole | undefined) ?? null };
}

export async function canPsychologistAccessPatient(psychologistId: string, patientId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("patients")
    .select("id")
    .eq("id", patientId)
    .eq("psychologist_id", psychologistId)
    .maybeSingle();

  return Boolean(data);
}

function mapStatus(status: string | null | undefined) {
  if (status === "hecha") return "Completada";
  if (status === "en curso") return "En curso";
  return "Pendiente";
}

function mapTrackingScale(value: string | null | undefined) {
  if (value === "numeric_5" || value === "oneToFive") return "numeric_5";
  if (value === "numeric_10" || value === "oneToTen") return "numeric_10";
  if (value === "wellbeing_text" || value === "bienestar") return "wellbeing_text";
  if (value === "anxiety_text" || value === "ansiedad") return "anxiety_text";
  return "emoji";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeCheckinValue(raw: string | null | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return null;

  if (["😣", "Muy bajo", "Muy mal", "Muy alta"].includes(value)) return 0.2;
  if (["😔", "Bajo", "Mal", "Alta"].includes(value)) return 0.35;
  if (["😐", "Neutro", "Regular", "Media"].includes(value)) return 0.5;
  if (["🙂", "Bien", "Poca"].includes(value)) return 0.75;
  if (["😄", "Muy bien", "Nada"].includes(value)) return 0.95;

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    if (numeric >= 1 && numeric <= 5) return numeric / 5;
    if (numeric >= 1 && numeric <= 10) return numeric / 10;
  }

  return null;
}

function buildProgressBars(checkins: DailyCheckinRow[]) {
  const recent = checkins.slice(0, 7).reverse();
  return recent.map((item) => {
    const normalized = normalizeCheckinValue(item.value);
    return {
      label: new Date(item.created_at).toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 1).toUpperCase(),
      value: normalized ? Math.max(16, Math.round(normalized * 100)) : 16,
      hasData: normalized !== null,
    };
  });
}

function buildSummary(input: {
  adherenceScore: number | null;
  taskScore: number | null;
  trendScore: number | null;
  latestNote?: string;
}) {
  const adherenceText =
    input.adherenceScore === null
      ? "Sin registros suficientes para medir adherencia reciente."
      : input.adherenceScore >= 0.75
        ? "Alta adherencia al seguimiento diario."
        : input.adherenceScore >= 0.4
          ? "Adherencia parcial al seguimiento diario."
          : "Adherencia baja al seguimiento diario.";

  const taskText =
    input.taskScore === null
      ? "Sin tareas suficientes para valorar constancia."
      : input.taskScore >= 0.67
        ? "Buena constancia en tareas terapéuticas."
        : input.taskScore >= 0.34
          ? "Constancia intermedia en tareas terapéuticas."
          : "Constancia baja en tareas terapéuticas.";

  const trendText =
    input.trendScore === null
      ? "Sin suficiente serie temporal para estimar tendencia emocional."
      : input.trendScore >= 0.6
        ? "La tendencia reciente es favorable."
        : input.trendScore >= 0.45
          ? "La tendencia reciente es estable."
          : "La tendencia reciente sugiere mayor vulnerabilidad.";

  const noteText = input.latestNote ? ` Nota reciente: ${input.latestNote}` : "";

  return `${adherenceText} ${trendText} ${taskText}${noteText}`.trim();
}

function buildPatientReport(input: {
  patient: PatientRow;
  checkins: DailyCheckinRow[];
  tasks: TaskAssignedRow[];
  notes: PatientNoteRow[];
}) {
  const recentCheckins = input.checkins.slice(0, 7);
  const normalizedValues = recentCheckins
    .map((item) => normalizeCheckinValue(item.value))
    .filter((value): value is number => value !== null);

  const completedCheckins = recentCheckins.length;
  const activeTasks = input.tasks.filter((task) => task.status === "pendiente" || task.status === "en curso").length;
  const completedTasks = input.tasks.filter((task) => task.status === "hecha").length;
  const totalTasks = activeTasks + completedTasks;

  const adherenceScore = recentCheckins.length > 0 ? Math.min(recentCheckins.length / 7, 1) : null;
  const taskScore = totalTasks > 0 ? completedTasks / totalTasks : null;

  let trendScore: number | null = null;
  if (normalizedValues.length >= 4) {
    const midpoint = Math.floor(normalizedValues.length / 2);
    const firstHalf = normalizedValues.slice(midpoint);
    const secondHalf = normalizedValues.slice(0, midpoint);
    const delta = average(secondHalf) - average(firstHalf);
    trendScore = clamp((delta + 1) / 2, 0, 1);
  } else if (normalizedValues.length > 0) {
    trendScore = average(normalizedValues);
  }

  const weightedParts = [
    adherenceScore === null ? null : adherenceScore * 0.4,
    taskScore === null ? null : taskScore * 0.4,
    trendScore === null ? null : trendScore * 0.2,
  ].filter((value): value is number => value !== null);

  const weightTotal =
    (adherenceScore === null ? 0 : 0.4) + (taskScore === null ? 0 : 0.4) + (trendScore === null ? 0 : 0.2);
  const progressPercent =
    weightTotal > 0 ? Math.round((weightedParts.reduce((sum, value) => sum + value, 0) / weightTotal) * 100) : 0;

  const averageLabel = normalizedValues.length > 0 ? `${(average(normalizedValues) * 10).toFixed(1)}/10` : "Sin datos";
  const trendLabel =
    trendScore === null
      ? "Sin tendencia"
      : trendScore >= 0.6
        ? "Favorable"
        : trendScore >= 0.45
          ? "Estable"
          : "Vigilancia";

  return {
    patientId: input.patient.id,
    name: input.patient.name ?? "Paciente",
    avatar: input.patient.avatar_url ?? "/avatars/placeholder.svg",
    trackingScale: mapTrackingScale(input.patient.tracking_scale),
    periodLabel: completedCheckins > 0 ? "Últimos 7 días" : "Último período disponible",
    lastUpdatedAt:
      input.checkins[0]?.created_at ?? input.notes[0]?.created_at ?? input.patient.created_at ?? new Date().toISOString(),
    averageLabel,
    trendLabel,
    completedCheckins,
    activeTasks,
    completedTasks,
    progressPercent,
    progressLabel:
      progressPercent >= 75 ? "Progreso sólido" : progressPercent >= 45 ? "Seguimiento en marcha" : "Requiere impulso",
    summary: buildSummary({
      adherenceScore,
      taskScore,
      trendScore,
      latestNote: input.notes[0]?.text,
    }),
    bars: buildProgressBars(input.checkins),
  } satisfies PsychologistPatientReport;
}

export async function getPsychologistPatientReports(psychologistId: string) {
  const admin = createAdminClient();

  const { data: patients, error: patientsError } = await admin
    .from("patients")
    .select("id, name, email, objective, tracking_scale, avatar_url, created_at")
    .eq("psychologist_id", psychologistId)
    .order("created_at", { ascending: false });

  if (patientsError) {
    throw new Error(patientsError.message);
  }

  const patientIds = (patients ?? []).map((item) => item.id);
  if (patientIds.length === 0) {
    return [];
  }

  const [checkinsResult, tasksResult, notesResult] = await Promise.all([
    admin
      .from("daily_checkins")
      .select("id, patient_id, value, note, created_at")
      .in("patient_id", patientIds)
      .order("created_at", { ascending: false }),
    admin
      .from("tasks_assigned")
      .select("id, patient_id, task_library_id, goal, instructions, status, assigned_at, completed_at")
      .in("patient_id", patientIds)
      .order("assigned_at", { ascending: false }),
    admin
      .from("patient_notes")
      .select("id, patient_id, text, author, created_at")
      .in("patient_id", patientIds)
      .order("created_at", { ascending: false }),
  ]);

  if (checkinsResult.error) throw new Error(checkinsResult.error.message);
  if (tasksResult.error) throw new Error(tasksResult.error.message);
  if (notesResult.error) throw new Error(notesResult.error.message);

  const checkinsByPatient = new Map<string, DailyCheckinRow[]>();
  (checkinsResult.data ?? []).forEach((item) => {
    const list = checkinsByPatient.get(item.patient_id) ?? [];
    list.push(item);
    checkinsByPatient.set(item.patient_id, list);
  });

  const tasksByPatient = new Map<string, TaskAssignedRow[]>();
  (tasksResult.data ?? []).forEach((item) => {
    const list = tasksByPatient.get(item.patient_id) ?? [];
    list.push(item);
    tasksByPatient.set(item.patient_id, list);
  });

  const notesByPatient = new Map<string, PatientNoteRow[]>();
  (notesResult.data ?? []).forEach((item) => {
    const list = notesByPatient.get(item.patient_id) ?? [];
    list.push(item);
    notesByPatient.set(item.patient_id, list);
  });

  return (patients ?? []).map((patient) =>
    buildPatientReport({
      patient,
      checkins: checkinsByPatient.get(patient.id) ?? [],
      tasks: tasksByPatient.get(patient.id) ?? [],
      notes: notesByPatient.get(patient.id) ?? [],
    })
  );
}

export async function getPsychologistPatientReport(psychologistId: string, patientId: string) {
  const reports = await getPsychologistPatientReports(psychologistId);
  return reports.find((item) => item.patientId === patientId) ?? null;
}

export async function getPatientPayload(patientId: string) {
  const admin = createAdminClient();

  const [{ data: patient }, { data: tasks }, { data: checkins }, { data: notes }] = await Promise.all([
    admin
      .from("patients")
      .select("id, name, email, objective, tracking_scale, avatar_url, created_at")
      .eq("id", patientId)
      .maybeSingle(),
    admin
      .from("tasks_assigned")
      .select("id, task_library_id, goal, instructions, status, assigned_at, completed_at")
      .eq("patient_id", patientId)
      .order("assigned_at", { ascending: false }),
    admin
      .from("daily_checkins")
      .select("id, value, note, created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
    admin
      .from("patient_notes")
      .select("id, text, author, created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
  ]);

  if (!patient) {
    return null;
  }

  const taskIds = (tasks ?? []).map((task) => task.id);
  const { data: responses } = taskIds.length
    ? await admin
        .from("task_responses")
        .select("id, task_assigned_id, response, created_at")
        .in("task_assigned_id", taskIds)
        .order("created_at", { ascending: false })
    : { data: [] as TaskResponseRow[] };

  const taskLibraryIds = Array.from(new Set((tasks ?? []).map((task) => task.task_library_id).filter(Boolean)));
  const { data: taskLibrary } = taskLibraryIds.length
    ? await admin.from("tasks_library").select("id, title, description").in("id", taskLibraryIds)
    : { data: [] as TaskLibraryRow[] };

  const libraryMap = new Map((taskLibrary ?? []).map((item) => [item.id, item]));

  const latestResponseByTask = new Map<string, { response: unknown; created_at: string }>();
  (responses ?? []).forEach((item) => {
    if (!latestResponseByTask.has(item.task_assigned_id)) {
      latestResponseByTask.set(item.task_assigned_id, {
        response: item.response,
        created_at: item.created_at,
      });
    }
  });

  return {
    id: patient.id,
    name: patient.name ?? "Paciente",
    avatar: patient.avatar_url ?? "/avatars/placeholder.svg",
    status: "Activo",
    trackingScale: mapTrackingScale(patient.tracking_scale),
    lastCheckinAt: checkins?.[0]?.created_at ?? patient.created_at ?? new Date().toISOString(),
    tasks:
      tasks?.map((task) => {
        const lib = task.task_library_id ? libraryMap.get(task.task_library_id) : null;
        const latest = latestResponseByTask.get(task.id);
        return {
          id: task.id,
          templateId: task.task_library_id ?? task.id,
          title: lib?.title ?? task.goal ?? "Tarea",
          description: task.instructions ?? lib?.description ?? "",
          status: mapStatus(task.status),
          createdAt: task.assigned_at,
          updatedAt: task.completed_at ?? latest?.created_at ?? task.assigned_at,
          lastAnswer:
            latest && typeof latest.response === "object" && latest.response !== null && "raw" in latest.response
              ? String((latest.response as { raw?: unknown }).raw ?? "")
              : latest && typeof latest.response === "string"
                ? latest.response
                : latest
                  ? JSON.stringify(latest.response)
                  : "",
        };
      }) ?? [],
    checkins:
      checkins?.map((checkin) => ({
        id: checkin.id,
        mood: checkin.value ?? "",
        text: checkin.note ?? "",
        createdAt: checkin.created_at,
      })) ?? [],
    notes:
      notes?.map((note) => ({
        id: note.id,
        text: note.text,
        author: note.author,
        createdAt: note.created_at,
      })) ?? [],
  };
}
