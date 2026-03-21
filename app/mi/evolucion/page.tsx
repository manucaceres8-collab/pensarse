"use client";

import { useEffect, useMemo, useState } from "react";

type TrackingScale = "emoji" | "numeric_5" | "numeric_10" | "wellbeing_text" | "anxiety_text";

type Checkin = {
  id: string;
  mood: string;
  text: string;
  createdAt: string;
};

type PatientPayload = {
  trackingScale: TrackingScale;
  checkins: Checkin[];
};

type DayPoint = {
  key: string;
  label: string;
  score: number | null;
};

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function moodToScore(scale: TrackingScale, mood: string) {
  const normalized = mood.trim();

  if (scale === "emoji") {
    const map: Record<string, number> = {
      "😣": 2,
      "😔": 4,
      "😐": 6,
      "🙂": 8,
      "😄": 10,
    };
    return map[normalized] ?? null;
  }

  if (scale === "numeric_5") {
    const value = Number(normalized);
    if (!Number.isFinite(value) || value < 1 || value > 5) return null;
    return value * 2;
  }

  if (scale === "numeric_10") {
    const value = Number(normalized);
    if (!Number.isFinite(value) || value < 1 || value > 10) return null;
    return value;
  }

  if (scale === "wellbeing_text") {
    const map: Record<string, number> = {
      "Muy mal": 2,
      Mal: 4,
      Regular: 6,
      Bien: 8,
      "Muy bien": 10,
    };
    return map[normalized] ?? null;
  }

  const anxietyMap: Record<string, number> = {
    Nada: 10,
    Poca: 8,
    Media: 6,
    Alta: 4,
    "Muy alta": 2,
  };

  return anxietyMap[normalized] ?? null;
}

function trendLabel(first: number, last: number) {
  const diff = last - first;
  if (diff > 0.5) return "Mejora";
  if (diff < -0.5) return "Descenso";
  return "Estable";
}

export default function EvolucionPage() {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientPayload | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvolution() {
      try {
        const res = await fetch("/api/demo/patients/me", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as { patient?: PatientPayload };
        if (mounted) {
          setPatient(data.patient ?? null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEvolution();

    return () => {
      mounted = false;
    };
  }, []);

  const weeklyPoints = useMemo(() => {
    const scale = patient?.trackingScale ?? "emoji";
    const now = new Date();
    const days: DayPoint[] = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      days.push({
        key: toDayKey(date),
        label: WEEKDAY_LABELS[date.getDay()],
        score: null,
      });
    }

    const dayMap = new Map(days.map((day) => [day.key, day]));

    (patient?.checkins ?? []).forEach((checkin) => {
      const created = new Date(checkin.createdAt);
      const key = toDayKey(created);
      const current = dayMap.get(key);
      if (!current) return;

      const score = moodToScore(scale, checkin.mood);
      if (score == null) return;

      current.score = score;
    });

    return days;
  }, [patient]);

  const scoredDays = useMemo(() => weeklyPoints.filter((day) => day.score != null) as Array<DayPoint & { score: number }>, [weeklyPoints]);

  const hasData = scoredDays.length > 0;

  const avg = useMemo(() => {
    if (!hasData) return null;
    const total = scoredDays.reduce((acc, item) => acc + item.score, 0);
    return total / scoredDays.length;
  }, [hasData, scoredDays]);

  const bestDay = useMemo(() => {
    if (!hasData) return null;
    return scoredDays.reduce((best, current) => (current.score > best.score ? current : best));
  }, [hasData, scoredDays]);

  const worstDay = useMemo(() => {
    if (!hasData) return null;
    return scoredDays.reduce((worst, current) => (current.score < worst.score ? current : worst));
  }, [hasData, scoredDays]);

  const trend = useMemo(() => {
    if (scoredDays.length < 2) return null;
    const first = scoredDays[0].score;
    const last = scoredDays[scoredDays.length - 1].score;
    return trendLabel(first, last);
  }, [scoredDays]);

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Evolución</h1>
        <p className="mt-2 text-sm text-[#607794]">Lectura simple y visual de tu registro emocional semanal.</p>
      </section>

      {loading && (
        <section className="rounded-[26px] border border-[#d7deea] bg-white p-6 text-sm text-[#607794]">
          Cargando evolución...
        </section>
      )}

      {!loading && !hasData && (
        <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Todavía no hay registros</h2>
          <p className="mt-2 text-sm text-[#546a87]">
            Cuando completes tu primer seguimiento diario, aquí verás tu evolución.
          </p>
        </section>
      )}

      {!loading && hasData && (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
              <p className="text-xs text-[#607794]">Media semanal</p>
              <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{avg?.toFixed(1)}</p>
            </div>
            <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
              <p className="text-xs text-[#607794]">Mejor día</p>
              <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{bestDay?.label}</p>
            </div>
            <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
              <p className="text-xs text-[#607794]">Día más bajo</p>
              <p className="mt-2 text-4xl font-semibold text-[#0f172a]">{worstDay?.label}</p>
            </div>
            <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
              <p className="text-xs text-[#607794]">Tendencia</p>
              <p className="mt-2 text-2xl font-semibold text-[#0f172a]">{trend ?? "Sin tendencia"}</p>
            </div>
          </section>

          <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Gráfica semanal</h2>
            <p className="mt-1 text-sm text-[#607794]">Puntuación real de estado emocional (0-10).</p>

            <div className="mt-6 flex h-64 items-end justify-between gap-2">
              {weeklyPoints.map((item) => {
                const score = item.score ?? 0;
                const hasScore = item.score != null;
                const barHeight = hasScore ? Math.max(16, score * 16) : 8;

                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                    <div className="text-xs text-[#607794]">{hasScore ? item.score : "-"}</div>
                    <div className="flex h-48 items-end">
                      <div
                        className={[
                          "w-9 rounded-t-2xl shadow-[0_4px_12px_rgba(17,111,177,0.28)]",
                          hasScore
                            ? "bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef]"
                            : "bg-slate-200",
                        ].join(" ")}
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                    <div className="text-xs text-[#607794]">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#0f172a]">Lectura rápida</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#546a87]">
              <li>- Media semanal real: {avg?.toFixed(1)} / 10.</li>
              <li>- Mejor día reciente: {bestDay?.label} ({bestDay?.score}/10).</li>
              <li>- Día más bajo reciente: {worstDay?.label} ({worstDay?.score}/10).</li>
              <li>- Tendencia actual: {trend ?? "sin datos suficientes"}.</li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
