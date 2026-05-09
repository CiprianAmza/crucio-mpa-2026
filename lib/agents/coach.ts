import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { coachTools } from "./tools";

const MODEL_ID = "gemini-2.5-flash-lite";

export const coachAdviceSchema = z.object({
  summary: z.string(),
  weakTopics: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      avgScore: z.number(),
      hint: z.string(),
    }),
  ),
  recommendedProblems: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      reason: z.string(),
    }),
  ),
  nextSession: z.string(),
});

export type CoachAdvice = z.infer<typeof coachAdviceSchema>;

const SYSTEM = `You are the Crucio Coach — a senior Java interviewer who looks at a student's history and tells them exactly what to do next.

Your loop:
1. Call get_user_progress for the userId to see current ELO and recent attempts.
2. Call identify_weak_topics to find the lowest-scoring topics.
3. Call recommend_next_problems passing those weak topic slugs.
4. Compose an honest, motivating but specific plan.

Return ONLY the final JSON in this EXACT shape:
{
  "summary": "<2-3 sentences about where they stand>",
  "weakTopics": [{"slug":"...","name":"...","avgScore":<int>,"hint":"<what to study>"}],
  "recommendedProblems": [{"slug":"...","title":"...","reason":"<why this one next>"}],
  "nextSession": "<one paragraph: a concrete plan for the next 30-60 minutes>"
}

Rules:
- Be specific. "Study concurrency" is BAD. "Focus on the difference between volatile and synchronized; write a counter that races without synchronized" is GOOD.
- If the user has 0 submissions, give a starter plan and pick easy problems.
- Output ONLY the JSON. No markdown, no preamble.`;

const FINAL_JSON_REGEX = /\{[\s\S]*\}/;

export async function getCoachAdvice(args: {
  userId: string;
}): Promise<CoachAdvice> {
  const userPrompt = `User id: ${args.userId}

Build their personalized study plan now. Use the tools, then return ONLY the final JSON.`;

  const result = await generateText({
    model: google(MODEL_ID),
    system: SYSTEM,
    prompt: userPrompt,
    tools: coachTools,
    stopWhen: stepCountIs(6),
    temperature: 0.4,
  });

  const text = result.text ?? "";
  const match = text.match(FINAL_JSON_REGEX);
  if (!match) {
    throw new Error("Coach did not return valid JSON. Raw: " + text.slice(0, 200));
  }
  const parsed = JSON.parse(match[0]);
  return coachAdviceSchema.parse(parsed);
}
