"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PatientReport = {
  patientId: string;
  name: string;
  avatar: string;
  trackingScale: "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";
  periodLabel: string;
  lastUpdatedAt: string;
  averageLabel: string;
  trendLabel: string;
  completedCheckins: number;
  activeTasks: number;
  completedTasks: number;
  progressPercent: number;
  progressLabel: string;
  summary: string;
  bars: Array<{ label: string; value: number; hasData: boolean }>;
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
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadReports() {
      try {
        const res = await fetch("/api/patients/reports", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { reports: PatientReport[] };
        if (mounted) {
          setReports(data.reports ?? []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  const totalPatients = reports.length;
  const totalActiveTasks = useMemo(
    () => reports.reduce((acc, item) => acc + item.activeTasks, 0),
    [reports]
  );
  const totalRecentCheckins = useMemo(
    () => reports.reduce((acc, item) => acc + item.completedCheckins, 0),
    [reports]
  );
  const averageProgress = useMemo(() => {
    if (reports.length === 0) return 0;
    return Math.round(reports.reduce((acc, item) => acc + item.progressPercent, 0) / reports.length);
  }, [reports]);

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <p className="text-sm text-[#607794]">Panel psicólogo</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0f172a]">Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#607794]">
          Resumen real de tus pacientes y su actividad entre sesiones.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Pacientes</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{totalPatients}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">vinculados a tu cuenta</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Tareas activas</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{totalActiveTasks}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">pendientes o en curso</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Registros recientes</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{totalRecentCheckins}</p>
          <p className="mt-1 text-xs text-[#6e84a0]">últimos 7 días</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Progreso medio</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{averageProgress}%</p>
          <p className="mt-1 text-xs text-[#6e84a0]">según adherencia reciente</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f172a]">Evolución reciente</h2>
            <p className="mt-1 text-sm text-[#607794]">
              Informes reales construidos con check-ins, tareas y notas.
            </p>
          </div>
          <Link
            href="/panel/informes"
            className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-xs text-[#607794]"
          >
            Ver informes
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {loading && (
            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
              Cargando informes reales...
            </div>
          )}

          {!loading && reports.length === 0 && (
            <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 text-sm text-[#4f617b]">
              Todavía no hay pacientes con datos suficientes para generar informes.
            </div>
          )}

          {!loading &&
            reports.slice(0, 4).map((report) => (
              <Link
                key={report.patientId}
                href={`/panel/pacientes/${report.patientId}`}
                className="block rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-5 transition hover:bg-white"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-semibold text-[#1f2d45]">{report.name}</p>
                      <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-[11px] text-[#607794]">
                        {report.periodLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#4f617b]">{report.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#607794]">
                      <span>{report.completedCheckins} registros</span>
                      <span>{report.completedTasks} tareas completadas</span>
                      <span>{report.activeTasks} tareas activas</span>
                      <span>{report.trendLabel}</span>
                    </div>
                  </div>

                  <div className="min-w-[220px] flex-1 max-w-[280px]">
                    <div className="flex items-center justify-between text-xs text-[#607794]">
                      <span>{report.progressLabel}</span>
                      <span className="font-semibold text-[#1f304b]">{report.progressPercent}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#deebf8]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0f1f3f] via-[#1272b7] to-[#21b5ee]"
                        style={{ width: `${report.progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-[#607794]">
                      Media reciente: <span className="font-semibold text-[#1f304b]">{report.averageLabel}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#607794]">
                      Última actualización: {formatDate(report.lastUpdatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Accesos rápidos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link
            href="/panel/pacientes/nuevo"
            className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]"
          >
            Crear nueva ficha de paciente
          </Link>
          <Link
            href="/panel/tareas"
            className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]"
          >
            Gestionar biblioteca de tareas
          </Link>
        </div>
      </section>
    </div>
  );
}
