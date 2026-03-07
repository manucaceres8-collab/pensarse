import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type DemoTaskStatus = "Pendiente" | "Completada";

export type DemoTask = {
  id: string;
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
  author: "paciente" | "psicologo";
  createdAt: string;
};

export type DemoPatient = {
  id: string;
  name: string;
  email: string;
  objective: string;
  avatar: string;
  status: string;
  lastCheckinAt: string;
  tasks: DemoTask[];
  checkins: DemoCheckin[];
  notes: DemoNote[];
};

type DemoStore = {
  patients: DemoPatient[];
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

async function readStore(): Promise<DemoStore> {
  const raw = await fs.readFile(storePath, "utf-8");
  return JSON.parse(raw) as DemoStore;
}

async function writeStore(store: DemoStore) {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
}

export async function getPatients() {
  const store = await readStore();
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
}) {
  const store = await readStore();
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
    lastCheckinAt: nowIso(),
    tasks: [],
    checkins: [],
    notes: [],
  };

  store.patients.unshift(patient);
  await writeStore(store);

  return patient;
}

export async function addPatientCheckin(
  patientId: string,
  input: { mood: string; text: string }
) {
  const store = await readStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
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

  if (input.mood === "Muy bajo" || input.mood === "Bajo") {
    patient.status = "Bajo animo";
  } else if (input.mood === "Neutro") {
    patient.status = "Variable";
  } else {
    patient.status = "Estable";
  }

  await writeStore(store);
  return checkin;
}

export async function addPatientNote(
  patientId: string,
  input: { text: string; author: "paciente" | "psicologo" }
) {
  const store = await readStore();
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
  const store = await readStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) {
    return null;
  }

  const taskId = input.id ?? slugify(input.title);
  const exists = patient.tasks.some((t) => t.id === taskId);
  if (exists) {
    return { duplicate: true as const, task: patient.tasks.find((t) => t.id === taskId)! };
  }

  const task: DemoTask = {
    id: taskId,
    title: input.title,
    description: input.description,
    status: "Pendiente",
    createdAt: nowIso(),
    updatedAt: nowIso(),
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
  const store = await readStore();
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
