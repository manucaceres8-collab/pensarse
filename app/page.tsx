import Link from "next/link";
import FloatingChat from "./components/FloatingChat";

const weeklyData = [4, 6, 5, 7, 8];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#edf1f7] px-4 py-6 text-[#0f172a] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6 pb-24">
        <section className="rounded-[30px] border border-[#d7deea] bg-white px-6 py-10 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="max-w-5xl">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                Terapia entre sesiones,
                <span className="block text-[#617896]">simple y útil.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#546a87] sm:text-lg">
                Seguimiento terapéutico entre sesiones para psicólogos y pacientes,
                con una experiencia clara, calmada y facil de usar.
              </p>
            </div>

            <div className="justify-self-start lg:justify-self-end">
              <p className="text-2xl font-semibold leading-none tracking-tight text-[#0f172a] sm:text-3xl">
                Pensar<span className="text-[#62789b]">(SE)</span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/login?rol=paciente"
              className="rounded-2xl bg-[#0f1f3f] px-7 py-3 text-sm font-medium !text-white shadow-[0_8px_18px_rgba(15,31,63,0.28)] transition hover:bg-[#1a2c4f]"
            >
              Paciente
            </Link>
            <Link
              href="/login?rol=psicologo"
              className="rounded-2xl border border-[#d3dbe8] bg-[#f7f9fd] px-7 py-3 text-sm font-medium text-[#334155] transition hover:bg-white"
            >
              Psicologo
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-[26px] border border-[#d7deea] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.045)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#0f172a] sm:text-2xl">Registro diario</h2>
              <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                20s
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <p className="text-sm text-[#607794]">¿Cómo te sientes hoy?</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { emoji: "🙂", active: true },
                  { emoji: "😐", active: false },
                  { emoji: "😔", active: false },
                  { emoji: "😣", active: false },
                ].map((item) => (
                  <div
                    key={item.emoji}
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl border text-base sm:h-11 sm:w-11",
                      item.active
                        ? "border-[#0f1f3f] bg-[#0f1f3f] text-white"
                        : "border-[#d4dcea] bg-white text-[#31445f]",
                    ].join(" ")}
                  >
                    {item.emoji}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-[#d9e1ee] bg-white px-4 py-3 text-sm leading-relaxed text-[#5e738f]">
                Hoy me he sentido mas tranquilo que ayer...
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-[#7b8ea8]">Nota opcional</span>
                <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                  guardado
                </span>
              </div>
            </div>
          </article>

          <article className="rounded-[26px] border border-[#d7deea] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.045)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#0f172a] sm:text-2xl">Tareas terapéuticas</h2>
              <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                3 activas
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              {[
                { title: "Registro ABC", status: "pendiente", tone: "amber" },
                { title: "Reestructuracion cognitiva", status: "hecha", tone: "emerald" },
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

          <article className="rounded-[26px] border border-[#d7deea] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.045)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#0f172a] sm:text-2xl">Informes evolución</h2>
              <span className="shrink-0 rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#5d7595]">
                semanal
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold text-[#0f172a]">Maria</p>
                  <p className="text-sm text-[#607794]">Últimos 5 días</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                  media 6.0
                </span>
              </div>

              <div className="mt-5 flex h-36 items-end justify-between gap-2">
                {weeklyData.map((value, i) => (
                  <div key={`${value}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-8 rounded-t-2xl bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef] shadow-[0_4px_12px_rgba(17,111,177,0.28)] sm:w-9"
                      style={{ height: `${value * 12}px` }}
                    />
                    <span className="text-xs text-[#607794]">{["L", "M", "X", "J", "V"][i]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#607794]">
                <span>Mejor día: Viernes</span>
                <span className="font-semibold text-[#1f304b]">8/10</span>
              </div>
            </div>
          </article>
        </section>
      </div>

      <FloatingChat />
    </main>
  );
}
