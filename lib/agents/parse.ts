// Robust JSON extraction for LLM outputs.
// Handles markdown code fences, prose preamble, and uses brace-balancing to
// find a complete JSON object even if the model emits extra text around it.

export function extractJsonObject(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let text = raw.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Find the first '{' and use brace counting to find its matching '}'.
  // Respects strings (so braces inside strings don't break the count).
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\" && inString) {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

export function tryParseJson<T = unknown>(raw: string | null | undefined): T | null {
  const block = extractJsonObject(raw);
  if (!block) return null;
  try {
    return JSON.parse(block) as T;
  } catch {
    return null;
  }
}
