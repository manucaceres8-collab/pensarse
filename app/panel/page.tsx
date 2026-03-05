export default function PanelPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acceso rápido a pacientes y acciones principales.
          </p>
        </div>

        <div className="flex gap-2">
          <a href="/panel/pacientes">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50">
              Ver pacientes
            </button>
          </a>
          <a href="/panel/pacientes/nuevo">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow hover:bg-slate-800">
              Añadir paciente
            </button>
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Hoy</div>
          <div className="mt-2 text-3xl font-semibold">3</div>
          <div className="mt-1 text-sm text-slate-600">
            check-ins recibidos (demo)
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Semana</div>
          <div className="mt-2 text-3xl font-semibold">12</div>
          <div className="mt-1 text-sm text-slate-600">
            tareas completadas (demo)
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Pacientes</div>
          <div className="mt-2 text-3xl font-semibold">2</div>
          <div className="mt-1 text-sm text-slate-600">
            activos en seguimiento (demo)
          </div>
        </div>
      </div>
    </div>
  );
}