"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

function formatRelative(value: string) {
  if (!value) return "Sin actualización";
  const date = new Date(value);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Actualizado hoy";
  if (days === 1) return "Actualizado ayer";
  return `Actualizado hace ${days} días`;
}

export default function InformesPage() {
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

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Informes</h1>
        <p className="mt-2 text-sm text-[#607794]">
          Resumen de evolución real para preparar mejor la siguiente sesión.
        </p>
      </section>

      <section className="space-y-4">
        {loading && (
          <div className="rounded-[26px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
            Cargando informes reales...
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="rounded-[26px] border border-[#d7deea] bg-white p-6 text-sm text-[#4f617b]">
            No hay datos suficientes para generar informes todavía.
          </div>
        )}

        {!loading &&
          reports.map((item) => (
            <article key={item.patientId} className="rounded-[26px] border border-[#d7deea] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold text-[#1f2d45]">{item.name}</h2>
                    <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#607794]">
                      {item.periodLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#546a87]">{item.summary}</p>
                </div>
                <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#607794]">
                  {formatRelative(item.lastUpdatedAt)}
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between text-xs text-[#607794]">
                    <span>{item.periodLabel}</span>
                    <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1">
                      media {item.averageLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex h-28 items-end justify-between gap-2">
                    {(item.bars.length > 0 ? item.bars : [{ label: "-", value: 16, hasData: false }]).map((bar, i) => (
                      <div key={`${item.patientId}-${bar.label}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className={[
                            "w-7 rounded-t-2xl shadow-[0_4px_12px_rgba(17,111,177,0.22)] sm:w-8",
                            bar.hasData
                              ? "bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef]"
                              : "bg-[#dbe7f4]",
                          ].join(" ")}
                          style={{ height: `${bar.value}px` }}
                        />
                        <span className="text-[10px] text-[#607794]">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#607794]">Progreso terapéutico</p>
                      <p className="mt-1 text-2xl font-semibold text-[#0f172a]">{item.progressPercent}%</p>
                    </div>
                    <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                      {item.progressLabel}
                    </span>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#deebf8]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0f1f3f] via-[#1272b7] to-[#21b5ee]"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                      <p className="text-xs text-[#607794]">Registros</p>
                      <p className="mt-1 text-lg font-semibold text-[#0f172a]">{item.completedCheckins}</p>
                    </div>
                    <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                      <p className="text-xs text-[#607794]">Activas</p>
                      <p className="mt-1 text-lg font-semibold text-[#0f172a]">{item.activeTasks}</p>
                    </div>
                    <div className="rounded-xl border border-[#d9e1ee] bg-white p-3">
                      <p className="text-xs text-[#607794]">Completadas</p>
                      <p className="mt-1 text-lg font-semibold text-[#0f172a]">{item.completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/panel/pacientes/${item.patientId}`}
                  className="rounded-xl border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-xs text-[#607794]"
                >
                  Ver ficha
                </Link>
              </div>
            </article>
          ))}
      </section>
    </div>
  );
}
