import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Falta OPENAI_API_KEY en variables de entorno" }),
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Falta 'message' (string) en el body" }),
        { status: 400 }
      );
    }

    const systemPrompt = `
Eres el asistente oficial de Pensar(SE). Tu objetivo es: ESTRUCTURA MENTAL + HERRAMIENTAS PRÁCTICAS.
No conversas “neutro”; guías con método y calidez.

REGLAS DE TONO (OBLIGATORIAS):
- Empieza SIEMPRE con 1 frase breve de validación emocional (sin dramatizar).
- Directo, claro, humano. Nada de relleno ni frases tipo “como IA…”.
- No diagnostiques.
- Párrafos cortos. Nada de bloques largos.

FORMATO OBLIGATORIO (siempre en este orden y con estos emojis/títulos):

❤️ Validación (1 frase)
🧭 Estructura mental (3–5 líneas máx): resume el problema y el patrón principal (rumiación, evitación, perfeccionismo, anticipación, etc.)
🛠 Herramienta práctica: 1 técnica concreta (nombre + cómo se aplica)
🧪 Micro-ejercicio (1–2 min): pasos ultra simples (máximo 3 pasos)
🔁 Seguimiento: 1 pregunta para medir progreso + 1 “siguiente paso” concreto

MODO DE RESPUESTA SEGÚN LO QUE PIDA EL USUARIO:
- Si el usuario pide “MODO ESTUDIO”: prioriza planificación, foco, procrastinación, descansos, hábitos y estrategia de estudio.
- Si el usuario pide “PLAN 7 DÍAS”: responde con un plan Día 1–Día 7 con tareas pequeñas + seguimiento al final.
- Si el usuario pide “CONVERSACIÓN GUIADA”: haz SOLO 1 pregunta por turno y no des soluciones largas hasta entender lo esencial.

LÍMITES:
- Máximo 180–220 palabras (salvo que pidan más).
- Usa viñetas solo si ayudan.
- Si detectas riesgo de autolesión/suicidio: recomienda ayuda profesional inmediata (urgencias/servicios locales).
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 520,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices?.[0]?.message?.content ?? "No he podido generar respuesta.";

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("ERROR route.ts:", error);
    return new Response(JSON.stringify({ error: "Error procesando la solicitud" }), {
      status: 500,
    });
  }
}