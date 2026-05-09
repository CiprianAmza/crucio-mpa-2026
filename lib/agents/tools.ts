import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const evaluatorTools = {
  getProblemRubric: tool({
    description:
      "Fetch the rubric (criteria, key concepts, red flags) for a problem. Always call this once before scoring an answer.",
    inputSchema: z.object({
      problemId: z.string().describe("Problem id"),
    }),
    execute: async ({ problemId }) => {
      const p = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { id: true, title: true, prompt: true, rubric: true, difficulty: true },
      });
      if (!p) return { error: "Problem not found" };
      let rubric: unknown = null;
      try {
        rubric = JSON.parse(p.rubric);
      } catch {
        rubric = p.rubric;
      }
      return {
        id: p.id,
        title: p.title,
        prompt: p.prompt,
        difficulty: p.difficulty,
        rubric,
      };
    },
  }),

  searchUserPriorAnswers: tool({
    description:
      "Look at this user's recent submissions on the same topic to spot patterns (e.g. always weak on a subtopic).",
    inputSchema: z.object({
      userId: z.string(),
      problemId: z.string(),
      limit: z.number().min(1).max(10).default(3),
    }),
    execute: async ({ userId, problemId, limit }) => {
      const target = await prisma.problem.findUnique({
        where: { id: problemId },
        include: { topics: { include: { topic: true } } },
      });
      if (!target) return [];
      const topicIds = target.topics.map((t) => t.topicId);
      const subs = await prisma.submission.findMany({
        where: {
          userId,
          problem: { topics: { some: { topicId: { in: topicIds } } } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          score: true,
          createdAt: true,
          problem: { select: { title: true, slug: true } },
        },
      });
      return subs.map((s) => ({
        score: s.score,
        problemTitle: s.problem.title,
        when: s.createdAt.toISOString(),
      }));
    },
  }),
};

export const coachTools = {
  getUserProgress: tool({
    description: "Get the user's overall stats and recent performance summary.",
    inputSchema: z.object({ userId: z.string() }),
    execute: async ({ userId }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, eloRating: true, createdAt: true },
      });
      if (!user) return { error: "User not found" };
      const totalSubs = await prisma.submission.count({ where: { userId } });
      const recent = await prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          score: true,
          createdAt: true,
          eloDelta: true,
          problem: {
            select: {
              title: true,
              slug: true,
              difficulty: true,
              topics: { include: { topic: true } },
            },
          },
        },
      });
      return {
        elo: user.eloRating,
        totalSubmissions: totalSubs,
        recent: recent.map((r) => ({
          title: r.problem.title,
          slug: r.problem.slug,
          difficulty: r.problem.difficulty,
          score: r.score,
          eloDelta: r.eloDelta,
          topics: r.problem.topics.map((t) => t.topic.slug),
          when: r.createdAt.toISOString(),
        })),
      };
    },
  }),

  identifyWeakTopics: tool({
    description:
      "Compute the user's weakest topics — those with the lowest average score across recent submissions.",
    inputSchema: z.object({
      userId: z.string(),
      minSubmissionsPerTopic: z.number().min(1).default(1),
    }),
    execute: async ({ userId, minSubmissionsPerTopic }) => {
      const subs = await prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          score: true,
          problem: {
            select: { topics: { include: { topic: true } } },
          },
        },
      });
      const byTopic = new Map<string, { name: string; total: number; count: number }>();
      for (const s of subs) {
        for (const pt of s.problem.topics) {
          const key = pt.topic.slug;
          const cur = byTopic.get(key) ?? { name: pt.topic.name, total: 0, count: 0 };
          cur.total += s.score;
          cur.count += 1;
          byTopic.set(key, cur);
        }
      }
      const ranked = Array.from(byTopic.entries())
        .filter(([, v]) => v.count >= minSubmissionsPerTopic)
        .map(([slug, v]) => ({
          topicSlug: slug,
          topicName: v.name,
          avgScore: Math.round(v.total / v.count),
          attempts: v.count,
        }))
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 5);
      return ranked;
    },
  }),

  recommendNextProblems: tool({
    description:
      "Suggest up to 3 problems the user has NOT solved yet, optionally filtered by topic slug.",
    inputSchema: z.object({
      userId: z.string(),
      topicSlugs: z.array(z.string()).optional(),
      count: z.number().min(1).max(5).default(3),
    }),
    execute: async ({ userId, topicSlugs, count }) => {
      const solved = await prisma.submission.findMany({
        where: { userId },
        select: { problemId: true },
      });
      const solvedIds = solved.map((s) => s.problemId);
      const where: Record<string, unknown> = {
        id: { notIn: solvedIds.length ? solvedIds : ["__none__"] },
      };
      if (topicSlugs && topicSlugs.length > 0) {
        where.topics = {
          some: { topic: { slug: { in: topicSlugs } } },
        };
      }
      const probs = await prisma.problem.findMany({
        where,
        take: count,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          baseElo: true,
          topics: { include: { topic: true } },
        },
        orderBy: { baseElo: "asc" },
      });
      return probs.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        baseElo: p.baseElo,
        topics: p.topics.map((t) => t.topic.slug),
      }));
    },
  }),
};
