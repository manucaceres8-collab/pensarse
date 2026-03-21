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
  | "escala"
  | "selección"
  | "emojis"
  | "formulario breve";

export type DemoTaskTherapyType = "tcc" | "act" | "dbt" | "soluciones" | "personalizadas";

export type DemoTaskTemplate = {
  id: string;
  title: string;
  description: string;
  duration: string;
  responseType: DemoTaskTemplateResponseType;
  therapyType: DemoTaskTherapyType;
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
    therapyType: "tcc",
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
    therapyType: "tcc",
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
    therapyType: "tcc",
    instructions: "Escribe pensamiento inicial, evidencia y alternativa realista.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-pensamientos-automaticos",
    title: "Registro de pensamientos automáticos",
    description: "Identifica pensamientos repetitivos del día y su intensidad.",
    duration: "4 min",
    responseType: "formulario breve",
    therapyType: "tcc",
    instructions: "Anota 1-3 pensamientos automáticos y el impacto emocional asociado.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "activacion-conductual",
    title: "Activación conductual",
    description: "Planifica una acción valiosa y evalúa su impacto en el ánimo.",
    duration: "5 min",
    responseType: "selección",
    therapyType: "tcc",
    instructions: "Elige una acción pequeña, ejecútala y marca el resultado percibido.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-evitacion",
    title: "Registro de evitación",
    description: "Detecta conductas evitativas y qué intentaban proteger.",
    duration: "4 min",
    responseType: "texto corto",
    therapyType: "act",
    instructions: "Describe una evitación del día y el costo que tuvo para ti.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "valores-personales",
    title: "Valores personales",
    description: "Conecta lo que hiciste hoy con tus valores importantes.",
    duration: "6 min",
    responseType: "formulario breve",
    therapyType: "act",
    instructions: "Elige un valor y concreta una acción que lo acerque hoy.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "defusion-cognitiva-breve",
    title: "Defusión cognitiva breve",
    description: "Toma distancia de un pensamiento difícil sin fusionarte con él.",
    duration: "3 min",
    responseType: "emojis",
    therapyType: "act",
    instructions: "Repite el pensamiento con una frase de distancia y marca cómo quedas.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "registro-emocion-intensa",
    title: "Registro de emoción intensa",
    description: "Registra detonante, emoción, nivel y estrategia usada.",
    duration: "5 min",
    responseType: "formulario breve",
    therapyType: "dbt",
    instructions: "Describe el episodio y qué habilidad aplicaste para regularte.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "tecnica-stop",
    title: "Técnica STOP",
    description: "Entrena pausa, respiración y respuesta efectiva en momentos críticos.",
    duration: "3 min",
    responseType: "selección",
    therapyType: "dbt",
    instructions: "Marca qué pasos STOP aplicaste y cómo resultó la situación.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "regulacion-emocional-breve",
    title: "Regulación emocional breve",
    description: "Evalúa intensidad emocional antes y después de regular.",
    duration: "4 min",
    responseType: "escala",
    therapyType: "dbt",
    instructions: "Puntúa tu emoción de 1-10 antes y después de la técnica.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "escala-progreso-1-10",
    title: "Escala de progreso 1-10",
    description: "Ubica tu avance semanal y qué explica ese punto.",
    duration: "2 min",
    responseType: "escala",
    therapyType: "soluciones",
    instructions: "Valora tu progreso de 1 a 10 y añade una razón concreta.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "pequeno-paso-semana",
    title: "Pequeño paso de la semana",
    description: "Define la próxima acción mínima útil para avanzar.",
    duration: "3 min",
    responseType: "texto corto",
    therapyType: "soluciones",
    instructions: "Escribe un paso pequeño, observable y factible para esta semana.",
    kind: "base",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "que-ha-funcionado-hoy",
    title: "Qué ha funcionado hoy",
    description: "Identifica excepciones: lo que sí ayudó en el día.",
    duration: "3 min",
    responseType: "emojis",
    therapyType: "soluciones",
    instructions: "Anota qué funcionó hoy y valora su efecto general.",
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
  return ["texto corto", "escala", "selección", "emojis", "formulario breve"].includes(String(value));
}

function isTherapyType(value: unknown): value is DemoTaskTherapyType {
  return ["tcc", "act", "dbt", "soluciones", "personalizadas"].includes(String(value));
}

function normalizeTherapyType(value: unknown, fallback: DemoTaskTherapyType): DemoTaskTherapyType {
  if (isTherapyType(value)) return value;
  return fallback;
}

function normalizeResponseType(value: unknown, fallback: DemoTaskTemplateResponseType): DemoTaskTemplateResponseType {
  const raw = String(value ?? "");
  if (raw === "escala 1-5" || raw === "escala 1-10") return "escala";
  if (raw === "selección emoji") return "emojis";
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
  const custom = (existing ?? [])
    .filter((item) => item.kind === "personalizada")
    .map((item) => ({
      ...item,
      therapyType: "personalizadas" as const,
      responseType: normalizeResponseType(item.responseType, "formulario breve"),
    }));
  const customById = new Map(custom.map((item) => [item.id, item]));

  const merged = BASE_LIBRARY.map((base) => {
    const fromStore = (existing ?? []).find((item) => item.id === base.id);
    return fromStore
      ? {
          ...base,
          ...fromStore,
          kind: "base" as const,
          responseType: normalizeResponseType(fromStore.responseType, base.responseType),
          therapyType: normalizeTherapyType(fromStore.therapyType, base.therapyType),
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
    therapyType: "personalizadas",
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

export async function deletePatientById(patientId: string) {
  const store = await loadStore();
  const index = store.patients.findIndex((p) => p.id === patientId);
  if (index < 0) {
    return false;
  }

  store.patients.splice(index, 1);
  await writeStore(store);
  return true;
}

export async function addPatient(input: {
  name: string;
  email: string;
  objective: string;
  trackingScale?: TrackingScale;
  avatar?: string;
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
    avatar: input.avatar?.trim() || "/avatars/placeholder.svg",
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
