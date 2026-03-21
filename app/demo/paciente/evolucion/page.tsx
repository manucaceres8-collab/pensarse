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
      <section className="rounded-[26px] border border-[#d7deea] bg-[#f8fbff] p-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Evolucion</h1>
        <p className="mt-2 text-sm text-[#607794]">Lectura simple y visual de tu registro emocional semanal.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Media semanal</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">6.1</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Mejor dia</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">Sab</p>
        </div>
        <div className="rounded-[22px] border border-[#d7deea] bg-white p-5">
          <p className="text-xs text-[#607794]">Dia mas bajo</p>
          <p className="mt-2 text-4xl font-semibold text-[#0f172a]">Jue</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Grafica semanal</h2>
        <p className="mt-1 text-sm text-[#607794]">Puntuacion de estado emocional (0-10).</p>

        <div className="mt-6 flex h-64 items-end justify-between gap-2">
          {datos.map((item) => (
            <div key={item.dia} className="flex flex-1 flex-col items-center gap-2">
              <div className="text-xs text-[#607794]">{item.valor}</div>
              <div className="flex h-48 items-end">
                <div
                  className="w-9 rounded-t-2xl bg-gradient-to-t from-[#0f1f3f] via-[#116fb1] to-[#22b6ef] shadow-[0_4px_12px_rgba(17,111,177,0.28)]"
                  style={{ height: `${item.valor * 16}px` }}
                />
              </div>
              <div className="text-xs text-[#607794]">{item.dia}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-[#d7deea] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Lectura rapida</h2>
        <ul className="mt-4 space-y-2 text-sm text-[#546a87]">
          <li>- Hay estabilidad general con oscilaciones normales.</li>
          <li>- El jueves aparece una bajada puntual.</li>
          <li>- El fin de semana muestra recuperacion.</li>
        </ul>
      </section>
    </div>
  );
}
