export default function MiPanelPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tu seguimiento
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Aquí verás tu evolución y tus tareas.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Hoy</div>
          <div className="mt-2 text-3xl font-semibold">😐</div>
          <div className="mt-1 text-sm text-slate-600">
            Estado actual (demo)
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Semana</div>
          <div className="mt-2 text-3xl font-semibold">5/10</div>
          <div className="mt-1 text-sm text-slate-600">
            Media emocional (demo)
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Tareas</div>
          <div className="mt-2 text-3xl font-semibold">2</div>
          <div className="mt-1 text-sm text-slate-600">
            pendientes (demo)
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/mi/evolucion">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50">
            Ver evolución
          </button>
        </a>

        <a href="/mi/tareas">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow hover:bg-slate-800">
            Ver tareas
          </button>
        </a>
      </div>
    </div>
  );
}