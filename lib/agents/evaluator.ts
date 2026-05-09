import { generateText, generateObject, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { evaluatorTools } from "./tools";

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

const ANALYSIS_SYSTEM = `You are the Crucio Evaluator — a senior interviewer grading free-text Java answers.

You are given:
- The interview question
- The per-criterion rubric (already loaded for you)
- The candidate's answer

Optionally call search_user_prior_answers if you want to detect repeated patterns from this user.

Then write a CONCISE analysis (2-4 short paragraphs). Address each rubric criterion:
- Did the answer cover it? Quality 0-100 per criterion.
- Specific quotes/concepts from the answer that worked or didn't.
- Top 2-3 strengths.
- Top 2-3 gaps.
- 2-3 concrete study hints.

Be honest. Don't be sycophantic. Score thresholds:
- 0–3000 = poor / off-topic
- 3000–6000 = partial
- 6000–8500 = solid
- 8500+ = excellent with depth

Don't output JSON yet — that comes in a second pass. Just write your analysis as natural language.`;

const FORMATTER_SYSTEM = `You convert evaluation analyses into a strict JSON schema. Read the analysis and emit the JSON object exactly per the schema. Score must be 0..10000 integer. Per-criterion scores 0..100 integer.`;

export async function evaluateAnswer(args: {
  userId: string;
  problemId: string;
  answer: string;
}): Promise<Evaluation> {
  // Pre-fetch problem + rubric (no need to make this a tool call — saves 1 LLM step
  // and guarantees the rubric is always available to the evaluator).
  const problem = await prisma.problem.findUnique({
    where: { id: args.problemId },
    select: { id: true, title: true, prompt: true, rubric: true, difficulty: true },
  });
  if (!problem) throw new Error("Problem not found");

  let rubricStr: string;
  try {
    rubricStr = JSON.stringify(JSON.parse(problem.rubric), null, 2);
  } catch {
    rubricStr = problem.rubric;
  }

  // Pass 1: agentic analysis (with optional prior-answers tool)
  const analysisPrompt = `Question (id ${problem.id}): ${problem.title}
${problem.prompt}

Rubric:
${rubricStr}

User id: ${args.userId}

Candidate's answer (free-text or voice transcript):
"""
${args.answer}
"""

Now analyse. You may call search_user_prior_answers once if useful. Then write your evaluation in natural language.`;

  const analysis = await generateText({
    model: google(MODEL_ID),
    system: ANALYSIS_SYSTEM,
    prompt: analysisPrompt,
    tools: { searchUserPriorAnswers: evaluatorTools.searchUserPriorAnswers },
    stopWhen: stepCountIs(4),
    temperature: 0.2,
  });

  // Collect any text emitted across steps (defensive: some models emit text mid-loop).
  const analysisText = collectStepText(analysis) || analysis.text || "";
  if (!analysisText.trim()) {
    throw new Error("Evaluator produced no analysis text.");
  }

  // Pass 2: structured output via generateObject (guaranteed schema-conformant JSON)
  const formatted = await generateObject({
    model: google(MODEL_ID),
    schema: evaluationSchema,
    system: FORMATTER_SYSTEM,
    prompt: `Convert this analysis into the structured evaluation JSON:

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
