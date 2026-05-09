import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { evaluateAnswer } from "@/lib/agents/evaluator";
import { eloDelta } from "@/lib/elo";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  problemId: z.string(),
  answerText: z.string().min(20, "Answer must be at least 20 characters"),
  isVoice: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { problemId, answerText, isVoice } = parsed.data;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, baseElo: true },
  });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, eloRating: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await evaluateAnswer({
      userId: user.id,
      problemId: problem.id,
      answer: answerText,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Evaluator failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const delta = eloDelta(user.eloRating, problem.baseElo, evaluation.score);

  const submission = await prisma.$transaction(async (tx) => {
    const sub = await tx.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        answerText,
        isVoice,
        score: evaluation.score,
        feedback: JSON.stringify(evaluation),
        eloDelta: delta,
      },
    });
    await tx.user.update({
      where: { id: user.id },
      data: { eloRating: { increment: delta } },
    });
    return sub;
  });

  return NextResponse.json({
    submissionId: submission.id,
    score: evaluation.score,
    eloDelta: delta,
    evaluation,
  });
}
