// Minimal Gemini REST client (free AI Studio key in GEMINI_API_KEY).
// Falls back across models and retries on 429/503 ("high demand").

import { sleep } from "./http";

const MODELS = ["gemini-flash-lite-latest", "gemini-flash-latest"];
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

export class GeminiUnavailableError extends Error {}

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** Send parts and parse the model's JSON answer. */
export async function geminiJson<T>(parts: GeminiPart[], opts: { maxAttempts?: number } = {}): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiUnavailableError("GEMINI_API_KEY is not set");
  const body = JSON.stringify({
    contents: [{ parts }],
    generationConfig: { responseMimeType: "application/json", temperature: 0 },
  });
  const maxAttempts = opts.maxAttempts ?? 3;
  let lastErr = "";
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    for (const model of MODELS) {
      let res: Response;
      try {
        res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
          method: "POST",
          headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(180_000),
        });
      } catch (err) {
        lastErr = `${model}: ${(err as Error).message}`;
        continue;
      }
      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
        try {
          return JSON.parse(text) as T;
        } catch {
          lastErr = `${model}: invalid JSON response`;
          continue;
        }
      }
      lastErr = `${model}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`;
      // 4xx other than rate limit: try next model; 429/5xx: also try next model, then back off.
    }
    await sleep(5000 * 2 ** attempt);
  }
  throw new GeminiUnavailableError(lastErr);
}

export function pdfPart(bytes: Uint8Array): GeminiPart {
  return { inline_data: { mime_type: "application/pdf", data: Buffer.from(bytes).toString("base64") } };
}
