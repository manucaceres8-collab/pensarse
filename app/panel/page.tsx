const pacientes = [
  { id: "maria", nombre: "María", ultimo: "Hoy", estado: "🙂" },
  { id: "juan", nombre: "Juan", ultimo: "Ayer", estado: "😔" },
  { id: "carlos", nombre: "Carlos", ultimo: "Hoy", estado: "😐" },
];

const actividad = [
  { nombre: "María", texto: "Completó check-in + nota" },
  { nombre: "Juan", texto: "Realizó registro ABC" },
  { nombre: "Carlos", texto: "Guardó una nota personal" },
];

const informes = [
  { nombre: "María" },
  { nombre: "Juan" },
  { nombre: "Carlos" },
];

export default function PanelPage() {
  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <div className="text-sm text-slate-500">Panel psicólogo</div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* PACIENTES VISTA RÁPIDA */}
      <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pacientes (vista rápida)
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Estado general y último registro.
            </p>
          </div>

          <a
            href="/panel/pacientes"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50"
          >
            Ver todos
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {pacientes.map((p) => (
            <a
              key={p.id}
              href={`/panel/pacientes/${p.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {p.nombre}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Último registro: {p.ultimo}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-2xl shadow-sm">
                  {p.estado}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FILA INFERIOR */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* ACTIVIDAD RECIENTE */}
        <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Actividad reciente
          </h2>

          <div className="mt-5 space-y-3">
            {actividad.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {item.nombre}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {item.texto}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INFORMES */}
        <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Informes</h2>

            <a
              href="/panel/informes"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50"
            >
              Ver informes
            </a>
          </div>

          <div className="mt-5 space-y-3">
            {informes.map((item, i) => (
              <a
                key={i}
                href="/panel/informes"
                className="block rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {item.nombre}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
