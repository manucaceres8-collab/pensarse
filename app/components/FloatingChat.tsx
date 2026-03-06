"use client";

import { useEffect, useState } from "react";
import ChatWidget from "./ChatWidget";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Ventana compacta */}
      {open && (
        <div className="mb-3 w-[320px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_45px_rgba(2,6,23,0.22)]">
          <div className="flex items-center justify-between border-b border-black/5 bg-white/80 px-3 py-2 backdrop-blur">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                Asistente Pensar(SE)
              </div>
              <div className="truncate text-[11px] text-slate-500">
                Complemento opcional (demo)
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>

          {/* Altura limitada: no tapa la página */}
          <div className="max-h-[420px] overflow-auto p-2">
            <ChatWidget />
          </div>
        </div>
      )}

      {/* Botón flotante más grande */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm text-white shadow-[0_12px_30px_rgba(2,6,23,0.25)] hover:bg-slate-800"
      >
        <span className="text-lg">💬</span>
        {open ? "Cerrar chat" : "Abrir chat"}
      </button>
    </div>
  );
}
