const tareas = [
  {
    id: "registro",
    titulo: "Registro diario breve",
    descripcion: "Escribe en 1–2 frases cómo ha ido el día.",
    estado: "Pendiente",
    tiempo: "2 min",
  },
  {
    id: "abc",
    titulo: "Registro ABC",
    descripcion: "Situación, pensamiento, emoción y conducta.",
    estado: "Pendiente",
    tiempo: "5 min",
  },
  {
    id: "reestructuracion",
    titulo: "Reestructuración cognitiva simple",
    descripcion: "Busca un pensamiento alternativo más equilibrado.",
    estado: "Hecha",
    tiempo: "4 min",
  },
];

export default function TareasPage() {
  const pendientes = tareas.filter((t) => t.estado === "Pendiente").length;
  const hechas = tareas.filter((t) => t.estado === "Hecha").length;
  const total = tareas.length;

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tareas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Aquí tienes los ejercicios enviados por tu psicólogo.
        </p>
      </div>

      {/* RESUMEN */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Pendientes</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {pendientes}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            tareas por completar
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Hechas</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {hechas}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            tareas completadas
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {total}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            ejercicios asignados
          </div>
        </div>
      </section>

      {/* LISTA DE TAREAS */}
      <section className="space-y-4">
        {tareas.map((tarea) => (
          <a
            key={tarea.id}
            href={`/mi/tareas/${tarea.id}`}
            className="block rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm hover:bg-slate-50"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {tarea.titulo}
                  </h2>

                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-xs",
                      tarea.estado === "Hecha"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700",
                    ].join(" ")}
                  >
                    {tarea.estado}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {tarea.descripcion}
                </p>

                <div className="mt-3 text-xs text-slate-500">
                  Duración aproximada: {tarea.tiempo}
                </div>
              </div>

              <div className="shrink-0">
                <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
                  Abrir tarea →
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* BLOQUE FINAL */}
      <section className="rounded-3xl border border-black/5 bg-slate-900 p-6 text-white shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
        <h2 className="text-lg font-semibold">
          Consejo
        </h2>
        <p className="mt-2 text-sm text-white/80">
          No hace falta hacer todo de golpe. Completa una tarea pequeña y mantén
          la constancia.
        </p>
      </section>
    </div>
  );
}
