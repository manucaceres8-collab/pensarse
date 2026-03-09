"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TrackingScale = "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";

const SCALE_OPTIONS: Array<{ value: TrackingScale; label: string }> = [
  { value: "emoji", label: "Emojis emocionales" },
  { value: "numeric_5", label: "Escala numérica 1-5" },
  { value: "numeric_10", label: "Escala numérica 1-10" },
  { value: "wellbeing_text", label: "Escala textual bienestar" },
  { value: "anxiety_text", label: "Escala de ansiedad" },
];

const AVATAR_OPTIONS = [
  { value: "/avatars/maria.png", label: "Avatar Maria" },
  { value: "/avatars/juan.svg", label: "Avatar Juan" },
  { value: "/avatars/carlos.svg", label: "Avatar Carlos" },
  { value: "/avatars/eva.svg", label: "Avatar Eva" },
  { value: "/avatars/carmen.svg", label: "Avatar Carmen" },
  { value: "/avatars/placeholder.svg", label: "Placeholder" },
];

export default function NuevoPacientePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [objective, setObjective] = useState("");
  const [avatar, setAvatar] = useState("/avatars/placeholder.svg");
  const [trackingScale, setTrackingScale] = useState<TrackingScale>("emoji");
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
          avatar,
          trackingScale,
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
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Nuevo paciente</h1>
        <p className="mt-2 text-sm text-[#607794]">
          Crea una ficha para activar seguimiento entre sesiones.
        </p>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-[#607794]">Nombre o alias</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan"
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Email del paciente</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@email.com"
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Avatar demo</label>
            <select
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#1f2d45] outline-none focus:border-[#b8c8de]"
            >
              {AVATAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Escala de seguimiento diario</label>
            <select
              value={trackingScale}
              onChange={(e) => setTrackingScale(e.target.value as TrackingScale)}
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#1f2d45] outline-none focus:border-[#b8c8de]"
            >
              {SCALE_OPTIONS.map((scale) => (
                <option key={scale.value} value={scale.value}>
                  {scale.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Objetivo inicial</label>
            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe foco terapéutico inicial..."
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
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
              className="rounded-xl bg-[#0f1f3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Guardando..." : "Crear paciente"}
            </button>
            <Link
              href="/panel/pacientes"
              className="rounded-xl border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-sm text-[#607794]"
            >
              Volver al listado
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
