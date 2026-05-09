import { generateText, generateObject, stepCountIs } from "ai";
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

const ANALYSIS_SYSTEM = `You are the Crucio Coach — a senior Java interviewer who looks at a student's history and tells them exactly what to do next.

Your tools:
- get_user_progress: ELO + recent submissions
- identify_weak_topics: topics where they score low
- recommend_next_problems: unsolved problems, optionally filtered by topic

Your loop (be efficient, don't loop endlessly):
1. Call get_user_progress for the userId.
2. Call identify_weak_topics.
3. Call recommend_next_problems with those weak topic slugs.
4. Then write a CONCISE coaching plan in natural language:
   - 2-3 sentence summary of where they stand
   - List of weak topics with avg score + concrete hint per topic
   - List of recommended problems with reason per pick
   - Concrete 30-60 minute next-session plan

Don't output JSON — that comes in a second pass. Just write the plan as natural language.

Rules:
- Be specific. "Study concurrency" is BAD. "Focus on volatile vs synchronized; write a counter race" is GOOD.
- If user has 0 submissions, give a starter plan with easy problems.`;

const FORMATTER_SYSTEM = `You convert coaching plans into a strict JSON schema. Read the plan and emit the JSON object per schema. Don't invent data not in the plan.`;

export async function getCoachAdvice(args: {
  userId: string;
}): Promise<CoachAdvice> {
  const analysisPrompt = `User id: ${args.userId}

Build their personalized coaching plan now. Use the tools, then write the plan as natural language.`;

  const analysis = await generateText({
    model: google(MODEL_ID),
    system: ANALYSIS_SYSTEM,
    prompt: analysisPrompt,
    tools: coachTools,
    stopWhen: stepCountIs(8),
    temperature: 0.4,
  });

  const analysisText = collectStepText(analysis) || analysis.text || "";
  if (!analysisText.trim()) {
    throw new Error("Coach produced no analysis text.");
  }

  const formatted = await generateObject({
    model: google(MODEL_ID),
    schema: coachAdviceSchema,
    system: FORMATTER_SYSTEM,
    prompt: `Convert this coaching plan into the structured JSON:

"""
${analysisText}
"""`,
    temperature: 0,
  });

  return formatted.object;
}

type StepWithContent = {
  content?: Array<{ type: string; text?: string }>;
  text?: string;
};

function collectStepText(result: { steps?: StepWithContent[] }): string {
  if (!result.steps) return "";
  const chunks: string[] = [];
  for (const step of result.steps) {
    if (step.text) chunks.push(step.text);
    for (const part of step.content ?? []) {
      if (part.type === "text" && part.text) chunks.push(part.text);
    }
  }
  return chunks.join("\n").trim();
}
