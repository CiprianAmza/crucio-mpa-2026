import { generateText, generateObject, stepCountIs } from "ai";
import { cerebras } from "@ai-sdk/cerebras";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { evaluatorTools } from "./tools";

const MODEL_ID = "llama-3.3-70b";

// Schema returned by the LLM (Pass 2). The overall `score` is computed
// deterministically server-side from per-criterion scores + rubric weights —
// the LLM is unreliable at weighted averages.
const llmEvaluationSchema = z.object({
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

// Public schema (what consumers see — adds the server-computed `score`).
export const evaluationSchema = llmEvaluationSchema.extend({
  score: z.number().int().min(0).max(10000),
});
export type Evaluation = z.infer<typeof evaluationSchema>;

type RubricCriterion = { name: string; weight: number };
type Rubric = { criteria: RubricCriterion[] };

const ANALYSIS_SYSTEM = `You are the Crucio Evaluator — a senior interviewer grading free-text Java answers.

You are given:
- The interview question
- The per-criterion rubric (already loaded for you)
- The candidate's answer

Optionally call search_user_prior_answers if you want to detect repeated patterns from this user.

Then write a CONCISE analysis (2-4 short paragraphs). Address EACH rubric criterion using its EXACT name (case matters). For each:
- Quality 0-100 (how well the answer addressed it)
- Specific quotes/concepts from the answer that worked or didn't.

Then list:
- Top 2-3 strengths
- Top 2-3 gaps
- 2-3 concrete study hints

Be honest. Don't be sycophantic. 50/100 means "addressed but partial". 80+/100 means "thorough and correct". 30 or below means "missing or wrong".

Don't output JSON. Just write your analysis as natural language.`;

const FORMATTER_SYSTEM = `You convert evaluation analyses into a strict JSON schema. Read the analysis and emit the JSON object per schema. Use the EXACT criterion names from the rubric (the analysis text should already use them). Per-criterion scores 0..100 integer. Don't invent criteria not in the analysis.`;

function safeParseRubric(raw: string): Rubric {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.criteria)) return parsed as Rubric;
  } catch {}
  return { criteria: [] };
}

function computeOverallScore(
  perCriterion: { name: string; score: number }[],
  rubric: Rubric,
): number {
  if (perCriterion.length === 0) return 0;

  // Try matching each LLM criterion against the rubric (case-insensitive,
  // ignore non-alphanumeric for fuzzy match like "Contract correctness" vs
  // "Contract Correctness" or with trailing punctuation).
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const rubricByName = new Map(rubric.criteria.map((c) => [norm(c.name), c]));

  let totalWeight = 0;
  let weightedSum = 0;
  let matched = 0;
  for (const c of perCriterion) {
    const rc = rubricByName.get(norm(c.name));
    if (rc) {
      weightedSum += c.score * rc.weight;
      totalWeight += rc.weight;
      matched += 1;
    }
  }

  // If we matched all rubric criteria, use weighted average over total weight (1.0 ideally).
  if (matched > 0 && totalWeight > 0) {
    // Normalize in case rubric weights don't sum to exactly 1.0.
    const normalized = weightedSum / totalWeight; // 0..100
    return Math.round(normalized * 100); // 0..10000
  }

  // Fallback: simple average across whatever criteria we got.
  const avg =
    perCriterion.reduce((acc, c) => acc + c.score, 0) / perCriterion.length;
  return Math.round(avg * 100);
}

export async function evaluateAnswer(args: {
  userId: string;
  problemId: string;
  answer: string;
}): Promise<Evaluation> {
  const problem = await prisma.problem.findUnique({
    where: { id: args.problemId },
    select: { id: true, title: true, prompt: true, rubric: true, difficulty: true },
  });
  if (!problem) throw new Error("Problem not found");

  const rubric = safeParseRubric(problem.rubric);
  const rubricStr = JSON.stringify(rubric, null, 2);

  const analysisPrompt = `Question (id ${problem.id}): ${problem.title}
${problem.prompt}

Rubric (use these EXACT criterion names):
${rubricStr}

User id: ${args.userId}

Candidate's answer (free-text or voice transcript):
"""
${args.answer}
"""

Now analyse. You may call search_user_prior_answers once if useful. Then write your evaluation in natural language, using the EXACT criterion names from the rubric.`;

  const analysis = await generateText({
    model: cerebras(MODEL_ID),
    system: ANALYSIS_SYSTEM,
    prompt: analysisPrompt,
    tools: { searchUserPriorAnswers: evaluatorTools.searchUserPriorAnswers },
    stopWhen: stepCountIs(4),
    temperature: 0.2,
  });

  const analysisText = collectStepText(analysis) || analysis.text || "";
  if (!analysisText.trim()) {
    throw new Error("Evaluator produced no analysis text.");
  }

  const formatted = await generateObject({
    model: cerebras(MODEL_ID),
    schema: llmEvaluationSchema,
    system: FORMATTER_SYSTEM,
    prompt: `Convert this analysis into the structured evaluation JSON. Rubric criterion names (use these exactly):
${rubric.criteria.map((c) => `- ${c.name}`).join("\n")}

Analysis:
"""
${analysisText}
"""`,
    temperature: 0,
  });

  // Compute overall score server-side from per-criterion + rubric weights.
  const score = computeOverallScore(formatted.object.perCriterion, rubric);

  return {
    ...formatted.object,
    score,
  };
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
