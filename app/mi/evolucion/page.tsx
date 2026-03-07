export default function EvolucionPage() {
  const datos = [
    { dia: "Lun", valor: 6 },
    { dia: "Mar", valor: 5 },
    { dia: "Mie", valor: 7 },
    { dia: "Jue", valor: 4 },
    { dia: "Vie", valor: 6 },
    { dia: "Sab", valor: 8 },
    { dia: "Dom", valor: 7 },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Evolucion</h1>
        <p className="mt-2 text-sm text-slate-600">Lectura simple de tu registro diario de la ultima semana.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Media semanal</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">6.1</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Mejor dia</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">Sab</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-xs text-slate-500">Dia mas bajo</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">Jue</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Grafica semanal</h2>
        <p className="mt-1 text-sm text-slate-500">Puntuacion de estado emocional (0-10).</p>

        <div className="mt-6 flex h-64 items-end justify-between gap-2">
          {datos.map((item) => (
            <div key={item.dia} className="flex flex-1 flex-col items-center gap-2">
              <div className="text-xs text-slate-500">{item.valor}</div>
              <div className="flex h-48 items-end">
                <div className="w-9 rounded-t-xl bg-blue-600" style={{ height: `${item.valor * 16}px` }} />
              </div>
              <div className="text-xs text-slate-600">{item.dia}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Lectura rapida</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>- Hay estabilidad general con oscilaciones normales.</li>
          <li>- El jueves aparece una bajada puntual.</li>
          <li>- El fin de semana muestra recuperacion.</li>
        </ul>
      </section>
    </div>
  );
}
