const pacientesDemo = [
  { id: "juan", nombre: "Juan", estado: "😐", ultimo: "Ayer" },
  { id: "maria", nombre: "María", estado: "🙂", ultimo: "Hoy" },
];

export default function PacientesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-sm text-slate-500">
            Lista de pacientes en seguimiento
          </p>
        </div>

        <a href="/panel/pacientes/nuevo">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
            Añadir paciente
          </button>
        </a>
      </div>

      <div className="mt-6 grid gap-4">
        {pacientesDemo.map((p) => (
          <a
            key={p.id}
            href={`/panel/pacientes/${p.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.nombre}</div>
                <div className="text-sm text-slate-500">
                  Último registro: {p.ultimo}
                </div>
              </div>

              <div className="text-xl">{p.estado}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}