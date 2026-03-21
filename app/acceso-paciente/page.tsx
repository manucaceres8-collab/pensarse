"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccesoPacientePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted || !user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted || !profile?.role) return;

        if (profile.role === "paciente") {
          router.replace("/mi");
          return;
        }

        if (profile.role === "psicologo") {
          router.replace("/panel");
          return;
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function solicitarMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError("Introduce tu email para recibir el enlace.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/patient-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar el magic link.");
        return;
      }

      setNotice("Si tu correo está autorizado como paciente, te hemos enviado un magic link.");
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
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">Acceso paciente</h1>
          <p className="mt-2 text-sm text-[#546a87]">
            Si ya tienes sesión activa, entrarás directo a tu espacio. Si no, solicita un nuevo magic link.
          </p>

          {checkingSession ? (
            <p className="mt-6 rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#607794]">
              Comprobando sesión...
            </p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={solicitarMagicLink}>
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

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              {notice && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0f1f3f] px-5 py-3 text-sm font-medium text-white shadow hover:bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? "Enviando..." : "Enviar magic link"}
              </button>
            </form>
          )}

          <Link
            href="/"
            className="mt-4 block text-center text-sm font-medium text-[#1f304b] underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </section>
      </div>
    </main>
  );
}
