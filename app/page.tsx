import Image from "next/image";
import FloatingChat from "./components/FloatingChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Fondo */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.08),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        {/* BARRA SUPERIOR */}
        <header className="rounded-3xl border border-black/5 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight">
                Pensar<span className="text-slate-500">(SE)</span>
              </div>
            </div>

            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <Image
                src="/logopensar-se.png"
                alt="Pensar(SE)"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-8 rounded-3xl border border-black/5 bg-white/55 p-8 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-12">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Terapia entre sesiones,{" "}
            <span className="text-slate-500">simple y útil.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Seguimiento terapéutico entre sesiones.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/mi">
              <button className="rounded-2xl bg-slate-900 px-6 py-3 text-sm text-white shadow hover:bg-slate-800">
                Paciente
              </button>
            </a>

            <a href="/panel">
              <button className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm shadow-sm hover:bg-slate-50">
                Psicólogo
              </button>
            </a>
          </div>
        </section>

        {/* TRES BLOQUES VISUALES */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {/* REGISTRO DIARIO */}
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Registro diario
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
                20s
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">
                ¿Cómo te sientes hoy?
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xl">
                <span className="rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-white">
                  🙂
                </span>
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  😐
                </span>
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  😔
                </span>
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  😣
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                “Hoy me he sentido más tranquilo que ayer...”
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">Nota opcional</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
                  guardado
                </span>
              </div>
            </div>
          </div>

          {/* TAREAS TERAPÉUTICAS */}
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Tareas terapéuticas
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
                3 activas
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-800">
                    Registro ABC
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
                    pendiente
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-800">
                    Reestructuración cognitiva
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
                    hecha
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-800">
                    Registro diario breve
                  </div>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] text-sky-700">
                    en curso
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INFORMES */}
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Informes evolución
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
                semanal
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    María
                  </div>
                  <div className="text-xs text-slate-500">
                    Últimos 5 días
                  </div>
                </div>

                <span className="rounded-full border border-black/5 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
                  media 6.0
                </span>
              </div>

              <div className="mt-5 flex h-32 items-end justify-between gap-2">
                {[4, 6, 5, 7, 8].map((n, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-24 items-end">
                      <div
                        className="w-8 rounded-t-2xl bg-gradient-to-t from-slate-900 to-sky-400 shadow-sm"
                        style={{ height: `${n * 10}px` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {["L", "M", "X", "J", "V"][i]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Mejor día: Viernes</span>
                <span>8/10</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CHAT FLOTANTE */}
      <FloatingChat />
    </main>
  );
}