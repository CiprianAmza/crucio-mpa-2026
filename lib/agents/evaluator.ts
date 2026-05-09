import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { evaluatorTools } from "./tools";
import { tryParseJson } from "./parse";

const MODEL_ID = "gemini-2.5-flash-lite";

export const evaluationSchema = z.object({
  score: z.number().int().min(0).max(10000),
  oneLine: z.string(),
  perCriterion: z.array(
    z.object({
      name: z.string(),
      score: z.number().int().min(0).max(100),
      comment: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  studyHints: z.array(z.string()),
});

export type Evaluation = z.infer<typeof evaluationSchema>;

const SYSTEM = `You are the Crucio Evaluator. You grade free-text answers to Java interview questions.

Your loop:
1. ALWAYS first call get_problem_rubric for the given problemId to fetch the per-criterion rubric.
2. Optionally call search_user_prior_answers to detect repeated patterns.
3. Score the answer against EACH criterion in the rubric, weighted by the criterion weight.
4. Return ONLY a final JSON block in the EXACT shape:
{
  "score": <0..10000 integer>,
  "oneLine": "<one sentence summary>",
  "perCriterion": [{"name":"...", "score": <0..100>, "comment":"..."}],
  "strengths": ["..."],
  "gaps": ["..."],
  "studyHints": ["..."]
}

Rules:
- Be honest and specific. Do not be sycophantic.
- 0–3000 = poor / off-topic. 3000–6000 = partial. 6000–8500 = solid. 8500+ = excellent with depth.
- Never reproduce the user's text verbatim — comment on it.
- Output ONLY the JSON. No preamble, no markdown fences.`;

export async function evaluateAnswer(args: {
  userId: string;
  problemId: string;
  answer: string;
}): Promise<Evaluation> {
  const userPrompt = `Problem id: ${args.problemId}
User id: ${args.userId}

User's answer (free-text, may have been transcribed from voice):
"""
${args.answer}
"""

Now grade it. Call tools first, then return ONLY the final JSON.`;

  const result = await generateText({
    model: google(MODEL_ID),
    system: SYSTEM,
    prompt: userPrompt,
    tools: evaluatorTools,
    stopWhen: stepCountIs(6),
    temperature: 0.2,
  });

  const text = result.text ?? "";
  let parsed = tryParseJson<unknown>(text);

  // Retry once with a tighter prompt if the model emitted prose-only or malformed JSON
  if (!parsed) {
    const retry = await generateText({
      model: google(MODEL_ID),
      system:
        "You are a JSON formatter. Convert the input into the exact JSON shape requested. Output ONLY the JSON object, no markdown fences, no preamble.",
      prompt: `The previous evaluation response was malformed:
"""
${text.slice(0, 4000)}
"""

Re-emit it as a single valid JSON object with EXACTLY these keys: score (int 0..10000), oneLine (string), perCriterion (array of {name, score 0..100, comment}), strengths (array of strings), gaps (array of strings), studyHints (array of strings).`,
      temperature: 0,
    });
    parsed = tryParseJson<unknown>(retry.text ?? "");
  }

  if (!parsed) {
    throw new Error(
      "Evaluator did not return valid JSON after retry. Raw: " +
        text.slice(0, 200),
    );
  }
  return evaluationSchema.parse(parsed);
}
