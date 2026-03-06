"use client";

export default function EvolucionPage() {
  const datos = [
    { dia: "Lun", valor: 6 },
    { dia: "Mar", valor: 5 },
    { dia: "Mié", valor: 7 },
    { dia: "Jue", valor: 4 },
    { dia: "Vie", valor: 6 },
    { dia: "Sáb", valor: 8 },
    { dia: "Dom", valor: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Evolución</h1>
        <p className="text-sm text-slate-500">
          Seguimiento de tu registro diario.
        </p>
      </div>

      {/* RESUMEN */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Media semanal
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">6.1</div>
          <div className="mt-1 text-sm text-slate-600">sobre 10</div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Mejor día
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">Sáb</div>
          <div className="mt-1 text-sm text-slate-600">8/10</div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            Peor día
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">Jue</div>
          <div className="mt-1 text-sm text-slate-600">4/10</div>
        </div>
      </section>

      {/* GRÁFICA */}
      <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Gráfica semanal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Estado emocional de los últimos 7 días.
            </p>
          </div>

          <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
            demo
          </span>
        </div>

        <div className="mt-8">
          <div className="flex h-72 items-end justify-between gap-3">
            {datos.map((item) => (
              <div
                key={item.dia}
                className="flex flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="text-xs text-slate-500">{item.valor}</div>

                <div className="flex h-56 items-end">
                  <div
                    className="w-10 rounded-t-2xl bg-slate-900 shadow"
                    style={{ height: `${item.valor * 18}px` }}
                  />
                </div>

                <div className="text-sm font-medium text-slate-600">
                  {item.dia}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERPRETACIÓN */}
      <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Lectura rápida
        </h2>

        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Has tenido una semana bastante estable.</li>
          <li>• El jueves aparece un descenso en el estado emocional.</li>
          <li>• El fin de semana se observa una recuperación.</li>
        </ul>
      </section>
    </div>
  );
}