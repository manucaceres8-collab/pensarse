"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PatientListItem = {
  id: string;
  name: string;
  status: string;
  lastCheckinAt: string;
  tasks: { id: string }[];
  checkins: { text: string }[];
};

function formatDate(value: string) {
  if (!value) return "Sin actividad";
  const date = new Date(value);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PacientesPage() {
  const [allPatients, setAllPatients] = useState<PatientListItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPatients() {
      try {
        const res = await fetch("/api/demo/patients", { cache: "no-store" });
        const data = (await res.json()) as { patients: PatientListItem[] };
        if (mounted) {
          setAllPatients(data.patients ?? []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPatients();

    return () => {
      mounted = false;
    };
  }, []);

  const patients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return allPatients;

    return allPatients.filter((patient) =>
      patient.name.toLowerCase().includes(normalized)
    );
  }, [allPatients, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Lista viva: nuevos pacientes y actividad se reflejan automaticamente.
          </p>
        </div>

        <Link
          href="/panel/pacientes/nuevo"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Nuevo paciente
        </Link>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-white p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:border-blue-300"
          placeholder="Buscar paciente..."
        />
      </section>

      <section className="space-y-3">
        {loading && (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-sm text-slate-500">
            Cargando pacientes...
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-sm text-slate-500">
            No hay pacientes para ese filtro.
          </div>
        )}

        {!loading &&
          patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/panel/pacientes/${patient.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-white p-5 transition hover:bg-blue-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">{patient.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Ultimo check-in: {formatDate(patient.lastCheckinAt)}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {patient.checkins[0]?.text || "Sin notas de check-in todavia."}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {patient.status}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {patient.tasks.length} tareas
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </section>
    </div>
  );
}
