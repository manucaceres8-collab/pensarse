"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PatientSummary = {
  id: string;
  name: string;
  status: string;
  lastCheckinAt: string;
  tasks: { id: string }[];
  checkins: { text: string }[];
};

function formatDate(value: string) {
  if (!value) return "Sin actividad";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PanelPage() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPatients() {
      try {
        const res = await fetch("/api/demo/patients", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { patients: PatientSummary[] };
        if (mounted) {
          setPatients(data.patients ?? []);
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

  const totalPatients = patients.length;
  const totalTasks = useMemo(() => patients.reduce((acc, p) => acc + p.tasks.length, 0), [patients]);
  const recentCheckins = useMemo(
    () => patients.filter((p) => p.lastCheckinAt && p.lastCheckinAt.length > 0).length,
    [patients]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <p className="text-sm text-[#607794]">Panel psicólogo</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0f172a]">Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#607794]">
          Resumen real de tus pacientes y su actividad entre sesiones.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Pacientes</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{totalPatients}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">vinculados a tu cuenta</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Tareas activas</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{totalTasks}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">total asignadas</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Check-ins recientes</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{recentCheckins}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">con actividad registrada</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f172a]">Tus pacientes</h2>
            <p className="mt-1 text-sm text-[#607794]">Última actividad y estado</p>
          </div>
          <Link
            href="/panel/pacientes"
            className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-xs text-[#607794]"
          >
            Ver pacientes
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {loading && (
            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
              Cargando pacientes...
            </div>
          )}

          {!loading && patients.length === 0 && (
            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
              Aún no tienes pacientes. Empieza creando uno nuevo.
            </div>
          )}

          {!loading &&
            patients.slice(0, 5).map((patient) => (
              <Link
                key={patient.id}
                href={`/panel/pacientes/${patient.id}`}
                className="block rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 transition hover:bg-[#eef4ff]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1f2d45]">{patient.name}</p>
                    <p className="mt-1 text-xs text-[#607794]">Último registro: {formatDate(patient.lastCheckinAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                      {patient.status}
                    </span>
                    <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                      {patient.tasks.length} tareas
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Accesos rápidos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link href="/panel/pacientes/nuevo" className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]">
            Crear nueva ficha de paciente
          </Link>
          <Link href="/panel/tareas" className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]">
            Gestionar biblioteca de tareas
          </Link>
        </div>
      </section>
    </div>
  );
}
