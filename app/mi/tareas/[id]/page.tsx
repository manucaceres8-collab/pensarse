"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function TareaEjercicio() {
  const params = useParams();
  const id = params.id;

  const [done, setDone] = useState(false);

  const [situacion, setSituacion] = useState("");
  const [pensamiento, setPensamiento] = useState("");
  const [emocion, setEmocion] = useState("");
  const [conducta, setConducta] = useState("");

  const [pensamientoAlt, setPensamientoAlt] = useState("");

  const [registroBreve, setRegistroBreve] = useState("");

  function guardar() {
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">

        <a
          href="/mi"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Volver
        </a>

        <h1 className="mt-4 text-2xl font-semibold">
          Ejercicio terapéutico
        </h1>

        {/* REGISTRO BREVE */}
        {id === "registro" && (
          <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Registro diario breve
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Escribe en 1–2 frases cómo ha sido tu día o algo importante que
              haya pasado.
            </p>

            <textarea
              value={registroBreve}
              onChange={(e) => setRegistroBreve(e.target.value)}
              className="mt-4 w-full rounded-xl border p-4"
              rows={4}
              placeholder="Hoy me he sentido..."
            />

            <button
              onClick={guardar}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-white"
            >
              Guardar
            </button>
          </section>
        )}

        {/* REGISTRO ABC */}
        {id === "abc" && (
          <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Registro ABC
            </h2>

            <div className="mt-4 space-y-4">

              <div>
                <label className="text-sm text-slate-600">
                  Situación
                </label>
                <textarea
                  value={situacion}
                  onChange={(e) => setSituacion(e.target.value)}
                  className="mt-1 w-full rounded-xl border p-3"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Pensamiento automático
                </label>
                <textarea
                  value={pensamiento}
                  onChange={(e) => setPensamiento(e.target.value)}
                  className="mt-1 w-full rounded-xl border p-3"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Emoción
                </label>
                <textarea
                  value={emocion}
                  onChange={(e) => setEmocion(e.target.value)}
                  className="mt-1 w-full rounded-xl border p-3"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Conducta
                </label>
                <textarea
                  value={conducta}
                  onChange={(e) => setConducta(e.target.value)}
                  className="mt-1 w-full rounded-xl border p-3"
                  rows={2}
                />
              </div>

            </div>

            <button
              onClick={guardar}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-white"
            >
              Guardar
            </button>
          </section>
        )}

        {/* REESTRUCTURACIÓN */}
        {id === "reestructuracion" && (
          <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Reestructuración cognitiva
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Escribe un pensamiento alternativo más equilibrado.
            </p>

            <textarea
              value={pensamientoAlt}
              onChange={(e) => setPensamientoAlt(e.target.value)}
              className="mt-4 w-full rounded-xl border p-4"
              rows={4}
              placeholder="Podría ser que..."
            />

            <button
              onClick={guardar}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2 text-white"
            >
              Guardar
            </button>
          </section>
        )}

        {done && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">
            Ejercicio guardado (demo)
          </div>
        )}
      </div>
    </main>
  );
}