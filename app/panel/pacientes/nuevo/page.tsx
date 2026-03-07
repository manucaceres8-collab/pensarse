"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevoPacientePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [objective, setObjective] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/demo/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          objective: objective.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "No se pudo crear el paciente.");
      }

      router.push("/panel/pacientes");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Nuevo paciente</h1>
        <p className="mt-2 text-sm text-slate-600">
          Al guardar, el paciente aparecera automaticamente en el listado del psicologo.
        </p>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Nombre o alias</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Email del paciente</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@email.com"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Objetivo inicial</label>
            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe foco terapeutico inicial..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:border-blue-300"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Guardando..." : "Crear paciente"}
            </button>
            <Link
              href="/panel/pacientes"
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-600"
            >
              Volver al listado
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
