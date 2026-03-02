"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "free" | "guided" | "plan7";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const MODE_LABEL: Record<Mode, string> = {
  free: "Free",
  guided: "Guided",
  plan7: "Plan 7 días",
};

const MODE_DESC: Record<Mode, string> = {
  free: "Conversación libre con estructura ligera.",
  guided: "Te haré 6–8 preguntas para llegar a una conclusión personalizada.",
  plan7: "Plan semanal con pasos diarios y seguimiento.",
};

export default function ChatWidget() {
  const [mode, setMode] = useState<Mode>("free");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hola 👋 Soy el asistente de Pensar(SE). Elige un modo arriba y cuéntame qué te gustaría trabajar hoy.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const headerSubtitle = useMemo(() => MODE_DESC[mode], [mode]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode, // 👈 IMPORTANTÍSIMO: aquí enviamos el modo
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error en la API");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Ahora mismo no he podido responder (error). Revisa Vercel logs o vuelve a intentarlo.",
        },
      ]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onModeChange(next: Mode) {
    setMode(next);

    // Mensaje “de sistema” visible para orientar al usuario
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `✅ Modo activado: **${MODE_LABEL[next]}**. ${MODE_DESC[next]} \n\nDime el tema (ansiedad, hábitos, estudio, decisiones…) y empezamos.`,
      },
    ]);
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-white font-semibold text-lg">Asistente Pensar(SE)</div>
            <div className="text-white/70 text-sm">{headerSubtitle}</div>
          </div>

          {/* Mode buttons */}
          <div className="flex gap-2">
            {(["free", "guided", "plan7"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm border transition",
                  m === mode
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/80 border-white/15 hover:border-white/35 hover:text-white",
                ].join(" ")}
                type="button"
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="p-4 h-[420px] overflow-y-auto space-y-3"
      >
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white",
                ].join(" ")}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white rounded-2xl px-4 py-3 text-sm">
              Pensar(SE) está escribiendo…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí… (Enter para enviar)"
          className="flex-1 rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-white text-black font-medium disabled:opacity-60"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
