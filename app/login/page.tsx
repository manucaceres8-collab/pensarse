"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Rol = "psicologo" | "paciente";

export default function LoginPage() {
  const router = useRouter();

  const [rol, setRol] = useState<Rol>("psicologo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromQuery = new URLSearchParams(window.location.search).get("rol");
    if (fromQuery === "paciente" || fromQuery === "psicologo") {
      setRol(fromQuery);
    }
  }, []);

  function entrar() {
    if (rol === "psicologo") {
      router.push("/panel");
    } else {
      router.push("/mi");
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f8ff] px-6 py-10 text-[#0f172a]">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-[#dbeafe] bg-white p-8 shadow-sm md:p-10">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-1">
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
                <p className="text-sm text-[#64748b]">Seguimiento terapeutico entre sesiones</p>
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight md:text-5xl">Acceso demo</h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#64748b] md:text-lg">
              Simula la entrada como psicologo o paciente para ver el flujo completo de la herramienta.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#64748b]">Psicologo</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">Dashboard, pacientes e informes</div>
              </div>

              <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#64748b]">Paciente</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">Registro diario, tareas y evolucion</div>
              </div>

              <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                <div className="text-xs font-semibold text-[#64748b]">Demo</div>
                <div className="mt-1 text-sm font-semibold text-[#0f172a]">No guarda usuarios reales</div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="rounded-2xl border border-[#dbeafe] bg-white px-4 py-3 text-sm text-[#4f7fbf] shadow-sm hover:bg-[#eff6ff]"
              >
                Volver al inicio
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbeafe] bg-white p-8 shadow-sm md:p-10">
            <div className="text-sm font-semibold text-[#0f172a]">Iniciar sesion</div>
            <p className="mt-1 text-sm text-[#64748b]">
              Acceso demo para {rol === "psicologo" ? "psicologo" : "paciente"}.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#eff6ff] p-1">
              <button
                onClick={() => setRol("psicologo")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  rol === "psicologo" ? "bg-white text-[#1d4ed8] shadow-sm" : "text-[#64748b]",
                ].join(" ")}
              >
                Psicologo
              </button>

              <button
                onClick={() => setRol("paciente")}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  rol === "paciente" ? "bg-white text-[#1d4ed8] shadow-sm" : "text-[#64748b]",
                ].join(" ")}
              >
                Paciente
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-[#64748b]">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#dbeafe] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f7fbf]"
                  placeholder={rol === "psicologo" ? "psicologo@pensarse.demo" : "paciente@pensarse.demo"}
                />
              </div>

              <div>
                <label className="text-sm text-[#64748b]">Contrasena</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#dbeafe] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f7fbf]"
                  placeholder="********"
                />
              </div>
            </div>

            <button
              onClick={entrar}
              className="mt-6 w-full rounded-2xl bg-[#4f7fbf] px-5 py-3 text-sm text-white shadow hover:bg-[#3e6ea8]"
            >
              Entrar como {rol === "psicologo" ? "psicologo" : "paciente"}
            </button>

            <div className="mt-4 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-4">
              <div className="text-xs font-semibold text-[#64748b]">Modo demo</div>
              <div className="mt-1 text-sm text-[#0f172a]">
                {rol === "psicologo" ? "Entraras al panel del psicologo." : "Entraras al espacio del paciente."}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
