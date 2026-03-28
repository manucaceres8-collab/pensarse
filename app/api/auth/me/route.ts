import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, clinic_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: profile.id,
      name: profile.name ?? user.email ?? "Psicólogo",
      email: profile.email ?? user.email ?? "",
      role: profile.role,
      clinicName: profile.clinic_name,
      avatarUrl: profile.avatar_url,
    },
  });
}
