export default function PacienteDetalle() {
  const emociones = ["😔", "😐", "🙂"];

  const dias = [
    { d: "Lunes", e: "😔" },
    { d: "Martes", e: "😐" },
    { d: "Miércoles", e: "🙂" },
    { d: "Jueves", e: "🙂" },
    { d: "Viernes", e: "😄" },
  ];

  const notas = [
    "Día intenso en el trabajo",
    "Mejor sueño esta semana",
    "Más claridad con la toma de decisiones",
  ];

  const tareas = [
    {
      titulo: "Respiración 2 minutos",
      descripcion: "Antes de dormir, respiración lenta 2 min.",
      estado: "Pendiente",
      fecha: "Hoy",
    },
    {
      titulo: "Registro de pensamientos",
      descripcion: "Anota pensamiento automático + emoción + alternativa.",
      estado: "Completada",
      fecha: "Ayer",
    },
    {
      titulo: "Exposición gradual",
      descripcion: "Dar el primer paso pequeño hacia la situación evitada.",
      estado: "Pendiente",
      fecha: "Esta semana",
    },
  ];

  const badge = (estado: string) =>
    estado === "Completada"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">María López</h1>
          <p className="text-sm text-slate-500">Seguimiento del paciente</p>
        </div>

        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow hover:bg-slate-800">
          + Asignar tarea (demo)
        </button>
      </div>

      {/* EMOCIONES */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">
          Estado emocional reciente
        </h2>

        <div className="mt-4 flex gap-3 text-2xl">
          {emociones.map((e, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2"
            >
              {e}
            </div>
          ))}
        </div>
      </div>

      {/* EVOLUCIÓN */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">
          Evolución emocional (últimos días)
        </h2>

        <div className="mt-6 space-y-4">
          {dias.map((dia, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-slate-500">{dia.d}</span>

              <div className="flex items-center gap-3">
                <div className="h-2 w-40 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{
                      width: `${20 + i * 15}%`,
                    }}
                  />
                </div>

                <span className="text-lg">{dia.e}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TAREAS */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Tareas terapéuticas
          </h2>
          <span className="text-xs text-slate-500">Asignadas (demo)</span>
        </div>

        <div className="mt-4 space-y-3">
          {tareas.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t.titulo}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {t.descripcion}
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Fecha: {t.fecha}
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badge(
                    t.estado
                  )}`}
                >
                  {t.estado}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50">
                  Marcar como completada (demo)
                </button>

                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-slate-50">
                  Ver detalle (demo)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NOTAS */}
      <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Notas recientes</h2>

        <div className="mt-4 space-y-3">
          {notas.map((n, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
