import Link from "next/link";
import FloatingChat from "./components/FloatingChat";

const weeklyData = [4, 6, 5, 7, 8];

const roleCards = [
  {
    title: "Psicólogo",
    text: "Deja de depender de lo que el paciente recuerda en sesión. Ve lo que pasa realmente entre sesiones.",
  },
  {
    title: "Paciente",
    text: "Registra cómo te sientes en menos de 30 segundos, sin esfuerzo ni apps complicadas.",
  },
  {
    title: "Seguimiento",
    text: "Visualiza patrones reales y llega a sesión con información útil, no con recuerdos vagos.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#edf1f7] px-4 py-6 text-[#0f172a] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6 pb-24">
        <section className="rounded-[30px] border border-[#d7deea] bg-white px-6 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:px-10 sm:py-14">
          <div className="max-w-4xl">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight text-[#0f172a] sm:text-5xl">
              Haz que lo que pasa entre sesiones también sea terapia
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#546a87] sm:text-lg">
              Registro diario, tareas y seguimiento real para psicólogos y pacientes.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-2xl bg-[#061a38] px-6 py-3 text-sm font-medium !text-white shadow-[0_14px_28px_rgba(6,26,56,0.34)] transition duration-200 hover:scale-105 hover:bg-[#0c2853] hover:shadow-[0_20px_34px_rgba(6,26,56,0.4)]"
              >
                Acceso psicólogo
              </Link>
              <Link
                href="/acceso-paciente"
                className="rounded-2xl border border-[#c7d3e5] bg-[#f7f9fd] px-6 py-3 text-sm font-medium text-[#334155] shadow-[0_8px_16px_rgba(15,23,42,0.04)] transition duration-200 hover:scale-105 hover:bg-white hover:shadow-[0_14px_24px_rgba(15,23,42,0.08)]"
              >
                Acceso paciente
              </Link>
              <Link
                href="/demo"
                className="px-1 py-3 text-sm font-medium text-[#425b7d] transition hover:text-[#1f304b]"
              >
                Ver demo →
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-[30px] bg-[#f3f6fa] px-2 py-2 sm:px-3">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Diseñado para el trabajo real en terapia</h2>
            <p className="mt-1 text-sm text-[#607794]">
              Pensado para sostener continuidad terapéutica con menos fricción y más contexto útil.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {roleCards.map((item) => (
              <article
                key={item.title}
                className={[
                  "rounded-[22px] border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.09)]",
                  item.title === "Paciente"
                    ? "border-[#cfd9e8] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.07)]"
                    : "border-[#d7deea] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]",
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-4 h-1.5 w-14 rounded-full",
                    item.title === "Psicólogo" && "bg-[#0c2853]",
                    item.title === "Paciente" && "bg-[#1f7ae0]",
                    item.title === "Seguimiento" && "bg-[#0ea5b7]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <div
                  className={[
                    "mb-3 inline-flex rounded-full px-3 py-1 text-[11px] font-medium",
                    item.title === "Psicólogo" && "bg-[#eef3fb] text-[#27466f]",
                    item.title === "Paciente" && "bg-[#eef6ff] text-[#1b5fb8]",
                    item.title === "Seguimiento" && "bg-[#edf9fb] text-[#0f6f7c]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed text-[#546a87]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-[30px] bg-white px-2 py-2 sm:px-3">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Preview del producto</h2>
            <p className="mt-1 text-sm text-[#607794]">Vista rápida de la experiencia de seguimiento en Pensar(SE).</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[24px] border border-[#d7deea] bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#0f172a]">Registro diario</h3>
                <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                  20s
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-[#607794]">¿Cómo te sientes hoy?</p>
                  <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                    20s
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { emoji: "😣", active: false },
                    { emoji: "😔", active: false },
                    { emoji: "😐", active: false },
                    { emoji: "🙂", active: true },
                  ].map((item) => (
                    <div
                      key={item.emoji}
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-xl border text-base",
                        item.active
                          ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                          : "border-[#d4dcea] bg-white text-[#31445f]",
                      ].join(" ")}
                    >
                      {item.emoji}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-white px-4 py-3 text-sm text-[#5c6f89]">
                  Hoy me he sentido más tranquila y con mejor energía.
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-400 bg-emerald-200 px-4 py-3 shadow-[0_12px_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-emerald-950">Check-in completado</p>
                      <p className="mt-1 text-xs text-emerald-900">
                        Guardado y compartido con tu psicólogo.
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-400 bg-white px-3 py-1 text-xs text-emerald-900">
                      completado
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#d7deea] bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#0f172a]">Tareas terapéuticas</h3>
                <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                  3 activas
                </span>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                {[
                  { title: "Registro ABC", status: "pendiente", tone: "amber" },
                  { title: "Reestructuración cognitiva", status: "hecha", tone: "emerald" },
                  { title: "Registro diario breve", status: "en curso", tone: "sky" },
                ].map((task) => (
                  <div
                    key={task.title}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#d2dbe9] bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium text-[#1f2d45]">{task.title}</span>
                    <span
                      className={[
                        "shrink-0 rounded-full border px-3 py-1 text-xs",
                        task.tone === "amber" && "border-amber-200 bg-amber-50 text-amber-700",
                        task.tone === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                        task.tone === "sky" && "border-sky-200 bg-sky-50 text-sky-700",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[24px] border border-[#d7deea] bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#0f172a]">Informes evolución</h3>
                <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                  semanal
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-[#0f172a]">María</p>
                    <p className="text-sm text-[#607794]">Últimos 5 días</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                    media 6.0
                  </span>
                </div>

                <div className="mt-5 flex h-32 items-end justify-between gap-2">
                  {weeklyData.map((value, i) => (
                    <div key={`${value}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-8 rounded-t-2xl bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef] shadow-[0_4px_12px_rgba(17,111,177,0.22)]"
                        style={{ height: `${value * 10}px` }}
                      />
                      <span className="text-xs text-[#607794]">{["L", "M", "X", "J", "V"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <FloatingChat />
    </main>
  );
}
