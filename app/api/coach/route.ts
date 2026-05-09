import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCoachAdvice } from "@/lib/agents/coach";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.CEREBRAS_API_KEY) {
    return NextResponse.json(
      { error: "CEREBRAS_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let advice;
  try {
    advice = await getCoachAdvice({ userId: session.user.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Coach failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  await prisma.recommendation.create({
    data: {
      userId: session.user.id,
      payload: JSON.stringify(advice),
    },
  });

  return NextResponse.json({ advice });
}
