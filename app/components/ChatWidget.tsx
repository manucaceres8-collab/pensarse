"use client";

import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type ChatMsg = {
  role: Role;
  content: string;
};

const QUICK_PROMPTS = [
  "¿Qué hace Pensar(SE)?",
  "¿Cómo lo usaría con mis pacientes?",
  "¿Qué ve el psicólogo?",
  "¿Qué tiene que hacer el paciente?",
];

const INITIAL_MESSAGE =
  "Hola, soy el asistente de Pensar(SE). Puedo explicarte cómo funciona o cómo usarlo con tus pacientes.";

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;

    const userMsg: ChatMsg = { role: "user", content: clean };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, mode: "product_onboarding" }),
      });

      const data = await res.json();
      const replyText =
        typeof data?.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "Puedo explicarte qué ve el psicólogo, qué hace el paciente y cómo se usa Pensar(SE) en consulta.";

      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "No he podido responder ahora mismo. Puedo explicarte qué hace Pensar(SE) y cómo se usa en consulta.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="font-semibold text-slate-900">Asistente Pensar(SE)</div>
        <div className="text-sm text-slate-500">Onboarding conversacional del producto</div>
      </div>

      <div ref={listRef} className="h-[380px] space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#0f172a] text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-800 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && <div className="text-sm text-slate-500">El asistente está escribiendo...</div>}
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              disabled={loading}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame cómo funciona Pensar(SE)…"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") send(input);
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading}
            className="rounded-xl bg-[#0f172a] px-5 py-3 font-medium text-white transition hover:bg-[#1f2937] disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
