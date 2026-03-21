"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function entrar() {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      let supabase;
      try {
        supabase = createClient();
      } catch {
        setError("No se pudo inicializar la autenticación.");
        return;
      }
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError(signInError?.message ?? "No se pudo iniciar sesión.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile?.role) {
        setError(profileError?.message ?? "No se encontró el rol del usuario.");
        return;
      }

      router.push(profile.role === "psicologo" ? "/panel" : "/mi");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf1f7] px-6 py-10 text-[#0f172a]">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#0f172a]">
          Pensar<span className="text-[#4f7fbf]">(SE)</span>
        </div>

        <section className="rounded-[26px] border border-[#d7deea] bg-white p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">Iniciar sesión</h1>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-[#546a87]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
                placeholder="tu-email@dominio.com"
                type="email"
              />
            </div>

            <div>
              <label className="text-sm text-[#546a87]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
                placeholder="********"
              />
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            onClick={entrar}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#0f1f3f] px-5 py-3 text-sm font-medium text-white shadow hover:bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <Link
            href="/register/psicologo"
            className="mt-4 block text-center text-sm font-medium text-[#1f304b] underline-offset-4 hover:underline"
          >
            Crear cuenta de psicólogo
          </Link>

          <Link
            href="/acceso-paciente"
            className="mt-2 block text-center text-sm font-medium text-[#1f304b] underline-offset-4 hover:underline"
          >
            Acceso paciente
          </Link>

          <Link
            href="/"
            className="mt-2 block text-center text-sm font-medium text-[#1f304b] underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </section>
      </div>
    </main>
  );
}
