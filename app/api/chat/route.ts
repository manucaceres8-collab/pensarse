import OpenAI from "openai";

export const runtime = "nodejs"; // importante para Vercel (server runtime)
export const dynamic = "force-dynamic";

type Mode = "guided" | "free" | "plan7";

type GuidedState = {
  step: number; // 0..7 (máx 8 pasos)
  answers?: Record<string, string>;
};

type ReqBody = {
  message: string;
  mode?: Mode;
  guided?: GuidedState;
  // info opcional que tú guardes en el front (nombre, objetivo, etc.)
  profile?: {
    name?: string;
    goal?: string;
  };
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function safeStr(v: unknown) {
  return typeof v === "string" ? v : "";
}

/**
 * GUIADO 6–8 pasos (máx 8):
 * 0 objetivo
 * 1 cuándo / frecuencia
 * 2 intensidad + impacto
 * 3 disparadores (situación)
 * 4 pensamiento/imagen (cognición)
 * 5 emoción + cuerpo
 * 6 conductas (qué haces)
 * 7 recursos/qué te ha servido + cierre con formulación + plan + micro
 */
const GUIDED_QUESTIONS = [
  "Para empezar: ¿qué te gustaría conseguir exactamente con esto? (una frase)",
  "¿Desde cuándo te pasa y con qué frecuencia aparece? (días/semana)",
  "Del 0 al 10, ¿qué intensidad tiene cuando aparece? ¿Qué impacto tiene en tu día?",
  "¿En qué situaciones aparece más? Pon un ejemplo reciente en 2–3 líneas.",
  "En ese momento, ¿qué pensamiento o imagen se te viene? (lo más literal posible)",
  "¿Qué emoción principal notas y qué señales físicas aparecen? (pecho, estómago, respiración…)",
  "¿Qué sueles hacer después? (evitar, comprobar, discutir, aislarte, comer, redes…)",
  "¿Qué has probado que te haya ayudado aunque sea un 10%? ¿Y qué te gustaría que cambiara primero?",
];

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!process.env.OPENAI_API_KEY) {
      return json({ error: "Falta OPENAI_API_KEY en variables de entorno." }, 500);
    }

    const body = (await req.json()) as ReqBody;
    const message = safeStr(body?.message).trim();
    const mode: Mode = body?.mode ?? "free";

    if (!message) return json({ error: "Falta 'message' en el body." }, 400);

    // -----------------------
    // MODO GUIADO (6–8)
    // -----------------------
    if (mode === "guided") {
      const step = Math.max(0, Math.min(7, body?.guided?.step ?? 0));
      const answers = body?.guided?.answers ?? {};
      const nextAnswers = { ...answers, [`q${step}`]: message };

      // Si AÚN NO hemos terminado -> devolvemos la siguiente pregunta fija (sin llamar al modelo)
      if (step < 7) {
        const nextStep = step + 1;
        return json({
          mode: "guided",
          guided: { step: nextStep, answers: nextAnswers },
          ui: {
            type: "question",
            question: GUIDED_QUESTIONS[nextStep],
            progress: { current: nextStep + 1, total: 8 },
          },
        });
      }

      // Si step == 7 -> ya tenemos todo, ahora sí llamamos al modelo para:
      // - formulación breve (no "diagnóstico" clínico)
      // - 1 micro-ejercicio
      // - 1 herramienta práctica
      // - cierre con seguimiento
      const system = `
Eres Pensar(SE), un asistente de psicología práctica con estilo propio.
Objetivo: NO sonar como ChatGPT. Estilo: humano, claro, sin emojis "tipo IA" repetitivos.
Reglas:
- NO uses listas largas genéricas.
- NO uses más de 2 emojis en toda la respuesta.
- NO digas "como IA" ni "no puedo diagnosticar" a no ser que el usuario lo pida.
- NO uses la palabra "diagnóstico". Usa: "formulación", "hipótesis", "patrón".
- Estructura obligatoria EXACTA con estos títulos:
  1) Validación breve (1–2 frases)
  2) Formulación Pensar(SE) (3–5 líneas, concreta)
  3) Herramienta (pasos concretos, 3 bullets máximo)
  4) Micro-ejercicio (60–120s, 2 pasos máximo)
  5) Seguimiento (1 pregunta final + propuesta de siguiente paso)
`;

      const user = `
Resumen de la entrevista guiada (8 respuestas):
1) ${safeStr(nextAnswers.q0)}
2) ${safeStr(nextAnswers.q1)}
3) ${safeStr(nextAnswers.q2)}
4) ${safeStr(nextAnswers.q3)}
5) ${safeStr(nextAnswers.q4)}
6) ${safeStr(nextAnswers.q5)}
7) ${safeStr(nextAnswers.q6)}
8) ${safeStr(nextAnswers.q7)}

Ahora genera la respuesta final siguiendo la estructura.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });

      const reply = completion.choices?.[0]?.message?.content ?? "No he podido generar respuesta.";

      return json({
        mode: "guided",
        guided: { step: 0, answers: {} }, // resetea para otra sesión guiada si quieres
        ui: { type: "final" },
        reply,
      });
    }

    // -----------------------
    // MODO PLAN 7 DÍAS
    // -----------------------
    if (mode === "plan7") {
      const system = `
Eres Pensar(SE). Haz planes de 7 días, muy concretos y realistas.
Reglas:
- Máximo 1 emoji.
- Evita texto plano largo; usa bloques cortos.
- Si falta info mínima (objetivo + dificultad), pregunta 2 cosas y para.
Estructura:
A) Validación breve
B) Preguntas (solo si falta info) o Plan 7 días (si hay info)
C) Cierre de seguimiento (1 pregunta)
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.6,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
      });

      return json({
        mode: "plan7",
        reply: completion.choices?.[0]?.message?.content ?? "No he podido generar el plan.",
      });
    }

    // -----------------------
    // MODO FREE (con estilo, pero no “plantilla” siempre)
    // -----------------------
    const systemFree = `
Eres Pensar(SE). Conversación natural con estilo propio.
Reglas:
- No repitas siempre la misma plantilla.
- Si el usuario hace una pregunta informativa/meta ("en qué te diferencias", "qué es X"), responde breve y directo.
- Si detectas emoción/problema personal, entonces:
  - validación breve
  - 1 herramienta práctica
  - 1 micro-ejercicio corto (opcional si procede)
  - cierre con seguimiento
- Máximo 2 emojis en toda la respuesta.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemFree },
        { role: "user", content: message },
      ],
    });

    return json({
      mode: "free",
      reply: completion.choices?.[0]?.message?.content ?? "No he podido responder.",
    });
  } catch (err: any) {
    console.error("API /api/chat ERROR:", err);
    return json({ error: String(err?.message ?? err) }, 500);
  }
}
