import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "product_onboarding";

type ReqBody = {
  message: string;
  mode?: Mode;
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

const PRODUCT_SYSTEM_PROMPT = `
Eres el asistente de Pensar(SE), una herramienta para psicólogos y pacientes que facilita el trabajo terapéutico entre sesiones.

Tu función no es ser un chatbot genérico. Tu objetivo es ayudar a una persona interesada, normalmente un psicólogo, a entender:
- qué hace Pensar(SE)
- qué problema resuelve
- cómo se usa en consulta real
- qué ve el psicólogo
- qué hace el paciente
- por qué aporta valor clínico

Contexto del producto:
- El paciente hace check-ins diarios rápidos.
- El psicólogo puede asignar tareas terapéuticas.
- El sistema genera una vista de evolución e informes clínicos breves.
- La propuesta central es convertir lo que pasa entre sesiones en información útil antes de consulta.

Reglas:
- Responde siempre en español.
- Sé claro, concreto y breve.
- Prioriza utilidad clínica y uso real, no marketing vacío.
- No hables como soporte técnico salvo que te lo pidan.
- No inventes integraciones, funciones avanzadas ni diagnósticos automáticos.
- Si te preguntan por una funcionalidad, explícalo como flujo real de uso.
- Usa tono profesional y cercano.
- Evita respuestas largas; normalmente entre 4 y 8 líneas.
- Si conviene, puedes usar bullets cortos.

Si el usuario pregunta algo ambiguo, interpreta que quiere saber cómo usar Pensar(SE) con pacientes reales.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return json(
        { error: "Falta OPENAI_API_KEY en variables de entorno (Vercel / .env.local)." },
        500
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const body = (await req.json()) as ReqBody;
    const message = safeStr(body?.message).trim();

    if (!message) {
      return json({ error: "Falta 'message' en el body." }, 400);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        { role: "system", content: PRODUCT_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    return json({
      mode: "product_onboarding",
      reply: completion.choices?.[0]?.message?.content ?? "No he podido responder ahora mismo.",
    });
  } catch (err: unknown) {
    console.error("API /api/chat ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
}
