export type ResponseType =
  | "texto corto"
  | "escala"
  | "selección"
  | "emojis"
  | "formulario breve";

export type TaskTemplateLike = {
  id?: string;
  title?: string;
  description?: string;
  instructions?: string;
  responseType?: ResponseType;
};

export type TaskResponseProfile =
  | {
      kind: "text";
      placeholder: string;
    }
  | {
      kind: "scale";
      min: 1;
      max: 5 | 10;
    }
  | {
      kind: "selection";
      options: string[];
    }
  | {
      kind: "emoji";
      options: string[];
    }
  | {
      kind: "abc";
      fields: Array<"situacion" | "pensamiento" | "emocion" | "conducta" | "pensamiento_alternativo">;
    }
  | {
      kind: "brief_form";
      fields: string[];
    };

export type AbcAnswer = {
  situacion: string;
  pensamiento: string;
  emocion: string;
  conducta: string;
  pensamiento_alternativo: string;
};

export function getTaskResponseProfile(template: TaskTemplateLike): TaskResponseProfile {
  const title = (template.title ?? "").toLowerCase();
  const description = (template.description ?? "").toLowerCase();
  const instructions = (template.instructions ?? "").toLowerCase();
  const id = (template.id ?? "").toLowerCase();
  const text = `${id} ${title} ${description} ${instructions}`;

  if (template.responseType === "texto corto") {
    return { kind: "text", placeholder: "Escribe aquí tu respuesta..." };
  }

  if (template.responseType === "escala") {
    const isScaleFive =
      text.includes("1-5") || text.includes("1 a 5") || text.includes("1–5") || text.includes("cinco");
    return { kind: "scale", min: 1, max: isScaleFive ? 5 : 10 };
  }

  if (template.responseType === "selección") {
    if (text.includes("stop")) {
      return {
        kind: "selection",
        options: ["Sí, completa", "Parcial", "No", "No aplica"],
      };
    }
    return {
      kind: "selection",
      options: ["Sí", "Parcial", "No", "No aplica"],
    };
  }

  if (template.responseType === "emojis") {
    return {
      kind: "emoji",
      options: ["😣", "😔", "😐", "🙂", "😄"],
    };
  }

  if (template.responseType === "formulario breve") {
    const isAbc = text.includes("abc") || text.includes("pensamiento automático") || text.includes("pensamiento automatico");

    if (isAbc) {
      return {
        kind: "abc",
        fields: ["situacion", "pensamiento", "emocion", "conducta", "pensamiento_alternativo"],
      };
    }

    return {
      kind: "brief_form",
      fields: ["Campo 1", "Campo 2", "Campo 3"],
    };
  }

  return { kind: "text", placeholder: "Escribe aquí tu respuesta..." };
}

export function parseAbcAnswer(raw: string): AbcAnswer {
  const empty: AbcAnswer = {
    situacion: "",
    pensamiento: "",
    emocion: "",
    conducta: "",
    pensamiento_alternativo: "",
  };

  if (!raw.trim()) {
    return empty;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AbcAnswer>;
    return {
      situacion: String(parsed.situacion ?? ""),
      pensamiento: String(parsed.pensamiento ?? ""),
      emocion: String(parsed.emocion ?? ""),
      conducta: String(parsed.conducta ?? ""),
      pensamiento_alternativo: String(parsed.pensamiento_alternativo ?? ""),
    };
  } catch {
    const [situacion = "", pensamiento = "", emocion = "", conducta = "", pensamiento_alternativo = ""] = raw.split("\n---\n");
    return { situacion, pensamiento, emocion, conducta, pensamiento_alternativo };
  }
}

export function serializeAbcAnswer(answer: AbcAnswer) {
  return JSON.stringify(answer);
}

export function parseBriefFormAnswer(raw: string, size = 3) {
  if (!raw.trim()) {
    return Array.from({ length: size }, () => "");
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return Array.from({ length: size }, (_, index) => String(parsed[index] ?? ""));
    }
  } catch {
    // Fallback for legacy format
  }

  const legacy = raw.split("\n---\n");
  return Array.from({ length: size }, (_, index) => String(legacy[index] ?? ""));
}

export function serializeBriefFormAnswer(values: string[]) {
  return JSON.stringify(values.map((value) => value.trim()));
}
