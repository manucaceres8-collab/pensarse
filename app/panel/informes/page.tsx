import Link from "next/link";

const informes = [
  {
    nombre: "Maria Lopez",
    resumen: "Semana estable, 2 tareas completadas y mejor descanso.",
    fecha: "Actualizado hoy",
  },
  {
    nombre: "Juan Perez",
    resumen: "Pico de rumiacion nocturna, pero mayor adherencia al registro.",
    fecha: "Actualizado ayer",
  },
  {
    nombre: "Carlos Gomez",
    resumen: "Variabilidad emocional por examenes, requiere seguimiento cercano.",
    fecha: "Actualizado ayer",
  },
];

export default function InformesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Informes</h1>
        <p className="mt-2 text-sm text-slate-600">
          Resumen visual de evolucion para apoyar la preparacion de la siguiente sesion.
        </p>
      </section>

      <section className="space-y-4">
        {informes.map((item) => (
          <article key={item.nombre} className="rounded-3xl border border-[var(--border)] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.nombre}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.resumen}</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                {item.fecha}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/panel/pacientes/maria"
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700"
              >
                Ver ficha
              </Link>
              <button className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-xs text-slate-700">
                Exportar PDF (demo)
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
