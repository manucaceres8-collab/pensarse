import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Falta 'message' en el body" }),
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres el chatbot oficial de Pensar(SE): entrenamiento psicológico basado en evidencia.

OBJETIVO:
Dar psicoeducación clara + acciones prácticas.

ESTILO (A + C):
- Responde en español.
- Frases cortas.
- Párrafos de 1-3 líneas.
- Nada de bloques largos.
- Usa listas cuando ayude.
- Máximo 220 palabras salvo que pidan más detalle.
- Tono cálido, profesional y estructurado.

FORMATO OBLIGATORIO:

📌 Lo importante  
(Resumen claro en 1-2 líneas)

🧠 Qué está pasando  
(Breve explicación psicológica basada en evidencia)

✅ Qué puedes hacer hoy  
(Lista de pasos concretos y accionables)

🔎 Si te ocurre esto, prueba esto  
(Pequeñas recomendaciones específicas)

❓ Para ajustarlo a ti  
(1-2 preguntas para personalizar)

NORMAS IMPORTANTES:
- No diagnostiques.
- No sustituyas atención profesional.
- Si detectas riesgo de autolesión o suicidio, recomienda buscar ayuda profesional inmediata.
`
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    return new Response(
      JSON.stringify({
        reply: response.choices[0].message.content,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR REAL:", error);

    return new Response(
      JSON.stringify({
        error: "Error procesando la solicitud",
      }),
      { status: 500 }
    );
  }
}