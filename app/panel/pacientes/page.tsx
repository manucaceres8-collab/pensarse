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
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-[30px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f9fd_100%)] p-6 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6a7f9a]">Seguimiento clínico</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#0f172a]">Pacientes</h1>
          <p className="mt-2 text-sm leading-6 text-[#4f617b]">
            Alta, seguimiento y actividad en vivo entre paciente y psicólogo.
          </p>
        </div>

        <Link
          href="/panel/pacientes/nuevo"
          className="rounded-2xl bg-[#1272b7] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_28px_rgba(18,114,183,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0f68a8]"
        >
          Nuevo paciente
        </Link>
      </section>

      <section className="rounded-[26px] border border-[#d8e4ef] bg-white/92 p-4 shadow-[0_16px_28px_rgba(15,23,42,0.05)]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-[#d8e4ef] bg-[#f8fbff] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#97c3df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(18,114,183,0.10)]"
          placeholder="Buscar paciente..."
        />
      </section>

      <section className="space-y-3">
        {loading && (
          <div className="rounded-[26px] border border-[#d8e4ef] bg-white/92 p-5 text-sm text-[#4f617b] shadow-[0_14px_24px_rgba(15,23,42,0.04)]">
            Cargando pacientes...
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="rounded-[26px] border border-[#d8e4ef] bg-white/92 p-5 text-sm text-[#4f617b] shadow-[0_14px_24px_rgba(15,23,42,0.04)]">
            No hay pacientes para ese filtro.
          </div>
        )}

        {!loading &&
          patients.map((patient) => {
            const deleting = deletingId === patient.id;

            return (
              <div
                key={patient.id}
                className="rounded-[28px] border border-[#d8e4ef] bg-white/92 p-5 shadow-[0_16px_28px_rgba(15,23,42,0.05)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href={`/panel/pacientes/${patient.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4 transition duration-200 hover:opacity-90"
                  >
                    <ProfileAvatar
                      src={patient.avatar}
                      fallbackSrc="/avatars/placeholder.svg"
                      alt={`Foto de ${patient.name}`}
                      size={64}
                      className="h-16 w-16 rounded-full border border-[#cfdae9] bg-white object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-2xl font-semibold tracking-[-0.03em] text-[#1f2d45]">{patient.name}</p>
                      <p className="mt-1 text-xs text-[#607794]">Último check-in: {formatDate(patient.lastCheckinAt)}</p>
                      <p className="mt-2 text-sm leading-6 text-[#4f617b]">
                        {patient.checkins[0]?.text || "Sin notas de check-in todavía."}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#cfe0ef] bg-[#edf6ff] px-3 py-1 text-xs font-medium text-[#1f304b]">
                      {patient.status}
                    </span>
                    <span className="rounded-full border border-[#d8e4ef] bg-white px-3 py-1 text-xs font-medium text-[#607794]">
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
