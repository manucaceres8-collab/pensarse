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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#ffffff_100%)] px-6 py-10 text-[#0f172a]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute left-[8%] top-[-48px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(103,197,236,0.34)_0%,rgba(103,197,236,0)_72%)] blur-[70px]" />
        <div className="absolute right-[8%] top-[40px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(18,114,183,0.18)_0%,rgba(18,114,183,0)_75%)] blur-[80px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="hidden lg:block">
            <div className="max-w-lg">
              <p className="inline-flex rounded-full bg-[#e9f4fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1272b7]">
                Acceso seguro
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#0f172a]">
                Entra en Pensar<span className="text-[#1272b7]">(SE)</span> con el mismo lenguaje visual del producto.
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                Un entorno clínico claro, moderno y sin fricción para psicólogos y pacientes.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Seguimiento terapéutico en una sola vista",
                  "Diseño consistente con la home y los paneles",
                  "Acceso rápido para psicólogo o paciente",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[#d8e4ef] bg-white/90 px-4 py-3 shadow-[0_14px_28px_rgba(15,23,42,0.05)]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1272b7]" />
                    <span className="text-sm text-[#334155]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="w-full max-w-md justify-self-center lg:max-w-none">
            <div className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#0f172a] lg:text-left">
              Pensar<span className="text-[#1272b7]">(SE)</span>
            </div>

            <section className="rounded-[30px] border border-[#d8e4ef] bg-white/92 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
              <div className="flex items-start justify-between gap-4 border-b border-[#e7edf5] pb-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">Iniciar sesión</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">
                    Accede a tu espacio de trabajo y continúa el seguimiento clínico.
                  </p>
                </div>
                <span className="rounded-full border border-[#d8e4ef] bg-[#f5fbff] px-3 py-1 text-[11px] font-medium text-[#1272b7]">
                  Real
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#546a87]">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#d8e4ef] bg-[#f8fbff] px-4 py-3.5 text-sm text-[#0f172a] outline-none transition focus:border-[#97c3df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(18,114,183,0.10)]"
                    placeholder="tu-email@dominio.com"
                    type="email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#546a87]">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#d8e4ef] bg-[#f8fbff] px-4 py-3.5 text-sm text-[#0f172a] outline-none transition focus:border-[#97c3df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(18,114,183,0.10)]"
                    placeholder="********"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <button
                onClick={entrar}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#1272b7] px-5 py-3.5 text-sm font-medium text-white shadow-[0_18px_28px_rgba(18,114,183,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0f68a8] hover:shadow-[0_22px_34px_rgba(18,114,183,0.30)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="mt-5 space-y-2 text-center lg:text-left">
                <Link
                  href="/register/psicologo"
                  className="block text-sm font-medium text-[#1f304b] underline-offset-4 transition hover:text-[#1272b7] hover:underline"
                >
                  Crear cuenta de psicólogo
                </Link>

                <Link
                  href="/acceso-paciente"
                  className="block text-sm font-medium text-[#1f304b] underline-offset-4 transition hover:text-[#1272b7] hover:underline"
                >
                  Acceso paciente
                </Link>

                <Link
                  href="/"
                  className="block text-sm font-medium text-[#1f304b] underline-offset-4 transition hover:text-[#1272b7] hover:underline"
                >
                  Volver al inicio
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
