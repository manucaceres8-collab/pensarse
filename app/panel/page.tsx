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
      <section className="overflow-hidden rounded-[30px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f9fd_100%)] p-6 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6a7f9a]">Panel psicólogo</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#0f172a]">Dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#607794]">
          Resumen real de tus pacientes y su actividad entre sesiones.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pacientes", totalPatients, "vinculados a tu cuenta"],
          ["Tareas activas", totalActiveTasks, "pendientes o en curso"],
          ["Registros recientes", totalRecentCheckins, "últimos 7 días"],
          ["Progreso medio", `${averageProgress}%`, "según adherencia reciente"],
        ].map(([label, value, caption]) => (
          <div
            key={label}
            className="rounded-[26px] border border-[#d8e4ef] bg-white/92 p-5 shadow-[0_16px_28px_rgba(15,23,42,0.05)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#607794]">{label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#0f172a]">{value}</p>
            <p className="mt-2 text-xs text-[#6e84a0]">{caption}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border border-[#d8e4ef] bg-white/92 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">Evolución reciente</h2>
            <p className="mt-1 text-sm text-[#607794]">
              Informes reales construidos con check-ins, tareas y notas.
            </p>
          </div>
          <Link
            href="/panel/informes"
            className="rounded-full border border-[#d8e4ef] bg-[#f5fbff] px-4 py-2 text-xs font-medium text-[#1272b7] transition hover:bg-white"
          >
            Ver informes
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {loading && (
            <div className="rounded-[24px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f5faff_100%)] p-5 text-sm text-[#4f617b]">
              Cargando informes reales...
            </div>
          )}

          {!loading && reports.length === 0 && (
            <div className="rounded-[24px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f5faff_100%)] p-5 text-sm text-[#4f617b]">
              Todavía no hay pacientes con datos suficientes para generar informes.
            </div>
          )}

          {!loading &&
            reports.slice(0, 4).map((report) => (
              <Link
                key={report.patientId}
                href={`/panel/pacientes/${report.patientId}`}
                className="block rounded-[26px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] p-5 shadow-[0_14px_26px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_36px_rgba(15,23,42,0.07)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xl font-semibold text-[#1f2d45]">{report.name}</p>
                      <span className="rounded-full border border-[#d8e4ef] bg-white px-3 py-1 text-[11px] font-medium text-[#607794]">
                        {report.periodLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#4f617b]">{report.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#607794]">
                      <span className="rounded-full bg-white px-2.5 py-1">{report.completedCheckins} registros</span>
                      <span className="rounded-full bg-white px-2.5 py-1">{report.completedTasks} tareas completadas</span>
                      <span className="rounded-full bg-white px-2.5 py-1">{report.activeTasks} tareas activas</span>
                      <span className="rounded-full bg-white px-2.5 py-1">{report.trendLabel}</span>
                    </div>
                  </div>

                  <div className="min-w-[240px] max-w-[310px] flex-1">
                    <div className="flex items-center justify-between text-xs text-[#607794]">
                      <span>{report.progressLabel}</span>
                      <span className="font-semibold text-[#163150]">{report.progressPercent}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#dfeaf5]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0f172a] via-[#1272b7] to-[#39bcea]"
                        style={{ width: `${report.progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-4 rounded-[20px] border border-[#e1eaf3] bg-white p-3">
                      <p className="text-xs text-[#607794]">
                        Media reciente: <span className="font-semibold text-[#163150]">{report.averageLabel}</span>
                      </p>
                      <p className="mt-1 text-xs text-[#607794]">Última actualización: {formatDate(report.lastUpdatedAt)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d8e4ef] bg-white/92 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">Accesos rápidos</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link
            href="/panel/pacientes/nuevo"
            className="rounded-[22px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f5faff_100%)] p-4 text-sm font-medium text-[#334155] transition duration-200 hover:-translate-y-0.5 hover:bg-white"
          >
            Crear nueva ficha de paciente
          </Link>
          <Link
            href="/panel/tareas"
            className="rounded-[22px] border border-[#d8e4ef] bg-[linear-gradient(180deg,#fbfdff_0%,#f5faff_100%)] p-4 text-sm font-medium text-[#334155] transition duration-200 hover:-translate-y-0.5 hover:bg-white"
          >
            Gestionar biblioteca de tareas
          </Link>
        </div>
      </section>
    </div>
  );
}
