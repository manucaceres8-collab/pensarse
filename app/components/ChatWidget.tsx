"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "free" | "guided" | "plan7";
type Role = "user" | "assistant";

type ChatMsg = {
  role: Role;
  content: string;
};

type GuidedState = {
  step: number; // 0..7
  answers: Record<string, string>;
};

const MODE_LABEL: Record<Mode, string> = {
  free: "Free",
  guided: "Guided",
  plan7: "Plan 7 días",
};

const MODE_DESC: Record<Mode, string> = {
  free: "Conversación libre.",
  guided: "Evaluación guiada en 6–8 preguntas.",
  plan7: "Plan estructurado de 7 días.",
};

export default function ChatWidget() {
  const [mode, setMode] = useState<Mode>("free");

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hola 👋 Soy el asistente de Pensar(SE). Elige un modo y dime qué quieres trabajar.",
    },
  ]);

  // ✅ estado para modo guided
  const [guided, setGuided] = useState<GuidedState>({
    step: 0,
    answers: {},
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  // Si cambias de modo, no mezcles conversaciones
  function changeMode(m: Mode) {
    setMode(m);
    setInput("");
    setLoading(false);

    // resetea guided al cambiar modo
    setGuided({ step: 0, answers: {} });

    setMessages([
      {
        role: "assistant",
        content:
          m === "guided"
            ? "Modo Guided activado. Cuéntame qué te gustaría conseguir con esto (una frase)."
            : "Hola 👋 Soy el asistente de Pensar(SE). Dime qué quieres trabajar.",
      },
    ]);
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;

    const userMsg: ChatMsg = { role: "user", content: clean };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload =
        mode === "guided"
          ? {
              message: clean,
              mode,
              guided, // ✅ enviamos step + answers al backend
            }
          : {
              message: clean,
              mode,
            };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ✅ si guided devuelve estado, lo guardamos para la siguiente pregunta
      if (mode === "guided" && data?.guided) {
        setGuided({
          step: Number(data.guided.step ?? 0),
          answers: (data.guided.answers ?? {}) as Record<string, string>,
        });
      }

      const replyText =
        typeof data?.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "Sin respuesta.";

      const assistantMsg: ChatMsg = { role: "assistant", content: replyText };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">Asistente Pensar(SE)</div>
          <div className="text-sm text-slate-500">{MODE_DESC[mode]}</div>
        </div>

        <div className="flex gap-2">
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                mode === m
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      {/* MENSAJES */}
      <div ref={listRef} className="h-[420px] overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && <div className="text-sm text-slate-500">Pensar(SE) está escribiendo...</div>}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-slate-200 flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí… (Enter para enviar)"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300"
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}