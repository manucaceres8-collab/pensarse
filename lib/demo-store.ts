import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type TrackingScale =
  | "emoji"
  | "numeric_5"
  | "numeric_10"
  | "wellbeing_text"
  | "anxiety_text";

export const TRACKING_SCALE_OPTIONS: Array<{ value: TrackingScale; label: string }> = [
  { value: "emoji", label: "Emojis emocionales" },
  { value: "numeric_5", label: "Escala numérica 1-5" },
  { value: "numeric_10", label: "Escala numérica 1-10" },
  { value: "wellbeing_text", label: "Escala textual bienestar" },
  { value: "anxiety_text", label: "Escala de ansiedad" },
];

const SCALE_VALUES: Record<TrackingScale, string[]> = {
  emoji: ["😣", "😔", "😐", "🙂", "😄"],
  numeric_5: ["1", "2", "3", "4", "5"],
  numeric_10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  wellbeing_text: ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"],
  anxiety_text: ["Nada", "Poca", "Media", "Alta", "Muy alta"],
};

const DEFAULT_SCALE: TrackingScale = "emoji";

export type DemoTaskStatus = "Pendiente" | "En curso" | "Completada";

export type DemoTaskTemplateResponseType =
  | "texto corto"
  | "escala 1-5"
  | "escala 1-10"
  | "selección emoji"
  | "formulario breve";

export type DemoTaskTemplate = {
  id: string;
  title: string;
  description: string;
  duration: string;
  responseType: DemoTaskTemplateResponseType;
  instructions: string;
  kind: "base" | "personalizada";
  createdAt: string;
};

const BASE_LIBRARY: DemoTaskTemplate[] = [
  {
    id: "registro-diario-breve",
    title: "Registro diario breve",
    description: "Síntesis breve de cómo ha ido el día en 1-2 frases.",
    duration: "2 min",
    responseType: "texto corto",
    instructions: "Resume tu día, emoción principal y qué te ayudó.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-abc",
    title: "Registro ABC",
    description: "Situación, pensamiento, emoción y conducta asociada.",
    duration: "5 min",
    responseType: "formulario breve",
    instructions: "Completa situación, pensamiento automático, emoción y respuesta.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "reestructuracion-cognitiva-simple",
    title: "Reestructuración cognitiva simple",
    description: "Busca una alternativa más equilibrada al pensamiento automático.",
    duration: "4 min",
    responseType: "texto corto",
    instructions: "Escribe pensamiento inicial, evidencia y alternativa realista.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "respiracion-2-minutos",
    title: "Respiración 2 minutos",
    description: "Respiración guiada breve para bajar activación fisiológica.",
    duration: "2 min",
    responseType: "selección emoji",
    instructions: "Realiza 2 minutos de respiración y marca cómo te quedas.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "exposicion-gradual",
    title: "Exposición gradual",
    description: "Acercamiento progresivo a situaciones evitadas.",
    duration: "8 min",
    responseType: "formulario breve",
    instructions: "Indica situación, nivel de ansiedad previo y resultado final.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-pensamientos-automaticos",
    title: "Registro de pensamientos automáticos",
    description: "Identifica pensamientos repetitivos del día.",
    duration: "4 min",
    responseType: "texto corto",
    instructions: "Anota 1-3 pensamientos automáticos y su impacto.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "escala-ansiedad-diaria",
    title: "Escala de ansiedad diaria",
    description: "Evalúa ansiedad percibida para seguimiento semanal.",
    duration: "1 min",
    responseType: "escala 1-10",
    instructions: "Marca tu nivel de ansiedad y añade nota opcional.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-activacion-emocional",
    title: "Registro de activación emocional",
    description: "Detecta momentos de activación emocional intensa.",
    duration: "3 min",
    responseType: "formulario breve",
    instructions: "Describe detonante, emoción y estrategia utilizada.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "diario-gratitud-breve",
    title: "Diario de gratitud breve",
    description: "Registra tres elementos positivos del día.",
    duration: "2 min",
    responseType: "texto corto",
    instructions: "Escribe tres cosas pequeñas que agradeces hoy.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-evitacion-afrontamiento",
    title: "Registro de evitación / afrontamiento",
    description: "Diferencia conductas de evitación frente a afrontamiento.",
    duration: "5 min",
    responseType: "escala 1-5",
    instructions: "Marca qué hiciste hoy y si fue evitación o afrontamiento.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
];

export type DemoTask = {
  id: string;
  templateId: string;
  title: string;
  description: string;
  status: DemoTaskStatus;
  createdAt: string;
  updatedAt: string;
  lastAnswer: string;
};

export type DemoCheckin = {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
};

export type DemoNote = {
  id: string;
  text: string;
  author: "paciente" | "psicólogo";
  createdAt: string;
};

export type DemoPatient = {
  id: string;
  name: string;
  email: string;
  objective: string;
  avatar: string;
  status: string;
  trackingScale: TrackingScale;
  lastCheckinAt: string;
  tasks: DemoTask[];
  checkins: DemoCheckin[];
  notes: DemoNote[];
};

type DemoStore = {
  patients: DemoPatient[];
  taskTemplates?: DemoTaskTemplate[];
};

const storePath = path.join(process.cwd(), "data", "demo-store.json");

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isTrackingScale(value: unknown): value is TrackingScale {
  return typeof value === "string" && TRACKING_SCALE_OPTIONS.some((scale) => scale.value === value);
}

function normalizeTrackingScale(value: unknown): TrackingScale {
  return isTrackingScale(value) ? value : DEFAULT_SCALE;
}

export function getScaleValues(scale: TrackingScale) {
  return SCALE_VALUES[scale];
}

export function isTaskResponseType(value: unknown): value is DemoTaskTemplateResponseType {
  return ["texto corto", "escala 1-5", "escala 1-10", "selección emoji", "formulario breve"].includes(
    String(value)
  );
}

function normalizeResponseType(value: unknown, fallback: DemoTaskTemplateResponseType): DemoTaskTemplateResponseType {
  const raw = String(value ?? "");
  if (raw === "escala") return "escala 1-5";
  if (raw === "selección") return "selección emoji";
  if (isTaskResponseType(raw)) return raw;
  return fallback;
}

function moodToStatus(scale: TrackingScale, mood: string) {
  const values = getScaleValues(scale);
  const index = values.indexOf(mood);

  if (index < 0) {
    return "Variable";
  }

  if (scale === "anxiety_text") {
    if (index <= 1) return "Estable";
    if (index === 2) return "Variable";
    return "Bajo ánimo";
  }

  const ratio = values.length > 1 ? index / (values.length - 1) : 0;
  if (ratio <= 0.33) return "Bajo ánimo";
  if (ratio <= 0.66) return "Variable";
  return "Estable";
}

async function readStore(): Promise<DemoStore> {
  const raw = await fs.readFile(storePath, "utf-8");
  return JSON.parse(raw) as DemoStore;
}

async function writeStore(store: DemoStore) {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
}

function normalizeTemplates(existing: DemoTaskTemplate[] | undefined) {
  const custom = (existing ?? []).filter((item) => item.kind === "personalizada");
  const customById = new Map(custom.map((item) => [item.id, item]));

  const merged = BASE_LIBRARY.map((base) => {
    const fromStore = (existing ?? []).find((item) => item.id === base.id);
    return fromStore
      ? {
          ...base,
          ...fromStore,
          kind: "base" as const,
          responseType: normalizeResponseType(fromStore.responseType, base.responseType),
        }
      : base;
  });

  return [...merged, ...Array.from(customById.values())];
}

function ensureStoreConsistency(store: DemoStore) {
  let changed = false;

  for (const patient of store.patients) {
    if (!patient.trackingScale) {
      patient.trackingScale = DEFAULT_SCALE;
      changed = true;
    }

    for (const task of patient.tasks) {
      if (!(task as DemoTask).templateId) {
        (task as DemoTask).templateId = task.id;
        changed = true;
      }
    }
  }

  const normalizedTemplates = normalizeTemplates(store.taskTemplates);
  if (!store.taskTemplates || JSON.stringify(store.taskTemplates) !== JSON.stringify(normalizedTemplates)) {
    store.taskTemplates = normalizedTemplates;
    changed = true;
  }

  return { store, changed };
}

async function loadStore() {
  const parsed = await readStore();
  const { store, changed } = ensureStoreConsistency(parsed);
  if (changed) {
    await writeStore(store);
  }
  return store;
}

export async function getTaskTemplates() {
  const store = await loadStore();
  return store.taskTemplates ?? [];
}

export async function addTaskTemplate(input: {
  title: string;
  description: string;
  duration: string;
  responseType: DemoTaskTemplateResponseType;
  instructions: string;
}) {
  const store = await loadStore();
  const baseId = slugify(input.title) || "tarea-personalizada";
  const current = store.taskTemplates ?? [];
  const ids = new Set(current.map((item) => item.id));

  let finalId = baseId;
  let i = 1;
  while (ids.has(finalId)) {
    i += 1;
    finalId = `${baseId}-${i}`;
  }

  const template: DemoTaskTemplate = {
    id: finalId,
    title: input.title,
    description: input.description,
    duration: input.duration,
    responseType: input.responseType,
    instructions: input.instructions,
    kind: "personalizada",
    createdAt: nowIso(),
  };

  store.taskTemplates = [template, ...current];
  await writeStore(store);

  return template;
}

export async function getPatients() {
  const store = await loadStore();
  return store.patients;
}

export async function getPatientById(id: string) {
  const patients = await getPatients();
  return patients.find((p) => p.id === id) ?? null;
}

export async function addPatient(input: {
  name: string;
  email: string;
  objective: string;
  trackingScale?: TrackingScale;
}) {
  const store = await loadStore();
  const baseId = slugify(input.name) || "paciente";
  const ids = new Set(store.patients.map((p) => p.id));
  let finalId = baseId;
  let i = 1;

  while (ids.has(finalId)) {
    i += 1;
    finalId = `${baseId}-${i}`;
  }

  const patient: DemoPatient = {
    id: finalId,
    name: input.name,
    email: input.email,
    objective: input.objective,
    avatar: "/profiles/paciente-1.jpg",
    status: "Nuevo",
    trackingScale: normalizeTrackingScale(input.trackingScale),
    lastCheckinAt: nowIso(),
    tasks: [],
    checkins: [],
    notes: [],
  };

  store.patients.unshift(patient);
  await writeStore(store);

  return patient;
}

export async function updatePatientTrackingScale(patientId: string, trackingScale: TrackingScale) {
  const store = await loadStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  patient.trackingScale = trackingScale;
  await writeStore(store);
  return patient;
}

export async function addPatientCheckin(
  patientId: string,
  input: { mood: string; text: string }
) {
  const store = await loadStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  const scale = normalizeTrackingScale(patient.trackingScale);
  const allowedValues = getScaleValues(scale);
  if (!allowedValues.includes(input.mood)) {
    return null;
  }

  const checkin: DemoCheckin = {
    id: makeId("checkin"),
    mood: input.mood,
    text: input.text,
    createdAt: nowIso(),
  };

  patient.checkins.unshift(checkin);
  patient.lastCheckinAt = checkin.createdAt;
  patient.status = moodToStatus(scale, input.mood);

  await writeStore(store);
  return checkin;
}

export async function addPatientNote(
  patientId: string,
  input: { text: string; author: "paciente" | "psicólogo" }
) {
  const store = await loadStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  const note: DemoNote = {
    id: makeId("note"),
    text: input.text,
    author: input.author,
    createdAt: nowIso(),
  };

  patient.notes.unshift(note);
  await writeStore(store);

  return note;
}

export async function assignTaskToPatient(
  patientId: string,
  input: { id?: string; title: string; description: string }
) {
  const store = await loadStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  const templateId = input.id ?? slugify(input.title);
  const taskId = makeId(templateId || "task");
  const now = nowIso();

  const task: DemoTask = {
    id: taskId,
    templateId,
    title: input.title,
    description: input.description,
    status: "Pendiente",
    createdAt: now,
    updatedAt: now,
    lastAnswer: "",
  };

  patient.tasks.unshift(task);
  await writeStore(store);

  return { duplicate: false as const, task };
}

export async function updateTask(
  patientId: string,
  taskId: string,
  input: { status?: DemoTaskStatus; lastAnswer?: string }
) {
  const store = await loadStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  const task = patient.tasks.find((t) => t.id === taskId);
  if (!task) {
    return null;
  }

  task.status = input.status ?? task.status;
  task.lastAnswer = input.lastAnswer ?? task.lastAnswer;
  task.updatedAt = nowIso();

  await writeStore(store);
  return task;
}
