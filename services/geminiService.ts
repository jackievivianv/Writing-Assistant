
import { GoogleGenAI } from "@google/genai";
import type { LTError, AnalysisResult } from "../types";
import { GEMINI_MODEL } from "../constants";

export async function analyzeErrorsWithGemini(errors: LTError[], originalText: string, languageCode: string): Promise<AnalysisResult> {
    if (!process.env.API_KEY) {
        throw new Error("La clave de API de Google no está configurada.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const textLength = originalText.split(/\s+/).length;

    if (errors.length === 0) {
        return {
            score: 100,
            summary: "¡Excelente trabajo! No se encontraron errores gramaticales ni ortográficos. Tu texto parece impecable. ¡Sigue así!",
        };
    }

    const errorSummary = errors.map(e => ({
        message: e.message,
        context: e.context.text,
        type: e.rule.category.name,
    }));
    
    const langName = new Intl.DisplayNames([languageCode], { type: 'language' }).of(languageCode) || 'el idioma detectado';

    const prompt = `
      Eres un editor literario experto y alentador para la plataforma GetInkspired, con especialización en escritura de ficción en ${langName}.
      Tu tarea es analizar una lista de errores gramaticales, de estilo y de puntuación de un texto y proporcionar una evaluación constructiva.
      El texto original tiene aproximadamente ${textLength} palabras.

      Aquí está la lista de errores encontrados por una herramienta de análisis:
      ${JSON.stringify(errorSummary, null, 2)}

      Basándote en estos datos, responde en formato JSON con la siguiente estructura: { "score": <number>, "summary": "<string>" }.

      1.  **score**: Calcula una puntuación del 1 al 100.
          - 100 significa un texto perfecto (caso gestionado si no hay errores, pero la escala es esa).
          - Un texto con muy pocos errores menores (ej. 1-2 errores por cada 500 palabras) debería tener una puntuación alta (90-99).
          - La puntuación debe disminuir a medida que aumenta la densidad y la gravedad de los errores. Considera que los errores de 'Gramática' u 'Ortografía' son más graves que los de 'Estilo', 'Tipografía' o 'Puntuación'.
          - Usa la densidad de errores (errores por palabra) como factor principal en tu cálculo.

      2.  **summary**: Escribe un párrafo de resumen conciso, útil y alentador (de 3 a 5 frases).
          - **IMPORTANTE**: El resumen DEBE estar escrito en ${langName}.
          - Comienza con una nota positiva sobre el texto.
          - Menciona las 1-2 áreas de mejora más importantes basándote en los errores más frecuentes o graves.
          - **Revisa si hay errores de formato específicos de la narrativa**:
            - **Diálogos**: Si en los errores aparecen problemas con guiones, menciona la importancia de usar la raya o guion largo (—) para los diálogos en vez del guion corto (-), ya que es el estándar editorial.
            - **Puntuación expresiva**: Si detectas errores sobre el uso de múltiples signos de exclamación/interrogación (p. ej., "!!!") o la falta del signo de apertura en español ("¡", "¿"), coméntalo como un consejo de estilo para dar un acabado más profesional.
          - Termina con una frase motivadora que anime al escritor a seguir mejorando.
          - No seas genérico. Basa tus comentarios en los errores reales proporcionados.

      Ejemplo de respuesta esperada (si se encuentran errores de diálogo y gramática):
      {
        "score": 85,
        "summary": "Tu texto tiene una base muy sólida y una narrativa atractiva. Para pulirlo aún más, te sugiero prestar atención a la puntuación correcta en los diálogos usando el guion largo (—) y revisar algunas concordancias de género. ¡Con estos pequeños ajustes, tu capítulo quedará fantástico y con un aspecto muy profesional!"
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.5,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);

        if (typeof parsedData.score === 'number' && typeof parsedData.summary === 'string') {
            return parsedData as AnalysisResult;
        } else {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

    } catch (e) {
        console.error("Error al procesar la respuesta de Gemini:", e);
        throw new Error("No se pudo generar el análisis de la IA. El formato de la respuesta puede ser inválido.");
    }
}
