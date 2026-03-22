import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { getCurrentUserAndRole } from "@/lib/pilot-db";

type TrackingScale = "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";

function isTrackingScale(value: unknown): value is TrackingScale {
  return ["emoji", "numeric_5", "numeric_10", "wellbeing_text", "anxiety_text"].includes(String(value));
}

function toDbTrackingScale(value: TrackingScale) {
  if (value === "numeric_5") return "oneToFive";
  if (value === "numeric_10") return "oneToTen";
  if (value === "wellbeing_text") return "bienestar";
  if (value === "anxiety_text") return "ansiedad";
  return "emoji";
}

function getMagicLinkRedirect(req: NextRequest) {
  const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const base = configuredSiteUrl || req.nextUrl.origin;
  return `${base}/auth/callback?next=/mi`;
}

async function sendPatientMagicLink(email: string, redirectTo: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false as const,
      error: "Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
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

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    objective?: string;
    trackingScale?: string;
    avatar?: string;
  };

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado para el flujo real de pacientes." },
      { status: 500 }
    );
  }

  const { user, role } = await getCurrentUserAndRole();
  if (!user || role !== "psicologo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "El email del paciente es obligatorio." }, { status: 400 });
  }

  const trackingScale = body.trackingScale && isTrackingScale(body.trackingScale) ? body.trackingScale : "emoji";
  if (body.trackingScale && !isTrackingScale(body.trackingScale)) {
    return NextResponse.json({ error: "Escala de seguimiento no válida" }, { status: 400 });
  }

  const admin = createAdminClient();

  const authUserResult = await ensurePatientAuthUser(admin, {
    email,
    name,
  });

  if (!authUserResult.ok) {
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
    email,
    role: "paciente",
    name,
    clinic_name: null,
  });

  if (profileError) {
    return NextResponse.json(
      {
        error: `No se pudo crear o actualizar el profile del paciente. ${profileError.message}`,
        step: "profiles_upsert",
      },
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
      {
        error: "Este paciente ya está vinculado a otro psicólogo.",
        step: "patients_conflict",
      },
      { status: 400 }
    );
  }

  const { error: patientError } = await admin.from("patients").upsert({
    id: patientUserId,
    psychologist_id: user.id,
    name,
    email,
    objective: body.objective?.trim() || "",
    tracking_scale: toDbTrackingScale(trackingScale),
    avatar_url: body.avatar?.trim() || "/avatars/placeholder.svg",
  });

  if (patientError) {
    return NextResponse.json(
      {
        error: `No se pudo crear o actualizar el paciente en Supabase. ${patientError.message}`,
        step: "patients_upsert",
      },
      { status: 400 }
    );
  }

  const redirectTo = getMagicLinkRedirect(req);
  const magicLinkResult = await sendPatientMagicLink(email, redirectTo);
  if (!magicLinkResult.ok) {
    return NextResponse.json(
      {
        error: `Paciente creado, pero no se pudo enviar el magic link. ${magicLinkResult.error}`,
        step: "magic_link",
      },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  return NextResponse.json(
    {
      patient: {
        id: patientUserId,
        name,
        email,
        objective: body.objective?.trim() || "",
        avatar: body.avatar?.trim() || "/avatars/placeholder.svg",
        status: "Activo",
        trackingScale,
        lastCheckinAt: now,
        tasks: [],
        checkins: [],
        notes: [],
      },
      magicLinkSent: true,
      authSource: authUserResult.source,
    },
    { status: 201 }
  );
}
