import Image from "next/image";
import Link from "next/link";
import ProfileAvatar from "./components/ProfileAvatar";
import FloatingChat from "./components/FloatingChat";

const metricas = [
  { label: "Check-in diario", value: "20 s" },
  { label: "Tareas guiadas", value: "3-5 min" },
  { label: "Informe semanal", value: "Listo para sesion" },
];

const perfilesPaciente = [
  { nombre: "Maria Lopez", src: "/profiles/paciente-1.jpg" },
  { nombre: "Laura M.", src: "/profiles/paciente-2.jpg" },
  { nombre: "Andres R.", src: "/profiles/paciente-3.jpg" },
];

const perfilesPsicologo = [
  { nombre: "Dra. Sofia Martin", src: "/profiles/psicologo-1.jpg" },
  { nombre: "Dr. Daniel Ruiz", src: "/profiles/psicologo-2.jpg" },
  { nombre: "Dra. Elena Solis", src: "/profiles/psicologo-3.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f8ff] text-[#0f172a]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(79,127,191,0.10),transparent_42%),radial-gradient(circle_at_88%_12%,rgba(147,197,253,0.10),transparent_40%),radial-gradient(circle_at_50%_92%,rgba(79,127,191,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <header className="rounded-3xl border border-[#dbeafe] bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-1">
                <Image src="/logo-pensarse-sinergia.svg" alt="Logo Pensar(SE)" fill className="object-contain" priority />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">
                  Pensar<span className="text-[#4f7fbf]">(SE)</span>
                </p>
                <p className="text-sm text-[#64748b]">Terapia entre sesiones, simple y util</p>
              </div>
            </div>
            <span className="rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs text-[#4f7fbf]">Demo</span>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-[#dbeafe] bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a] md:text-5xl">
                Continuidad terapeutica para psicologos y pacientes,
                <span className="text-[#4f7fbf]"> sin complejidad.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#64748b] md:text-lg">
                Pensar(SE) organiza el trabajo entre sesiones con un flujo claro: el paciente registra, el psicologo revisa y ambos llegan mejor preparados a la sesion.
              </p>
            </div>

            <div className="grid gap-3">
              {metricas.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#e6efff] bg-[#f8fbff] px-4 py-3">
                  <p className="text-xs text-[#64748b]">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-[#0f172a]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?rol=psicologo" className="rounded-2xl bg-[#4f7fbf] px-6 py-3 text-sm font-medium text-white shadow hover:bg-[#3e6ea8]">
              Entrar como psicologo
            </Link>
            <Link href="/login?rol=paciente" className="rounded-2xl border border-[#dbeafe] bg-[#eff6ff] px-6 py-3 text-sm font-medium text-[#4f7fbf] shadow-sm hover:bg-[#e0edff]">
              Entrar como paciente
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-[#dbeafe] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0f172a]">Vista del psicologo</h2>
              <span className="rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs text-[#4f7fbf]">Panel clinico</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[#64748b]">
              <li>- Seguimiento por paciente con tareas y notas.</li>
              <li>- Lectura rapida de evolucion semanal.</li>
              <li>- Informes listos para preparar sesion.</li>
            </ul>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {perfilesPsicologo.map((item) => (
                <div key={item.nombre} className="rounded-2xl border border-[#e6efff] bg-[#f8fbff] p-3 text-center">
                  <ProfileAvatar
                    src={item.src}
                    fallbackSrc="/paciente-maria.svg"
                    alt={item.nombre}
                    className="mx-auto h-12 w-12 rounded-full border border-blue-100 object-cover"
                  />
                  <p className="mt-2 text-[11px] font-medium text-[#334155]">{item.nombre}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#dbeafe] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0f172a]">Vista del paciente</h2>
              <span className="rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs text-[#4f7fbf]">Mi espacio</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[#64748b]">
              <li>- Check-in diario en menos de un minuto.</li>
              <li>- Tareas terapeuticas con pasos simples.</li>
              <li>- Evolucion visual para autoconsciencia.</li>
            </ul>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {perfilesPaciente.map((item) => (
                <div key={item.nombre} className="rounded-2xl border border-[#e6efff] bg-[#f8fbff] p-3 text-center">
                  <ProfileAvatar
                    src={item.src}
                    fallbackSrc="/paciente-maria.svg"
                    alt={item.nombre}
                    className="mx-auto h-12 w-12 rounded-full border border-blue-100 object-cover"
                  />
                  <p className="mt-2 text-[11px] font-medium text-[#334155]">{item.nombre}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-3xl border border-[#dbeafe] bg-white p-5 text-xs text-[#64748b] shadow-sm">
          Para usar tus fotos: guarda los archivos en `public/profiles/` con estos nombres:
          `paciente-1.jpg`, `paciente-2.jpg`, `paciente-3.jpg`, `psicologo-1.jpg`, `psicologo-2.jpg`, `psicologo-3.jpg`.
        </section>
      </div>

      <FloatingChat />
    </main>
  );
}
