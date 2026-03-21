import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

function buildRedirectUrl(req: NextRequest) {
  const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const base = configuredSiteUrl || req.nextUrl.origin;
  return `${base}/auth/callback?next=/mi`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "El email es obligatorio." }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured() || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase no está configurado correctamente." }, { status: 500 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("email", email)
    .maybeSingle();

  // Respuesta neutra para no exponer si existe o no el correo.
  if (!profile || profile.role !== "paciente") {
    return NextResponse.json({ ok: true });
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
      emailRedirectTo: buildRedirectUrl(req),
      shouldCreateUser: false,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
