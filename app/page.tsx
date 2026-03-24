import Link from "next/link";
import FloatingChat from "./components/FloatingChat";

const trendBars = [48, 64, 58, 74, 81, 76, 88];

const benefits = [
  "Detecta patrones emocionales y de adherencia antes de la sesión.",
  "Reduce la dependencia de recuerdos vagos o incompletos.",
  "Asigna tareas breves y revisa respuestas sin fricción.",
  "Llega a consulta con contexto clínico reciente y accionable.",
];

const steps = [
  {
    title: "Check-in diario",
    text: "El paciente registra estado y nota breve en menos de 30 segundos.",
  },
  {
    title: "Tareas entre sesiones",
    text: "Recibe ejercicios breves y los completa desde una interfaz simple.",
  },
  {
    title: "Informe clínico",
    text: "El psicólogo ve evolución, adherencia y señales útiles antes de sesión.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#e5e7eb] pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">
              Pensar(SE)
            </p>
            <p className="mt-1 text-sm text-[#64748b]">Seguimiento terapéutico entre sesiones</p>
          </div>

          <Link
            href="/login"
            className="rounded-lg border border-[#d6dce5] px-4 py-2 text-sm font-medium text-[#334155] transition duration-200 hover:-translate-y-0.5 hover:border-[#c4ceda] hover:shadow-[0_10px_18px_rgba(15,23,42,0.06)]"
          >
            Acceder
          </Link>
        </header>

        <section className="grid gap-14 border-b border-[#e5e7eb] py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">
              SaaS para psicólogos
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#0f172a] sm:text-5xl lg:text-6xl">
              Convierte lo que pasa entre sesiones en datos clínicos útiles
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#475569] sm:text-lg">
              Registro diario, tareas terapéuticas e informes claros para entender mejor la evolución real del
              paciente entre una sesión y la siguiente.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:scale-[1.03] hover:bg-[#111f3a] hover:shadow-[0_16px_30px_rgba(15,23,42,0.18)]"
              >
                Empezar como psicólogo
              </Link>
              <Link
                href="#como-funciona"
                className="rounded-lg border border-[#d7dde6] px-5 py-3 text-sm font-medium text-[#334155] transition duration-200 hover:scale-[1.03] hover:border-[#c8d0dc] hover:bg-[#f8fafc] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              >
                Ver cómo funciona
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="border-l border-[#dbe2ea] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">20s</p>
                <p className="mt-1 text-sm text-[#64748b]">para registrar un check-in diario</p>
              </div>
              <div className="border-l border-[#dbe2ea] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">1 vista</p>
                <p className="mt-1 text-sm text-[#64748b]">para revisar evolución y tareas</p>
              </div>
              <div className="border-l border-[#dbe2ea] pl-4">
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">+ contexto</p>
                <p className="mt-1 text-sm text-[#64748b]">antes de cada sesión clínica</p>
              </div>
            </div>
          </div>

          <div className="border border-[#e5e7eb] bg-[#fbfcfe] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3 border-b border-[#e7ecf2] pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Informe semanal
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Lucía Martín</h2>
                <p className="mt-1 text-sm text-[#64748b]">Últimos 7 días · actualización hoy</p>
              </div>
              <span className="border border-[#dbe3ed] bg-white px-3 py-1 text-xs font-medium text-[#475569]">
                progreso 78%
              </span>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                  <span>Adherencia reciente</span>
                  <span className="text-[#0f172a]">5/7 registros · 2/3 tareas</span>
                </div>
                <div className="mt-2 h-2.5 bg-[#e6edf5]">
                  <div className="h-full w-[78%] bg-gradient-to-r from-[#0f172a] via-[#136fb0] to-[#2cb9e7]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-[#e5e7eb] bg-white p-4">
                  <p className="text-xs text-[#64748b]">Media emocional</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">6.8/10</p>
                </div>
                <div className="border border-[#e5e7eb] bg-white p-4">
                  <p className="text-xs text-[#64748b]">Tareas completadas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">2</p>
                </div>
                <div className="border border-[#e5e7eb] bg-white p-4">
                  <p className="text-xs text-[#64748b]">Tendencia</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">Estable</p>
                </div>
              </div>

              <div className="border border-[#e5e7eb] bg-white p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">Evolución diaria</p>
                    <p className="mt-1 text-xs text-[#64748b]">Estado autorreportado y constancia del seguimiento</p>
                  </div>
                  <span className="text-xs text-[#64748b]">últimos 7 días</span>
                </div>

                <div className="mt-5 flex h-36 items-end justify-between gap-2">
                  {trendBars.map((value, index) => (
                    <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full max-w-[32px] bg-gradient-to-t from-[#0f172a] via-[#136fb0] to-[#31b8e6]"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-[10px] text-[#64748b]">
                        {["L", "M", "X", "J", "V", "S", "D"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#dce8e1] bg-[#f3fbf6] p-5">
                <p className="text-sm font-semibold text-[#0f5132]">Resumen clínico</p>
                <p className="mt-2 text-sm leading-6 text-[#35594a]">
                  Buena adherencia al seguimiento esta semana. Menor activación ansiosa a mitad de semana y mejor
                  constancia en tareas. Conviene revisar desencadenantes del lunes y reforzar la tarea de registro ABC.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e5e7eb] py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">El problema</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Entre sesiones suele faltar información útil
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#475569]">
              Muchos procesos terapéuticos dependen de lo que el paciente recuerda al llegar a consulta. Eso deja fuera
              patrones diarios, adherencia real y señales tempranas que sí importan clínicamente.
            </p>
          </div>
        </section>

        <section id="como-funciona" className="border-b border-[#e5e7eb] py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">
                Cómo funciona
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Un flujo simple para sostener trabajo terapéutico entre sesiones
              </h2>
            </div>

            <div className="grid flex-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="border border-[#e5e7eb] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Paso {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[#0f172a]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e5e7eb] py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">Beneficios</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Diseñado para aportar claridad clínica, no ruido
              </h2>
            </div>

            <div className="grid gap-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-4 border-t border-[#e8edf3] py-4">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 bg-[#0f172a]" />
                  <p className="text-base leading-7 text-[#475569]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">Empieza ahora</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Haz seguimiento real de tus pacientes entre sesiones
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#475569]">
              Si quieres llegar a consulta con contexto útil y no solo con recuerdos dispersos, Pensar(SE) te da una
              estructura simple para verlo con claridad.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:scale-[1.03] hover:bg-[#111f3a] hover:shadow-[0_16px_30px_rgba(15,23,42,0.18)]"
              >
                Empezar como psicólogo
              </Link>
              <Link
                href="/panel/informes"
                className="rounded-lg border border-[#d7dde6] px-5 py-3 text-sm font-medium text-[#334155] transition duration-200 hover:scale-[1.03] hover:border-[#c8d0dc] hover:bg-[#f8fafc] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              >
                Ver ejemplo de informe
              </Link>
            </div>
          </div>
        </section>
      </div>

      <FloatingChat />
    </main>
  );
}
