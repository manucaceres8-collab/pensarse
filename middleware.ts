import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./lib/supabase/config";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const needsPsychologist = pathname.startsWith("/panel");
  const needsPatient = pathname.startsWith("/mi");
  const patientAccessPath = pathname === "/acceso-paciente";

  if ((needsPsychologist || needsPatient) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = needsPatient ? "/acceso-paciente" : "/login";
    return NextResponse.redirect(url);
  }

  if (!user) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role as "psicologo" | "paciente" | undefined;

  if (needsPsychologist && role !== "psicologo") {
    const url = request.nextUrl.clone();
    url.pathname = role === "paciente" ? "/mi" : "/login";
    return NextResponse.redirect(url);
  }

  if (needsPatient && role !== "paciente") {
    const url = request.nextUrl.clone();
    url.pathname = role === "psicologo" ? "/panel" : "/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && role) {
    const url = request.nextUrl.clone();
    url.pathname = role === "psicologo" ? "/panel" : "/mi";
    return NextResponse.redirect(url);
  }

  if (patientAccessPath && role) {
    const url = request.nextUrl.clone();
    url.pathname = role === "paciente" ? "/mi" : "/panel";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/panel/:path*", "/mi/:path*", "/login", "/acceso-paciente"],
};
