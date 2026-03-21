import Link from "next/link";

const informes = [
  {
    id: "maria",
    nombre: "Maria Lopez",
    resumen: "Semana estable, 2 tareas completadas y mejor descanso.",
    fecha: "Actualizado hoy",
    media: 6.0,
  },
  {
    id: "juan",
    nombre: "Juan Perez",
    resumen: "Pico de rumiacion nocturna, pero mayor adherencia al registro.",
    fecha: "Actualizado ayer",
    media: 5.4,
  },
  {
    id: "carlos",
    nombre: "Carlos Gomez",
    resumen: "Variabilidad emocional por examenes, requiere seguimiento cercano.",
    fecha: "Actualizado ayer",
    media: 5.8,
  },
];

const bars = [4, 6, 5, 7, 8];

export default function InformesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Informes</h1>
        <p className="mt-2 text-sm text-[#607794]">
          Resumen de evolución para preparar mejor la siguiente sesión.
        </p>
      </section>

      <section className="space-y-4">
        {informes.map((item) => (
          <article key={item.id} className="rounded-[26px] border border-[#d7deea] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#1f2d45]">{item.nombre}</h2>
                <p className="mt-2 text-sm text-[#546a87]">{item.resumen}</p>
              </div>
              <span className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-3 py-1 text-xs text-[#607794]">
                {item.fecha}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4">
              <div className="flex items-center justify-between text-xs text-[#607794]">
                <span>Últimos 5 días</span>
                <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1">media {item.media}</span>
              </div>

              <div className="mt-4 flex h-28 items-end justify-between gap-2">
                {bars.map((value, i) => (
                  <div key={`${item.id}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-7 rounded-t-2xl bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef] shadow-[0_4px_12px_rgba(17,111,177,0.28)] sm:w-8"
                      style={{ height: `${value * 9}px` }}
                    />
                    <span className="text-[10px] text-[#607794]">{["L", "M", "X", "J", "V"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/panel-demo/pacientes/${item.id}`}
                className="rounded-xl border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-xs text-[#607794]"
              >
                Ver ficha
              </Link>
              <button className="rounded-xl border border-[#d5deea] bg-white px-4 py-2 text-xs text-[#607794]">
                Exportar PDF (demo)
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
