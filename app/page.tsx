"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import FloatingChat from "./components/FloatingChat";

const continuityCards = [
  {
    title: "Más adherencia terapéutica",
    text: "El paciente mantiene contacto con el proceso entre sesiones.",
  },
  {
    title: "Más claridad clínica",
    text: "Menos sesiones a ciegas y más contexto útil antes de consulta.",
  },
  {
    title: "Más continuidad real",
    text: "La terapia no se corta al salir de sesión.",
  },
  {
    title: "Mejor lectura del proceso",
    text: "Registros, tareas y respuestas se convierten en señales útiles.",
  },
];

const ecosystemCards = [
  {
    tag: "Informes",
    title: "Visión semanal lista antes de consulta",
    body: "Evolución, adherencia y resumen clínico en una sola vista.",
    variant: "large" as const,
  },
  {
    tag: "Evolución",
    title: "Patrones que no dependen del recuerdo",
    body: "Consulta cambios diarios sin tener que reconstruirlos.",
    variant: "medium" as const,
  },
  {
    tag: "Seguimiento",
    title: "Una herramienta viva, no un formulario más",
    body: "Seguimiento clínico útil, no solo recogida de datos.",
    variant: "compact" as const,
  },
  {
    tag: "Pacientes",
    title: "Panel claro para priorizar seguimiento",
    body: "Te ayuda a ver qué revisar primero en sesión.",
    variant: "compact" as const,
  },
  {
    tag: "Tareas",
    title: "Trabajo entre sesiones con estructura",
    body: "Tareas, respuestas y evolución dentro del mismo flujo.",
    variant: "large" as const,
  },
];

const faqItems = [
  {
    q: "¿Qué ve el psicólogo?",
    a: "Un resumen claro de evolución diaria, adherencia, seguimiento, tareas completadas y señales útiles antes de consulta.",
  },
  {
    q: "¿Qué tiene que hacer el paciente?",
    a: "Registrar su día, responder tareas breves y mantener un seguimiento simple entre sesiones.",
  },
  {
    q: "¿Cuánto tarda un registro diario?",
    a: "Aproximadamente 20 segundos.",
  },
  {
    q: "¿Necesito cambiar mi forma de trabajar?",
    a: "No. Pensarse se integra en tu práctica y te ayuda a ver mejor lo que ya ocurre.",
  },
];

const impactMetrics = [
  { value: "+60%", label: "adherencia entre sesiones" },
  { value: "-33%", label: "abandono del seguimiento" },
  { value: "+90%", label: "claridad clínica antes de consulta" },
];

const weeklyBars = [46, 58, 52, 74, 79, 66, 84];
const weeklyDays = ["L", "M", "X", "J", "V", "S", "D"];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ProductCard({
  tag,
  title,
  body,
  variant,
}: {
  tag: string;
  title: string;
  body: string;
  variant: "large" | "medium" | "compact";
}) {
  function renderPreview() {
    if (tag === "Informes") {
      return (
        <div className="mt-6 flex-1 space-y-3">
          <div className="h-2.5 overflow-hidden rounded-full bg-[#ecf2f8]">
            <div className="h-full w-[78%] bg-gradient-to-r from-[#0f172a] via-[#1272b7] to-[#59c4ef]" />
          </div>
          <div className="grid grid-cols-[0.85fr_1.15fr] gap-3">
            <div className="border border-[#e5edf5] bg-[#f8fbff] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Resumen</p>
              <p className="mt-2 text-lg font-semibold text-[#0f172a]">6.8/10</p>
              <p className="mt-1 text-[11px] text-[#64748b]">media semanal</p>
            </div>
            <div className="border border-[#e5edf5] bg-[#fbfdff] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Tareas</p>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#0f172a]">Registro ABC</span>
                  <span className="bg-[#e9fbef] px-1.5 py-0.5 text-[#15803d]">hecha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#0f172a]">STOP</span>
                  <span className="bg-[#fff4df] px-1.5 py-0.5 text-[#c27b13]">pend.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#e5edf5] bg-[#f7fbfe] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Resumen clínico</p>
              <span className="text-[10px] font-medium text-[#1272b7]">estable</span>
            </div>
            <div className="mt-3 flex h-12 items-end gap-1.5">
              {[34, 58, 46, 69, 54].map((bar, index) => (
                <div
                  key={`${tag}-${bar}-${index}`}
                  className="flex-1 rounded-t-[7px] bg-gradient-to-t from-[#1272b7] to-[#79d0f2]"
                  style={{ height: `${bar}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tag === "Evolución") {
      return (
        <div className="mt-6 flex-1 space-y-3">
          <div className="border border-[#e5edf5] bg-[#f8fbff] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Semana</p>
              <span className="text-[10px] font-medium text-[#0f172a]">patrón detectado</span>
            </div>
            <div className="mt-3 grid h-20 grid-cols-7 items-end gap-1.5">
              {[42, 64, 51, 76, 68, 57, 82].map((bar, index) => (
                <div key={`${tag}-${bar}-${index}`} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-[8px] bg-gradient-to-t from-[#0f172a] via-[#1272b7] to-[#7cd5f4]"
                    style={{ height: `${bar}%`, minHeight: "14px" }}
                  />
                  <span className="text-[9px] text-[#64748b]">{weeklyDays[index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Lun", "activación alta"],
              ["Jue", "más estabilidad"],
              ["Dom", "mejor cierre"],
            ].map(([day, note]) => (
              <div key={`${tag}-${day}`} className="border border-[#e5edf5] bg-white p-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">{day}</p>
                <p className="mt-1 text-[11px] leading-4 text-[#0f172a]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tag === "Seguimiento") {
      return (
        <div className="mt-6 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#eef6ff] px-2 py-1 text-[10px] font-medium text-[#1272b7]">check-in diario</span>
            <span className="bg-[#e9fbef] px-2 py-1 text-[10px] font-medium text-[#15803d]">seguimiento activo</span>
            <span className="bg-[#fff4df] px-2 py-1 text-[10px] font-medium text-[#c27b13]">2 tareas abiertas</span>
          </div>
          <div className="border border-[#e5edf5] bg-[#f8fbff] p-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#64748b]">
              <span>Actividad</span>
              <span>74%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e6edf5]">
              <div className="h-full w-[74%] bg-gradient-to-r from-[#1272b7] to-[#73d2f3]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5">
                <p className="text-[#64748b]">último registro</p>
                <p className="mt-1 font-semibold text-[#0f172a]">hoy · 08:40</p>
              </div>
              <div className="bg-white p-2.5">
                <p className="text-[#64748b]">estado</p>
                <p className="mt-1 font-semibold text-[#0f172a]">en seguimiento</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tag === "Pacientes") {
      return (
        <div className="mt-6 flex-1 space-y-3">
          <div className="grid gap-2">
            {[
              ["Lucía Martín", "revisar informe", "alta"],
              ["Mario Ruiz", "2 tareas pendientes", "media"],
              ["Clara Soto", "sin check-in ayer", "alta"],
            ].map(([name, note, level]) => (
              <div key={`${tag}-${name}`} className="grid grid-cols-[1fr_auto] items-center gap-3 border border-[#e5edf5] bg-[#f8fbff] p-2.5">
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">{name}</p>
                  <p className="mt-0.5 text-[11px] text-[#64748b]">{note}</p>
                </div>
                <span className="bg-[#eef6ff] px-2 py-1 text-[10px] font-medium text-[#1272b7]">{level}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 flex-1 space-y-3">
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="border border-[#e5edf5] bg-[#f8fbff] p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Tareas</p>
            <div className="mt-2 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#0f172a]">Registro ABC</span>
                <span className="bg-[#e9fbef] px-1.5 py-0.5 text-[#15803d]">ok</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0f172a]">Valores</span>
                <span className="bg-[#fff4df] px-1.5 py-0.5 text-[#c27b13]">hoy</span>
              </div>
            </div>
          </div>
          <div className="border border-[#e5edf5] bg-[#fbfdff] p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Respuesta</p>
            <p className="mt-2 text-[11px] leading-5 text-[#0f172a]">“Más calma por la tarde y mejor descanso.”</p>
          </div>
        </div>
        <div className="border border-[#e5edf5] bg-[#f7fbfe] p-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#64748b]">
            <span>Seguimiento</span>
            <span>5/7</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e6edf5]">
            <div className="h-full w-[71%] bg-gradient-to-r from-[#0f172a] via-[#1272b7] to-[#75d2f3]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "group flex h-full flex-col overflow-hidden border border-[#d8e3ee] bg-white/92 p-5 shadow-[0_18px_34px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_44px_rgba(15,23,42,0.12)]",
        variant === "large" && "min-h-[290px]",
        variant === "medium" && "min-h-[245px]",
        variant === "compact" && "min-h-[210px]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex bg-[#eaf3fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1272b7]">
          {tag}
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#34b2ea]" />
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-[#0f172a]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">{body}</p>
      </div>

      {renderPreview()}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_38%,#ffffff_100%)] text-[#111827]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden">
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-grid" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <header
          className={[
            "sticky top-4 z-40 flex items-center justify-between border px-5 py-4 transition duration-300",
            scrolled
              ? "border-[#dce6f0] bg-white/88 shadow-[0_18px_34px_rgba(15,23,42,0.08)] backdrop-blur"
              : "border-transparent bg-white/70 backdrop-blur",
          ].join(" ")}
        >
          <Link href="/" className="text-2xl font-semibold tracking-[-0.04em] text-[#1f2937]">
            pensar<span className="text-[#1272B7]">(SE)</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[#475569] transition hover:text-[#0f172a]">
              Acceso
            </Link>
            <Link
              href="/demo"
              className="rounded-xl bg-[#1272B7] px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#0f68a8] hover:shadow-[0_16px_26px_rgba(18,114,183,0.28)]"
            >
              Solicitar demo
            </Link>
          </div>
        </header>

        <section className="pb-12 pt-14">
          <Reveal className="mx-auto max-w-6xl">
            <div className="max-w-5xl">
              <span className="inline-flex bg-[#e9f4fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1272B7]">
                Tecnología clínica para psicólogos
              </span>

              <h1 className="mt-6 max-w-6xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#0f172a] sm:text-6xl lg:text-[72px]">
                Haz visible lo que ocurre entre sesiones y conviértelo en criterio clínico útil.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#475569]">
                Pensarse ayuda a psicólogos a seguir mejor la evolución terapéutica con registros diarios, tareas breves
                e informes claros que ordenan lo importante antes de cada sesión.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border-l border-[#dce5ef] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">20 segundos</p>
                <p className="mt-1 text-sm text-[#64748b]">para registrar el día</p>
              </div>
              <div className="border-l border-[#dce5ef] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">1 vista</p>
                <p className="mt-1 text-sm text-[#64748b]">para revisar evolución y tareas</p>
              </div>
              <div className="border-l border-[#dce5ef] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">Más criterio</p>
                <p className="mt-1 text-sm text-[#64748b]">antes de iniciar la sesión</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Reveal delay={60}>
              <div className="group overflow-hidden border border-[#d7e3ef] bg-white/92 p-5 shadow-[0_22px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_48px_rgba(15,23,42,0.12)]">
                <div className="flex items-start justify-between gap-3 border-b border-[#e8eef5] pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1272B7]">
                      Informe semanal
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">María López</h3>
                    <p className="mt-1 text-xs text-[#64748b]">Últimos 7 días</p>
                  </div>
                  <span className="border border-[#dbe6f0] bg-[#f5fbff] px-2.5 py-1 text-[10px] font-medium text-[#1272B7]">
                    78%
                  </span>
                </div>

                <div className="mt-4 h-2.5 bg-[#e8eff6]">
                  <div className="h-full w-[78%] bg-gradient-to-r from-[#0f172a] via-[#1272B7] to-[#55c2ee]" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="border border-[#e5edf5] bg-[#fbfdff] p-3">
                    <p className="text-[11px] text-[#64748b]">Registros</p>
                    <p className="mt-1 text-lg font-semibold text-[#0f172a]">5/7</p>
                  </div>
                  <div className="border border-[#e5edf5] bg-[#fbfdff] p-3">
                    <p className="text-[11px] text-[#64748b]">Media</p>
                    <p className="mt-1 text-lg font-semibold text-[#0f172a]">6.8</p>
                  </div>
                </div>

                <div className="mt-4 border border-[#e5edf5] bg-[#fbfdff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-[#64748b]">Evolución semanal</p>
                    <span className="text-[11px] font-medium text-[#0f172a]">tendencia positiva</span>
                  </div>

                  <div className="relative mt-4 overflow-hidden rounded-[18px] border border-[#dde7f1] bg-[linear-gradient(180deg,#fafdff_0%,#f1f7fc_100%)] p-3">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(18,114,183,0.04)_1px,transparent_1px)] bg-[size:100%_28px]" />
                    <div className="relative grid h-36 grid-cols-7 items-end gap-2">
                      {weeklyBars.map((value, index) => (
                        <div key={`${value}-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
                          <div
                            className="w-full max-w-[30px] rounded-[10px_10px_4px_4px] bg-gradient-to-t from-[#0f172a] via-[#1272B7] to-[#68cef2] shadow-[0_12px_20px_rgba(18,114,183,0.24)]"
                            style={{ height: `${value}%`, minHeight: "28px" }}
                          />
                          <span className="text-[10px] font-medium text-[#607794]">{weeklyDays[index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="group overflow-hidden border border-[#d7e3ef] bg-white/92 p-5 shadow-[0_22px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_48px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1272B7]">
                      Evolución paciente
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Seguimiento en marcha</h3>
                  </div>
                  <span className="border border-[#dbe6f0] bg-white px-2.5 py-1 text-[10px] font-medium text-[#475569]">
                    estable
                  </span>
                </div>

                <div className="mt-4 border border-[#e5edf5] bg-[#fbfdff] p-4">
                  <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>Progreso terapéutico</span>
                    <span className="font-semibold text-[#0f172a]">72%</span>
                  </div>
                  <div className="mt-2 h-2.5 bg-[#e8eff6]">
                    <div className="h-full w-[72%] bg-gradient-to-r from-[#1272B7] to-[#6cd0f2]" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-white p-3">
                      <p className="text-[11px] text-[#64748b]">Registros</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">6</p>
                    </div>
                    <div className="bg-white p-3">
                      <p className="text-[11px] text-[#64748b]">Activas</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">2</p>
                    </div>
                    <div className="bg-white p-3">
                      <p className="text-[11px] text-[#64748b]">Hechas</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">4</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="group overflow-hidden border border-[#d7e3ef] bg-white/92 p-5 shadow-[0_22px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_48px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1272B7]">
                      Biblioteca de tareas
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Gestión de tareas</h3>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#34b2ea]" />
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { name: "Registro ABC", type: "TCC", time: "6 min" },
                    { name: "Valores personales", type: "ACT", time: "5 min" },
                    { name: "Técnica STOP", type: "DBT", time: "3 min" },
                  ].map((task) => (
                    <div key={task.name} className="border border-[#e5edf5] bg-[#fbfdff] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">{task.name}</p>
                          <p className="mt-1 text-[11px] text-[#64748b]">Ejercicio breve reutilizable</p>
                        </div>
                        <span className="bg-[#eef6ff] px-2 py-1 text-[10px] font-medium text-[#1272B7]">
                          {task.type}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748b]">
                        <span>{task.time}</span>
                        <span className="border border-[#dbe6f0] bg-white px-2 py-1">asignable</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="group overflow-hidden border border-[#d7e3ef] bg-white/92 p-5 shadow-[0_22px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_48px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1272B7]">
                      Ficha de paciente
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Panel clínico individual</h3>
                  </div>
                  <span className="border border-[#dbe6f0] bg-white px-2.5 py-1 text-[10px] font-medium text-[#475569]">
                    activo
                  </span>
                </div>

                <div className="mt-4 border border-[#e5edf5] bg-[#fbfdff] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3">
                      <p className="text-[11px] text-[#64748b]">Último check-in</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">Hoy 08:40</p>
                    </div>
                    <div className="bg-white p-3">
                      <p className="text-[11px] text-[#64748b]">Escala</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">1-10</p>
                    </div>
                  </div>

                  <div className="mt-3 bg-white p-3">
                    <p className="text-[11px] text-[#64748b]">Resumen</p>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">
                      Semana más estable, mejor adherencia a tareas y menor activación en días laborables.
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <span className="bg-[#eef6ff] px-2 py-1 text-[10px] font-medium text-[#1272B7]">seguimiento</span>
                    <span className="bg-[#e9fbef] px-2 py-1 text-[10px] font-medium text-[#15803d]">tareas al día</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                Continuidad clínica bien leída
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                Lo importante no es tener más datos, sino saber leerlos mejor.
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {continuityCards.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <article className="group border border-[#dbe6f0] bg-white/92 p-5 shadow-[0_16px_26px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#b6d4e8] hover:shadow-[0_24px_38px_rgba(15,23,42,0.10)]">
                  <div className="h-1.5 w-16 bg-gradient-to-r from-[#1272B7] to-[#72d1f3]" />
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#0f172a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="border border-[#d8e4ef] bg-[linear-gradient(135deg,#ffffff_0%,#f3f9fd_48%,#eef8ff_100%)] px-8 py-10 shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
              <p className="max-w-5xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#0f172a] sm:text-4xl lg:text-[46px]">
                Pensarse no añade más carga a la terapia: hace visible lo que ya importa y lo organiza para decidir mejor.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                Ecosistema del producto
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                Vista viva del producto
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 70}>
                <ProductCard {...card} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                No es un registro aislado
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                Está pensado para mejorar cómo lees el proceso terapéutico, no solo para recoger información.
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4">
            {[
              "Pensado para psicólogos que necesitan criterio clínico entre sesiones, no solo más datos.",
              "Convierte registros, tareas y respuestas en una lectura útil antes de consulta.",
              "Hace más fácil detectar continuidad, adherencia y señales tempranas sin añadir ruido.",
            ].map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <div className="flex gap-4 border border-[#dbe6f0] bg-white/92 p-5 shadow-[0_14px_24px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_34px_rgba(15,23,42,0.08)]">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 bg-[#1272B7]" />
                  <p className="text-base leading-7 text-[#475569]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Respuestas claras</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                Lo esencial, explicado de forma simple
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4">
            {faqItems.map((item, index) => (
              <Reveal key={item.q} delay={index * 70}>
                <details className="group border border-[#dbe6f0] bg-white/92 p-5 shadow-[0_14px_24px_rgba(15,23,42,0.04)] transition duration-300 hover:shadow-[0_20px_32px_rgba(15,23,42,0.08)]">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-[#0f172a]">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Impacto real</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                Preparado para hablar en términos de resultado, no solo de interfaz.
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {impactMetrics.map((item, index) => (
              <Reveal key={item.label} delay={index * 90}>
                <div className="border border-[#d8e4ef] bg-[linear-gradient(180deg,#ffffff_0%,#f3f9fd_100%)] p-6 shadow-[0_18px_32px_rgba(15,23,42,0.06)]">
                  <p className="text-5xl font-semibold tracking-[-0.05em] text-[#0f172a]">{item.value}</p>
                  <p className="mt-3 text-base leading-7 text-[#475569]">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <Reveal>
            <div className="border border-[#d8e4ef] bg-[linear-gradient(180deg,#ffffff_0%,#f4faff_100%)] px-8 py-10 shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
              <div className="max-w-3xl">
                <p className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
                  Una herramienta para trabajar entre sesiones con más criterio, claridad y continuidad.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/demo"
                    className="rounded-xl bg-[#1272B7] px-5 py-3.5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#0f68a8] hover:shadow-[0_18px_28px_rgba(18,114,183,0.26)]"
                  >
                    Solicitar demo
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border border-[#cdd9e6] bg-white px-5 py-3.5 text-sm font-medium text-[#334155] transition duration-200 hover:-translate-y-0.5 hover:border-[#9db6cb] hover:shadow-[0_14px_24px_rgba(15,23,42,0.08)]"
                  >
                    Acceso
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      <FloatingChat />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.7s ease,
            transform 0.7s ease;
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.38;
          animation: drift 12s ease-in-out infinite;
        }

        .hero-blob-a {
          top: -40px;
          left: 6%;
          height: 280px;
          width: 280px;
          background: radial-gradient(circle, rgba(103, 197, 236, 0.55) 0%, rgba(103, 197, 236, 0) 72%);
        }

        .hero-blob-b {
          top: 80px;
          right: 4%;
          height: 360px;
          width: 360px;
          background: radial-gradient(circle, rgba(18, 114, 183, 0.25) 0%, rgba(18, 114, 183, 0) 75%);
          animation-delay: 1.6s;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(18, 114, 183, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 114, 183, 0.05) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 88%);
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(14px, -12px, 0) scale(1.04);
          }
        }
      `}</style>
    </main>
  );
}
