"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hola 👋 Soy el asistente de Pensar(SE). ¿Qué te gustaría trabajar hoy: ansiedad, hábitos, estudio o toma de decisiones?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        const err = typeof data?.error === "string" ? data.error : "Error procesando la solicitud";
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
        return;
      }

      const reply = typeof data?.reply === "string" ? data.reply : "No he podido generar respuesta.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error de red. Revisa el servidor y prueba de nuevo." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    sendMessage(input);
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 820,
        margin: "0 auto",
        borderRadius: 18,
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(15, 23, 42, 0.10)",
        boxShadow: "0 30px 90px rgba(15, 23, 42, 0.10)",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* HEADER DEL CHAT */}
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(246, 243, 238, 0.6)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: loading ? "#f59e0b" : "#10b981",
              boxShadow: "0 0 0 4px rgba(16,185,129,0.12)",
            }}
          />
          <div>
            <div style={{ fontWeight: 800, letterSpacing: "-0.2px", color: "#0f172a" }}>
              Asistente Pensar(SE)
            </div>
            <div style={{ fontSize: 12, color: "rgba(15, 23, 42, 0.60)" }}>
              {loading ? "Escribiendo…" : "Calma y estructura"}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "rgba(15, 23, 42, 0.50)" }}>
          Demo
        </div>
      </div>

      {/* MENSAJES */}
      <div
        ref={listRef}
        style={{
          height: 460,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.35) 100%)",
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "84%",
                  padding: "12px 12px",
                  borderRadius: 16,
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  background: isUser ? "rgba(14, 116, 144, 0.95)" : "rgba(15, 23, 42, 0.05)",
                  border: isUser
                    ? "1px solid rgba(255,255,255,0.22)"
                    : "1px solid rgba(15, 23, 42, 0.08)",
                  color: isUser ? "rgba(255,255,255,0.95)" : "rgba(15, 23, 42, 0.90)",
                  boxShadow: isUser
                    ? "0 12px 24px rgba(14, 116, 144, 0.18)"
                    : "0 12px 22px rgba(15, 23, 42, 0.06)",
                }}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 16,
                background: "rgba(15, 23, 42, 0.05)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                color: "rgba(15, 23, 42, 0.70)",
                fontSize: 14,
              }}
            >
              Escribiendo…
            </div>
          </div>
        )}
      </div>

      {/* INPUT ABAJO */}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          gap: 10,
          padding: 14,
          background: "rgba(246, 243, 238, 0.55)",
          borderTop: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí… (Enter para enviar)"
          style={{
            flex: 1,
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid rgba(15, 23, 42, 0.10)",
            background: "rgba(255,255,255,0.75)",
            color: "rgba(15, 23, 42, 0.90)",
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={!canSend}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(15, 23, 42, 0.10)",
            background: canSend ? "rgba(14, 116, 144, 0.95)" : "rgba(15, 23, 42, 0.08)",
            color: canSend ? "white" : "rgba(15, 23, 42, 0.45)",
            cursor: canSend ? "pointer" : "not-allowed",
            fontWeight: 800,
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}