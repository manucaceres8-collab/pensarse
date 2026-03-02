import Image from "next/image";
import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Fondo claro premium */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Gradientes suaves */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.14),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.10),transparent_55%)]" />
        {/* Grano sutil */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]"></div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/55 p-8 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-12">
          {/* Marca de agua con tu logo (no pegatina) */}
          <div className="pointer-events-none absolute -right-10 -top-8 opacity-[0.10] blur-[0.2px]">
            <Image
              src="/logopensar-se.png"
              alt="Pensar(SE)"
              width={520}
              height={520}
              priority
            />
          </div>

          {/* Logo pequeño integrado (opcional) */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
              <Image
                src="/logopensar-se.png"
                alt="Pensar(SE)"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-600">
              Pensar(SE)
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Pensar<span className="text-slate-500">(SE)</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Entrenamiento psicológico basado en evidencia. Un enfoque claro, práctico y
            con estructura — sin ruido.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
              Calma + estructura
            </span>
            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
              Micro-ejercicios
            </span>
            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm">
              Seguimiento
            </span>
          </div>
        </section>

        {/* CHAT ABAJO */}
        <section className="mt-8 rounded-3xl border border-black/5 bg-white/60 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Asistente Pensar(SE)
              </h2>
              <p className="text-sm text-slate-500">
                Responde con calma y estructura. Elige un modo y empieza.
              </p>
            </div>
          </div>

          <ChatWidget />
        </section>
      </div>
    </main>
  );
}

