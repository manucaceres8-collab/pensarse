"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Rol = "psicólogo" | "paciente";

export default function LoginPage() {
  const router = useRouter();

  const [rol, setRol] = useState<Rol>(() => {
    if (typeof window === "undefined") return "psicólogo";
    const fromQuery = new URLSearchParams(window.location.search).get("rol");
    if (fromQuery === "psicologo") return "psicólogo";
    if (fromQuery === "paciente") return "paciente";
    return "psicólogo";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function entrar() {
    if (rol === "psicólogo") {
      router.push("/panel");
    } else {
      router.push("/mi");
    }
  }

  return (
    <main className="min-h-screen bg-[#edf1f7] px-6 py-10 text-[#0f172a]">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[26px] border border-[#d7deea] bg-white p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#d5deea] bg-[#f8fbff] p-1">
                <Image
                  src="/logo-pensarse-sinergia.svg"
                  alt="Logo Pensar(SE)"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <div className="text-3xl font-semibold tracking-tight">
                  Pensar<span className="text-[#4f7fbf]">(SE)</span>
                </div>
                <p className="text-sm text-[#546a87]">Seguimiento terapéutico entre sesiones</p>
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight md:text-5xl">Acceso demo</h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#546a87] md:text-lg">
              Simula la entrada como psicólogo o paciente para ver el flujo completo de la herramienta.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#607794]">Psicólogo</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">Dashboard, pacientes e informes</div>
              </div>

              <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#607794]">Paciente</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">Registro diario, tareas y evolución</div>
              </div>

              <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#607794]">Demo</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">No guarda usuarios reales</div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="rounded-2xl border border-[#d1dcea] bg-white px-4 py-3 text-sm font-medium text-[#1f304b] shadow-sm hover:bg-[#eff4ff]"
              >
                Volver al inicio
              </Link>
            </div>
          </section>

          <section className="rounded-[26px] border border-[#d7deea] bg-white p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
            <div className="text-sm font-semibold text-[#0f172a]">Iniciar sesión</div>
            <p className="mt-1 text-sm text-[#546a87]">Acceso demo para {rol}.</p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#edf4ff] p-1">
              <button
                onClick={() => setRol("psicólogo")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  rol === "psicólogo"
                    ? "bg-white text-[#0f1f3f] shadow-sm"
                    : "text-[#4f617b] hover:text-[#1f304b]",
                ].join(" ")}
              >
                Psicólogo
              </button>

              <button
                onClick={() => setRol("paciente")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  rol === "paciente"
                    ? "bg-white text-[#0f1f3f] shadow-sm"
                    : "text-[#4f617b] hover:text-[#1f304b]",
                ].join(" ")}
              >
                Paciente
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-[#546a87]">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
                  placeholder={rol === "psicólogo" ? "psicologo@pensarse.demo" : "paciente@pensarse.demo"}
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

            <button
              onClick={entrar}
              className="mt-6 w-full rounded-2xl bg-[#0f1f3f] px-5 py-3 text-sm font-medium text-white shadow hover:bg-[#1a2c4f]"
            >
              Entrar como {rol}
            </button>

            <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <div className="text-xs font-semibold text-[#607794]">Modo demo</div>
              <div className="mt-1 text-sm text-[#1f2d45]">
                {rol === "psicólogo" ? "Entrarás al panel del psicólogo." : "Entrarás al espacio del paciente."}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
