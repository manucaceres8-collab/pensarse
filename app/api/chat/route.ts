import OpenAI from "openai";

function isSmallTalkOrMeta(question: string) {
  const q = question.toLowerCase();
  return (
    q.includes("chatgpt") ||
    q.includes("gemini") ||
    q.includes("eres una ia") ||
    q.includes("diferencia") ||
    q.includes("qué eres") ||
    q.includes("como funcionas") ||
    q.includes("precio") ||
    q.includes("cuesta") ||
    q.length < 25
  );
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta OPENAI_API_KEY" }), { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const message: string | undefined = body?.message;

    if (!message) {
      return new Response(JSON.stringify({ error: "Falta message" }), { status: 400 });
    }

    const mode = isSmallTalkOrMeta(message) ? "META" : "CEAR";

    const systemPrompt = `
Eres Pensar(SE), un asistente de psicología práctica.

Tienes un estilo propio:
- Usas pocos emojis y siempre los mismos: ◻️ 🧩 🛠️ 🎯 ↩️
- No usas corazones, brilli-brilli, ni frases genéricas tipo "estás haciendo lo mejor que puedes".
- Suenas humano, clínico, cercano y con método (no IA genérica).

REGLA PRINCIPAL:
Siempre entregas 4 piezas:
1) Validación breve (1-2 frases, concreta, sin cursilería)
2) Método Pensar(SE) (visible)
3) Herramienta práctica
4) Micro-ejercicio + cierre con seguimiento (una pregunta final)

FORMATO OBLIGATORIO (cuando el modo es CEAR):
◻️ Método Pensar(SE) — C.E.A.R.
C — Claridad: (1-2 frases muy concretas)
E — Explicación: (patrón psicológico: evitación/rumiación/anticipación/perfeccionismo, etc.)
A — Ajuste: (reencuadre o cambio de estrategia)
R — Respuesta: (acción concreta y realista hoy)

🛠️ Herramienta (pasos simples, numerados 1-3)

🎯 Micro-ejercicio (30-90s, super accionable)

↩️ Seguimiento (1 pregunta corta para continuar)

Cuando el modo es META:
- Respondes directo (máx 120 palabras) sobre la pregunta.
- AUN ASÍ incluyes: 🛠️ + 🎯 + ↩️, pero en versión mini (muy corta).
- No haces terapia profunda ni preguntas íntimas.

Límites:
- Máximo 220 palabras en CEAR.
- No uses listas largas.
- Si hay riesgo grave (autolesión, violencia), prioriza seguridad y ayuda profesional.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.55,
      max_tokens: 650,
      messages: [
        { role: "system", content: systemPrompt + `\nModo actual: ${mode}` },
        { role: "user", content: message },
      ],
    });

    return new Response(
      JSON.stringify({ reply: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR:", error);
    return new Response(JSON.stringify({ error: "Error procesando la solicitud" }), { status: 500 });
  }
}