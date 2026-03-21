import { NextRequest, NextResponse } from "next/server";
import { addPatient, getPatients, isTrackingScale } from "@/lib/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { getCurrentUserAndRole } from "@/lib/pilot-db";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

function getMagicLinkRedirect(req: NextRequest) {
  const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const base = configuredSiteUrl || req.nextUrl.origin;
  return `${base}/auth/callback?next=/mi`;
}

async function sendPatientMagicLink(email: string, redirectTo: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false as const, error: "Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

  const authClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await authClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}

function isAlreadyRegisteredError(message: string | undefined) {
  const raw = (message ?? "").toLowerCase();
  return raw.includes("already registered") || raw.includes("already been registered");
}

async function findAuthUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
) {
  let page = 1;
  const perPage = 1000;

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      return { id: null as string | null, error: error.message };
    }

    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      return { id: found.id, error: null as string | null };
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return { id: null as string | null, error: null as string | null };
}

async function ensurePatientAuthUser(
  admin: ReturnType<typeof createAdminClient>,
  input: { email: string; name: string }
) {
  const randomPassword = `${crypto.randomBytes(16).toString("hex")}Aa1!`;
  const { data: createdAuth, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: {
      name: input.name,
    },
  });

  if (!authError && createdAuth.user) {
    return { ok: true as const, userId: createdAuth.user.id, source: "created" as const };
  }

  if (!isAlreadyRegisteredError(authError?.message)) {
    return {
      ok: false as const,
      step: "auth_create" as const,
      error: authError?.message ?? "No se pudo crear usuario en Auth.",
    };
  }

  const lookup = await findAuthUserIdByEmail(admin, input.email);
  if (lookup.error) {
    return {
      ok: false as const,
      step: "auth_lookup" as const,
      error: lookup.error,
    };
  }

  if (!lookup.id) {
    return {
      ok: false as const,
      step: "auth_lookup" as const,
      error: "El usuario ya existe en Auth, pero no se pudo recuperar su id.",
    };
  }

  return { ok: true as const, userId: lookup.id, source: "existing" as const };
}

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    const patients = await getPatients();
    return NextResponse.json({ patients });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (role !== "psicologo") {
    return NextResponse.json({ patients: [] });
  }

  const admin = createAdminClient();
  const { data: dbPatients, error } = await admin
    .from("patients")
    .select("id, name, avatar_url, created_at")
    .eq("psychologist_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const patientIds = (dbPatients ?? []).map((item) => item.id);

  const [{ data: tasks }, { data: checkins }] = await Promise.all([
    patientIds.length
      ? admin.from("tasks_assigned").select("id, patient_id").in("patient_id", patientIds)
      : Promise.resolve({ data: [] as Array<{ id: string; patient_id: string }> }),
    patientIds.length
      ? admin
          .from("daily_checkins")
          .select("patient_id, note, created_at")
          .in("patient_id", patientIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as Array<{ patient_id: string; note: string | null; created_at: string }> }),
  ]);

  const tasksByPatient = new Map<string, { id: string }[]>();
  (tasks ?? []).forEach((task) => {
    const list = tasksByPatient.get(task.patient_id) ?? [];
    list.push({ id: task.id });
    tasksByPatient.set(task.patient_id, list);
  });

  const latestCheckinByPatient = new Map<string, { note: string; created_at: string }>();
  (checkins ?? []).forEach((checkin) => {
    if (!latestCheckinByPatient.has(checkin.patient_id)) {
      latestCheckinByPatient.set(checkin.patient_id, {
        note: checkin.note ?? "",
        created_at: checkin.created_at,
      });
    }
  });

  const patients = (dbPatients ?? []).map((item) => {
    const latestCheckin = latestCheckinByPatient.get(item.id);

    return {
      id: item.id,
      name: item.name,
      avatar: item.avatar_url ?? "/avatars/placeholder.svg",
      status: "Activo",
      lastCheckinAt: latestCheckin?.created_at ?? item.created_at,
      tasks: tasksByPatient.get(item.id) ?? [],
      checkins: [{ text: latestCheckin?.note ?? "" }],
    };
  });

  return NextResponse.json({ patients });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    objective?: string;
    trackingScale?: string;
    avatar?: string;
  };

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const trackingScale = body.trackingScale && isTrackingScale(body.trackingScale) ? body.trackingScale : undefined;

  if (body.trackingScale && !trackingScale) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) {
    const patient = await addPatient({
      name,
      email: body.email?.trim() || "",
      objective: body.objective?.trim() || "",
      trackingScale,
      avatar: body.avatar?.trim() || "",
    });

    return NextResponse.json({ patient }, { status: 201 });
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "El email del paciente es obligatorio." }, { status: 400 });
  }

  const admin = createAdminClient();

  const normalizedEmail = email.toLowerCase();
  const authUserResult = await ensurePatientAuthUser(admin, {
    email: normalizedEmail,
    name,
  });

  if (!authUserResult.ok) {
    console.error("[patients:create] fallo en Auth", {
      step: authUserResult.step,
      email: normalizedEmail,
      error: authUserResult.error,
    });
    return NextResponse.json(
      {
        error: `No se pudo preparar el usuario paciente en Auth (${authUserResult.step}). ${authUserResult.error}`,
        step: authUserResult.step,
      },
      { status: 400 }
    );
  }

  const patientUserId = authUserResult.userId;

  const { data: existingProfileById, error: profileReadError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", patientUserId)
    .maybeSingle();

  if (profileReadError) {
    console.error("[patients:create] fallo leyendo profile", {
      step: "profiles_read",
      userId: patientUserId,
      error: profileReadError.message,
    });
    return NextResponse.json(
      {
        error: `No se pudo verificar el perfil del paciente (profiles_read). ${profileReadError.message}`,
        step: "profiles_read",
      },
      { status: 400 }
    );
  }

  if (existingProfileById?.role && existingProfileById.role !== "paciente") {
    return NextResponse.json(
      {
        error: "Este email ya está registrado con otro rol.",
        step: "profiles_role_conflict",
      },
      { status: 400 }
    );
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: patientUserId,
    email: normalizedEmail,
    role: "paciente",
    name,
    clinic_name: null,
  });

  if (profileError) {
    console.error("[patients:create] fallo creando/updating profile", {
      step: "profiles_upsert",
      userId: patientUserId,
      error: profileError.message,
    });
    return NextResponse.json(
      { error: `No se pudo crear/actualizar profile (profiles_upsert). ${profileError.message}`, step: "profiles_upsert" },
      { status: 400 }
    );
  }

  const { data: existingPatient } = await admin
    .from("patients")
    .select("id, psychologist_id")
    .eq("id", patientUserId)
    .maybeSingle();

  if (existingPatient && existingPatient.psychologist_id !== user.id) {
    return NextResponse.json(
      { error: "Este paciente ya está vinculado a otro psicólogo en el piloto.", step: "patients_conflict" },
      { status: 400 }
    );
  }

  const { error: patientError } = await admin.from("patients").upsert({
    id: patientUserId,
    psychologist_id: user.id,
    name,
    email: normalizedEmail,
    objective: body.objective?.trim() || "",
    tracking_scale: trackingScale ?? "emoji",
    avatar_url: body.avatar?.trim() || "/avatars/placeholder.svg",
  });

  if (patientError) {
    console.error("[patients:create] fallo creando/updating patient", {
      step: "patients_upsert",
      userId: patientUserId,
      psychologistId: user.id,
      error: patientError.message,
    });
    return NextResponse.json(
      { error: `No se pudo crear/actualizar patient (patients_upsert). ${patientError.message}`, step: "patients_upsert" },
      { status: 400 }
    );
  }

  const redirectTo = getMagicLinkRedirect(req);
  const magicLinkResult = await sendPatientMagicLink(normalizedEmail, redirectTo);
  if (!magicLinkResult.ok) {
    console.error("[patients:create] fallo enviando magic link", {
      step: "magic_link",
      email: normalizedEmail,
      error: magicLinkResult.error,
    });
    return NextResponse.json(
      {
        error: `Paciente creado, pero no se pudo enviar el magic link (magic_link). ${magicLinkResult.error}`,
        step: "magic_link",
      },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const patient = {
    id: patientUserId,
    name,
    email: normalizedEmail,
    objective: body.objective?.trim() || "",
    avatar: body.avatar?.trim() || "/avatars/placeholder.svg",
    status: "Activo",
    trackingScale: trackingScale ?? "emoji",
    lastCheckinAt: now,
    tasks: [],
    checkins: [],
    notes: [],
  };

  return NextResponse.json(
    {
      patient,
      magicLinkSent: true,
      authSource: authUserResult.source,
    },
    { status: 201 }
  );
}
