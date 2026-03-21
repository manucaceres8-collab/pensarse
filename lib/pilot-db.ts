import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export type AppRole = "psicologo" | "paciente";

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
  if (value === "numeric_5" || value === "numeric_10" || value === "wellbeing_text" || value === "anxiety_text") {
    return value;
  }
  return "emoji";
}

export async function getPatientPayload(patientId: string) {
  const admin = createAdminClient();

  const [{ data: patient }, { data: tasks }, { data: checkins }, { data: notes }] =
    await Promise.all([
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
    : { data: [] as Array<{ id: string; task_assigned_id: string; response: unknown; created_at: string }> };

  const taskLibraryIds = Array.from(new Set((tasks ?? []).map((task) => task.task_library_id).filter(Boolean)));
  const { data: taskLibrary } = taskLibraryIds.length
    ? await admin
        .from("tasks_library")
        .select("id, title, description")
        .in("id", taskLibraryIds)
    : { data: [] as Array<{ id: string; title: string; description: string | null }> };

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
