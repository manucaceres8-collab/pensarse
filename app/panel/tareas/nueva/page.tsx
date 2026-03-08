"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ResponseType =
  | "texto corto"
  | "escala 1-5"
  | "escala 1-10"
  | "selección emoji"
  | "formulario breve";

const responseOptions: ResponseType[] = [
  "texto corto",
  "escala 1-5",
  "escala 1-10",
  "selección emoji",
  "formulario breve",
];

export default function NuevaTareaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("5 min");
  const [responseType, setResponseType] = useState<ResponseType>("formulario breve");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardarDemo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/demo/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || "Tarea personalizada para seguimiento entre sesiones.",
          duration: duration.trim() || "5 min",
          responseType,
          instructions: instructions.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "No se pudo guardar la tarea.");
      }

      router.push("/panel/tareas");
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
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Nueva tarea personalizada</h1>
        <p className="mt-2 text-sm text-[#4f617b]">
          Diseña una tarea terapéutica nueva para tu biblioteca.
        </p>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <form className="space-y-4" onSubmit={guardarDemo}>
          <div>
            <label className="mb-1 block text-sm text-[#607794]">Título de la tarea</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Autoobservación de rumiación"
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Descripción breve</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumen claro de la tarea"
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#607794]">Duración estimada</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej: 5 min"
                className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#607794]">Tipo de respuesta</label>
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value as ResponseType)}
                className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm text-[#1f2d45] outline-none focus:border-[#b8c8de]"
              >
                {responseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#607794]">Instrucciones para el paciente</label>
            <textarea
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Escribe las instrucciones guiadas paso a paso..."
              className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-xl !bg-[#0f1f3f] px-4 py-2 text-sm font-medium !text-white transition hover:!bg-[#1a2c4f] disabled:cursor-not-allowed disabled:bg-slate-300"
              type="submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar en biblioteca"}
            </button>

            <Link
              href="/panel/tareas"
              className="rounded-xl border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-sm text-[#1f304b]"
            >
              Volver a tareas
            </Link>

            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
              Se guardará como personalizada
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}
