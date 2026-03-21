"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProfileAvatar from "../../components/ProfileAvatar";

type PatientListItem = {
  id: string;
  name: string;
  avatar: string;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function removePatient(patientId: string, patientName: string) {
    const confirmed = window.confirm(`¿Eliminar paciente ${patientName}? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeletingId(patientId);
    try {
      const res = await fetch(`/api/demo/patients/${patientId}`, {
        method: "DELETE",
      });

      if (!res.ok) return;

      setAllPatients((prev) => prev.filter((item) => item.id !== patientId));
    } finally {
      setDeletingId(null);
    }
  }

  const patients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return allPatients;

    return allPatients.filter((patient) => patient.name.toLowerCase().includes(normalized));
  }, [allPatients, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Pacientes</h1>
          <p className="mt-1 text-sm text-[#4f617b]">
            Alta, seguimiento y actividad en vivo entre paciente y psicólogo.
          </p>
        </div>

        <Link
          href="/panel/pacientes/nuevo"
          className="rounded-2xl !bg-[#0f1f3f] px-5 py-3 text-sm font-medium !text-white shadow-[0_6px_14px_rgba(15,31,63,0.24)] transition hover:!bg-[#1b2b4d]"
        >
          Nuevo paciente
        </Link>
      </div>

      <section className="rounded-[22px] border border-[#d7deea] bg-white p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[#d9e1ee] bg-[#f8fbff] px-3 py-2 text-sm outline-none focus:border-[#b8c8de]"
          placeholder="Buscar paciente..."
        />
      </section>

      <section className="space-y-3">
        {loading && (
          <div className="rounded-[24px] border border-[#d7deea] bg-white p-5 text-sm text-[#4f617b]">
            Cargando pacientes...
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="rounded-[24px] border border-[#d7deea] bg-white p-5 text-sm text-[#4f617b]">
            No hay pacientes para ese filtro.
          </div>
        )}

        {!loading &&
          patients.map((patient) => {
            const deleting = deletingId === patient.id;

            return (
              <div key={patient.id} className="rounded-[24px] border border-[#d7deea] bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/panel/pacientes/${patient.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3 transition hover:opacity-90"
                  >
                    <ProfileAvatar
                      src={patient.avatar}
                      fallbackSrc="/avatars/placeholder.svg"
                      alt={`Foto de ${patient.name}`}
                      size={64}
                      className="h-16 w-16 rounded-full border border-[#cfdae9] bg-[#f7f9fd] object-cover"
                    />
                    <div>
                      <p className="text-2xl font-semibold text-[#1f2d45]">{patient.name}</p>
                      <p className="mt-1 text-xs text-[#607794]">Último check-in: {formatDate(patient.lastCheckinAt)}</p>
                      <p className="mt-2 text-sm text-[#4f617b]">
                        {patient.checkins[0]?.text || "Sin notas de check-in todavía."}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#cbd8ea] bg-[#edf4ff] px-3 py-1 text-xs font-medium text-[#1f304b]">
                      {patient.status}
                    </span>
                    <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#1f304b]">
                      {patient.tasks.length} tareas
                    </span>
                    <button
                      onClick={() => removePatient(patient.id, patient.name)}
                      disabled={deleting}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleting ? "Eliminando..." : "Eliminar paciente"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
}
