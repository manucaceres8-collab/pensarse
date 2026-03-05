export default function MiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* SIDEBAR */}
          <aside className="rounded-3xl border border-black/5 bg-white/60 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl">
            <div className="mb-6">
              <div className="text-lg font-semibold tracking-tight">Pensarse</div>
              <div className="text-xs text-slate-500">Panel del paciente</div>
            </div>

            <nav className="space-y-2">
              <a
                href="/mi"
                className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70"
              >
                🏠 Inicio
              </a>

              <a
                href="/mi/evolucion"
                className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70"
              >
                📈 Evolución
              </a>

              <a
                href="/mi/tareas"
                className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70"
              >
                ✅ Tareas
              </a>

              <div className="mt-4 border-t border-black/5 pt-4">
                <a
                  href="/login"
                  className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70"
                >
                  ↩️ Volver a login
                </a>
              </div>
            </nav>
          </aside>

          {/* CONTENT */}
          <div className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}