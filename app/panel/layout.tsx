import React from "react";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* SIDEBAR */}
          <aside className="rounded-3xl border border-black/5 bg-white/60 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl">
            <div className="mb-8">
              <div className="text-lg font-semibold tracking-tight">
                Pensar<span className="text-slate-500">(SE)</span>
              </div>
              <div className="text-xs text-slate-500">
                Panel del psicólogo
              </div>
            </div>

            <nav className="space-y-3">
              <a
                href="/panel"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-white/70"
              >
                <span>🧭</span>
                <span>Dashboard</span>
              </a>

              <a
                href="/panel/informes"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-white/70"
              >
                <span>📄</span>
                <span>Informes</span>
              </a>

              <a
                href="/panel/pacientes/nuevo"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-white/70"
              >
                <span>➕</span>
                <span>Añadir paciente</span>
              </a>
            </nav>

            <div className="mt-8 border-t border-black/5 pt-4">
              <a
                href="/login"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-white/70"
              >
                <span>↩️</span>
                <span>Volver</span>
              </a>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="rounded-3xl border border-black/5 bg-white/60 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
              <div>
                <div className="text-sm font-semibold">Panel</div>
                <div className="text-xs text-slate-500">
                  Psicólogo · Modo demo
                </div>
              </div>

              <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                Demo
              </span>
            </div>

            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
