"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAllowedPsychologistEmail } from "@/lib/allowed-emails";

export default function RegisterPsicologoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Nombre, email y contraseña (mín. 6 caracteres) son obligatorios.");
      return;
    }

    if (!isAllowedPsychologistEmail(email)) {
      setError("Pensar(SE está en fase piloto privado. Este correo no tiene acceso autorizado.");
      return;
    }

    setSaving(true);
    try {
      let supabase;
      try {
        supabase = createClient();
      } catch {
        setError("No se pudo inicializar la autenticación.");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (signUpError || !data.user) {
        setError(signUpError?.message ?? "No se pudo registrar el psicólogo.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: email.trim(),
        role: "psicologo",
        name: name.trim(),
        clinic_name: clinicName.trim() || null,
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      router.push("/panel");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf1f7] px-6 py-10 text-[#0f172a]">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-4xl font-semibold tracking-tight text-[#0f172a]">
          Pensar<span className="text-[#4f7fbf]">(SE)</span>
        </div>

        <section className="rounded-[26px] border border-[#d7deea] bg-white p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">Registro psicólogo</h1>

          <form className="mt-6 space-y-4" onSubmit={register}>
            <div>
              <label className="text-sm text-[#546a87]">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
              />
            </div>

            <div>
              <label className="text-sm text-[#546a87]">Nombre de consulta (opcional)</label>
              <input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
              />
            </div>

            <div>
              <label className="text-sm text-[#546a87]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
              />
            </div>

            <div>
              <label className="text-sm text-[#546a87]">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] px-4 py-3 text-sm outline-none focus:border-[#b8c8de]"
              />
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-[#0f1f3f] px-5 py-3 text-sm font-medium text-white shadow hover:bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-4 block text-center text-sm font-medium text-[#1f304b] underline-offset-4 hover:underline"
          >
            Ya tengo cuenta
          </Link>
        </section>
      </div>
    </main>
  );
}
