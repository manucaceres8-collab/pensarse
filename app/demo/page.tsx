import Link from "next/link";

export default function DemoEntryPage() {
  return (
    <main className="min-h-screen bg-[#edf1f7] px-4 py-6 text-[#0f172a] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6 pb-10">
        <section className="rounded-[30px] border border-[#d7deea] bg-white px-6 py-10 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12">
          <p className="text-sm text-[#607794]">Pensar(SE)</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-5xl">Demo completa</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#546a87] sm:text-base">
            Elige cómo quieres explorar la demostración comercial. Este entorno usa solo datos ficticios.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/demo/psicologo"
              className="rounded-2xl border border-[#cfd9e8] bg-[#f7f9fd] p-5 transition hover:bg-white"
            >
              <p className="text-xl font-semibold text-[#1f2d45]">Entrar como psicólogo demo</p>
              <p className="mt-2 text-sm text-[#607794]">
                Panel demo con Sofía Martín, pacientes, tareas e informes ficticios.
              </p>
            </Link>

            <Link
              href="/demo/paciente"
              className="rounded-2xl border border-[#cfd9e8] bg-[#f7f9fd] p-5 transition hover:bg-white"
            >
              <p className="text-xl font-semibold text-[#1f2d45]">Entrar como paciente demo</p>
              <p className="mt-2 text-sm text-[#607794]">
                Espacio demo del paciente con registro diario, tareas, evolución y notas.
              </p>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/" className="text-sm text-[#607794] hover:text-[#1f304b]">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
