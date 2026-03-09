"use client";

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
    <main className="flex min-h-screen items-center justify-center bg-[#edf1f7] px-6 py-10 text-[#0f172a]">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#0f172a]">
          Pensar<span className="text-[#4f7fbf]">(SE)</span>
        </div>

        <section className="rounded-[26px] border border-[#d7deea] bg-white p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">Login psicólogo / paciente</h1>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#edf4ff] p-1">
            <button
              onClick={() => setRol("psicólogo")}
              className={[
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                rol === "psicólogo" ? "bg-white text-[#0f1f3f] shadow-sm" : "text-[#4f617b] hover:text-[#1f304b]",
              ].join(" ")}
            >
              Psicólogo
            </button>

            <button
              onClick={() => setRol("paciente")}
              className={[
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                rol === "paciente" ? "bg-white text-[#0f1f3f] shadow-sm" : "text-[#4f617b] hover:text-[#1f304b]",
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
            {rol === "psicólogo" ? "Entrar como psicólogo" : "Entrar como paciente"}
          </button>

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
