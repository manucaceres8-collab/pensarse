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
              src="/logopensar-sbe.png"
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
{/* BOTONES PRINCIPALES */}
<div className="mt-8 flex flex-wrap gap-4">
  <a href="/login">
    <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm text-white shadow hover:bg-slate-800">
      Entrar
    </button>
  </a>

  <a href="#chatbot">
    <button className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm shadow hover:bg-slate-50">
      Probar chatbot
    </button>
  </a>

  <a href="/panel">
    <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm shadow hover:bg-slate-50">
      Demo psicólogo
    </button>
  </a>

  <a href="/mi">
    <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm shadow hover:bg-slate-50">
      Demo paciente
    </button>
  </a>
</div>
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
{/* CÓMO FUNCIONA */}
<section className="mt-10 rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] backdrop-blur-xl md:p-10">
  <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
    Cómo funciona
  </h2>
  <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
    Pensar(SE) te ayuda a trabajar entre sesiones con micro-registros y ejercicios
    guiados. El psicólogo llega a la sesión con información útil, clara y ordenada.
  </p>

  <div className="mt-8 grid gap-4 md:grid-cols-3">
    <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">Paso 1</div>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        El psicólogo invita al paciente
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Crea un paciente en tu panel y envía el acceso con un clic.
      </p>
    </div>

    <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">Paso 2</div>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        Check-in de 20 segundos
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        El paciente registra cómo se siente (y opcionalmente añade una nota).
      </p>
    </div>

    <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">Paso 3</div>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        Sesión con foco y claridad
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        El psicólogo revisa la evolución y las tareas antes de la sesión.
      </p>
    </div>
  </div>
</section>
{/* CHECK-IN EMOCIONAL */}
<section className="mt-8 rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] backdrop-blur-xl md:p-10">
  <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
    Check-in emocional (20 segundos)
  </h2>

  <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
    Así de simple es registrar cómo te sientes entre sesiones.
  </p>

  {/* EMOCIONES */}
  <div className="mt-6 flex flex-wrap gap-3 text-2xl">
    <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">😄</button>
    <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">🙂</button>
    <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">😐</button>
    <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">😔</button>
    <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">😣</button>
  </div>

  {/* TEXTO OPCIONAL */}
  <div className="mt-6">
    <label className="text-sm text-slate-600">
      ¿Qué ha pasado hoy? (opcional)
    </label>

    <textarea
      className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
      rows={3}
      placeholder="Escribe aquí si quieres añadir algo..."
    />
  </div>

  <div className="mt-6">
    <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-800">
      Guardar check-in
    </button>
  </div>
</section>
{/* BENEFICIOS */}
<section className="mt-8 grid gap-4 md:grid-cols-2">
  <div className="rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] backdrop-blur-xl md:p-10">
    <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
      Para psicólogos
    </h2>
    <ul className="mt-4 space-y-3 text-sm text-slate-600 md:text-base">
      <li>• Llegas a sesión con un resumen del proceso entre sesiones.</li>
      <li>• Menos tiempo “poniéndote al día”, más tiempo interviniendo.</li>
      <li>• Ejercicios y tareas con seguimiento sencillo.</li>
      <li>• Una experiencia clara, sin complejidad innecesaria.</li>
    </ul>
  </div>

  <div className="rounded-3xl border border-black/5 bg-white/55 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] backdrop-blur-xl md:p-10">
    <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
      Para pacientes
    </h2>
    <ul className="mt-4 space-y-3 text-sm text-slate-600 md:text-base">
      <li>• Entiendes tu evolución con registros simples y constantes.</li>
      <li>• Tareas claras para avanzar entre sesiones.</li>
      <li>• Menos olvido: lo importante queda registrado.</li>
      <li>• Proceso terapéutico más continuo y acompañado.</li>
    </ul>
  </div>
</section>

{/* CTA FINAL */}
<section className="mt-8 rounded-3xl border border-black/5 bg-slate-900 p-6 text-white shadow-[0_10px_30px_rgba(2,6,23,0.18)] md:p-10">
  <h2 className="text-xl font-semibold md:text-2xl">
    ¿Quieres verlo en acción?
  </h2>
  <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
    Entra en la demo o prueba el chatbot. (Más adelante el acceso estará protegido con login real.)
  </p>

  <div className="mt-6 flex flex-wrap gap-3">
    <a href="/login">
      <button className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-slate-900 shadow hover:bg-white/90">
        Entrar a la demo
      </button>
    </a>

    <a href="#chatbot">
      <button className="rounded-xl border border-white/25 bg-white/0 px-5 py-2 text-sm font-medium text-white shadow hover:bg-white/10">
        Probar chatbot
      </button>
    </a>
  </div>
</section>
        {/* CHAT ABAJO */}
        <section 
        id="chatbot"
        className="mt-8 rounded-3xl border border-black/5 bg-white/60 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-6">
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

