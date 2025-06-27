
import type { LTResponse } from '../types';
import { LANGUAGE_TOOL_API_URL } from '../constants';

export async function checkText(text: string, language: string): Promise<LTResponse> {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', language);
    params.append('enabledOnly', 'false');

    try {
        const response = await fetch(LANGUAGE_TOOL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de LanguageTool: ${response.status} ${errorText}`);
        }

        return await response.json() as LTResponse;
    } catch (error) {
        console.error("LanguageTool API request failed:", error);
        throw new Error("No se pudo conectar con el servicio de corrección. Verifique su conexión a internet.");
    }
}
