import Link from "next/link";

const pacientes = [
  { id: "maria", nombre: "Maria Lopez", ultimo: "Hoy, 08:40", estado: "Estable", tareas: 2 },
  { id: "juan", nombre: "Juan Perez", ultimo: "Ayer, 22:10", estado: "Bajo ánimo", tareas: 1 },
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
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <p className="text-sm text-[#607794]">Panel psicólogo</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0f172a]">Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#607794]">
          Vista de control entre sesiones: estado de pacientes, actividad reciente y accesos rápidos.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Pacientes activos</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">12</p>
          <p className="mt-1 text-xs text-[#6e84a0]">3 con seguimiento hoy</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Check-ins recibidos</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">8</p>
          <p className="mt-1 text-xs text-[#6e84a0]">últimas 24 horas</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Informes por revisar</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">4</p>
          <p className="mt-1 text-xs text-[#6e84a0]">pendientes de esta semana</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f172a]">Pacientes destacados</h2>
            <p className="mt-1 text-sm text-[#607794]">Estado general y último movimiento</p>
          </div>
          <Link
            href="/panel-demo/pacientes"
            className="rounded-full border border-[#d5deea] bg-[#f6f9ff] px-4 py-2 text-xs text-[#607794]"
          >
            Ver pacientes
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {pacientes.map((p) => (
            <Link
              key={p.id}
              href={`/panel-demo/pacientes/${p.id}`}
              className="block rounded-2xl border border-[#d9e1ee] bg-[#f8fbff] p-4 transition hover:bg-[#eef4ff]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1f2d45]">{p.nombre}</p>
                  <p className="mt-1 text-xs text-[#607794]">Último registro: {p.ultimo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                    {p.estado}
                  </span>
                  <span className="rounded-full border border-[#d5deea] bg-white px-3 py-1 text-xs text-[#607794]">
                    {p.tareas} tareas
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Actividad reciente</h2>
          <div className="mt-4 space-y-2">
            {actividad.map((item) => (
              <div key={item} className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#546a87]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#d7deea] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Accesos rapidos</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/panel-demo/pacientes/nuevo" className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]">
              Crear nueva ficha de paciente
            </Link>
            <Link href="/panel-demo/informes" className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]">
              Revisar informes de seguimiento
            </Link>
            <Link href="/demo/paciente" className="rounded-xl border border-[#d9e1ee] bg-[#f8fbff] p-3 text-sm text-[#334155] transition hover:bg-[#eef4ff]">
              Ver experiencia paciente
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
