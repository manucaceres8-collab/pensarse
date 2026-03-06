const informes = [
  {
    nombre: "María López",
    resumen: "Semana estable, check-ins regulares y 2 tareas completadas.",
    fecha: "Actualizado hoy",
  },
  {
    nombre: "Juan Pérez",
    resumen: "Descenso emocional a mitad de semana, una nota relevante registrada.",
    fecha: "Actualizado ayer",
  },
  {
    nombre: "Carlos Gómez",
    resumen: "Mayor variabilidad emocional y 1 tarea pendiente.",
    fecha: "Actualizado ayer",
  },
];

export default function InformesPage() {
  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <div className="text-sm text-slate-500">Panel psicólogo</div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Informes
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Resumen rápido del seguimiento de tus pacientes.
        </p>
      </div>

      {/* TARJETAS DE INFORME */}
      <div className="space-y-4">
        {informes.map((item, i) => (
          <div
            key={i}
            className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {item.nombre}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {item.resumen}
                </p>
              </div>

              <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                {item.fecha}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/panel/pacientes/maria"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs shadow-sm hover:bg-slate-50"
              >
                Ver ficha
              </a>

              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs shadow-sm hover:bg-slate-50">
                Exportar PDF (demo)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}