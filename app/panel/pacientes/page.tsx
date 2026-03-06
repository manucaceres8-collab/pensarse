const pacientes = [
  {
    id: "maria",
    nombre: "María López",
    estado: "😐",
    ultimo: "Hoy",
    nota: "Día intenso en el trabajo",
    tareas: 2,
  },
  {
    id: "juan",
    nombre: "Juan Pérez",
    estado: "🙂",
    ultimo: "Ayer",
    nota: "Mejor sueño, menos rumiación",
    tareas: 1,
  },
  {
    id: "carlos",
    nombre: "Carlos Gómez",
    estado: "😔",
    ultimo: "Ayer",
    nota: "Preocupación por exámenes",
    tareas: 3,
  },
];

export default function PacientesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Pacientes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lista rápida con estado y último check-in (demo).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/panel/pacientes/nuevo">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow hover:bg-slate-800">
              + Añadir
            </button>
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-300"
          placeholder="Buscar paciente… (demo)"
        />
      </div>

      {/* List */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-2 shadow-sm">
        {pacientes.map((p) => (
          <a
            key={p.id}
            href={`/panel/pacientes/${p.id}`}
            className="block rounded-xl p-4 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left */}
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-black/5 bg-white px-3 py-2 text-lg shadow-sm">
                    {p.estado}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {p.nombre}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-500">
                      Último check-in: {p.ultimo} · Tareas activas: {p.tareas}
                    </div>
                  </div>
                </div>

                <div className="mt-3 truncate text-sm text-slate-600">
                  “{p.nota}”
                </div>
              </div>

              {/* Right */}
              <div className="shrink-0">
                <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
                  Ver ficha →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="text-xs text-slate-500">
        Consejo demo: entra en un paciente para ver evolución semanal, notas y tareas.
      </div>
    </div>
  );
}
