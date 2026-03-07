import Link from "next/link";

const pacientes = [
  { id: "maria", nombre: "Maria Lopez", ultimo: "Hoy, 08:40", estado: "Estable", tareas: 2 },
  { id: "juan", nombre: "Juan Perez", ultimo: "Ayer, 22:10", estado: "Bajo animo", tareas: 1 },
  { id: "carlos", nombre: "Carlos Gomez", ultimo: "Hoy, 10:15", estado: "Variable", tareas: 3 },
];

const actividad = [
  "Maria completo check-in y una tarea breve.",
  "Juan registro pensamiento automatico en ABC.",
  "Carlos agrego nota personal sobre estres.",
];

export default function PanelPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <p className="text-sm text-slate-500">Panel psicologo</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Vista rapida para seguimiento terapeutico entre sesiones. Todo en modo demo, sin base de datos real.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Pacientes activos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">12</p>
          <p className="mt-1 text-xs text-slate-500">3 con seguimiento hoy</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Check-ins recibidos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">8</p>
          <p className="mt-1 text-xs text-slate-500">ultimas 24 horas</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Informes para revisar</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">4</p>
          <p className="mt-1 text-xs text-slate-500">pendientes de esta semana</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Pacientes destacados</h2>
            <p className="mt-1 text-sm text-slate-500">Estado general y ultimo movimiento</p>
          </div>
          <Link
            href="/panel/pacientes"
            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
          >
            Ver pacientes
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {pacientes.map((p) => (
            <Link
              key={p.id}
              href={`/panel/pacientes/${p.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 transition hover:bg-blue-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.nombre}</p>
                  <p className="mt-1 text-xs text-slate-500">Ultimo registro: {p.ultimo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {p.estado}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {p.tareas} tareas
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Actividad reciente</h2>
          <div className="mt-4 space-y-2">
            {actividad.map((item) => (
              <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Accesos rapidos</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/panel/pacientes/nuevo" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-slate-700 transition hover:bg-blue-50">
              Crear nueva ficha de paciente
            </Link>
            <Link href="/panel/informes" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-slate-700 transition hover:bg-blue-50">
              Revisar informes de seguimiento
            </Link>
            <Link href="/mi" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-slate-700 transition hover:bg-blue-50">
              Ver experiencia paciente
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
