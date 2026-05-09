import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoachPanel } from "@/components/coach-panel";
import { Trophy, Target, Sparkles } from "lucide-react";

function difficultyLabel(d: number) {
  return ["", "Easy", "Easy+", "Medium", "Hard", "Brutal"][d] ?? "?";
}

export default async function ProblemsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/problems");
  }

  const [user, problems, solvedRows] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, eloRating: true },
    }),
    prisma.problem.findMany({
      orderBy: [{ difficulty: "asc" }, { title: "asc" }],
      include: { topics: { include: { topic: true } } },
    }),
    prisma.submission.groupBy({
      by: ["problemId"],
      where: { userId: session.user.id },
      _max: { score: true },
    }),
  ]);

  const bestByProblem = new Map<string, number>();
  for (const r of solvedRows) {
    if (r._max.score !== null) bestByProblem.set(r.problemId, r._max.score);
  }

  return (
    <div className="container mx-auto px-4 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pick your crucible</h1>
            <p className="text-muted-foreground mt-1">
              {problems.length} Java interview problems waiting to be conquered.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-rose-400" />
            <span className="font-mono">ELO {user?.eloRating ?? 1200}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p) => {
            const best = bestByProblem.get(p.id);
            return (
              <Link key={p.id} href={`/problems/${p.slug}`}>
                <Card className="hover:border-rose-500/40 transition border-white/10 bg-black/30 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{p.title}</CardTitle>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        <Target className="h-3 w-3 mr-1" />
                        {difficultyLabel(p.difficulty)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{p.prompt}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.topics.map((t) => (
                        <Badge key={t.topicId} variant="secondary" className="text-xs">
                          {t.topic.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">
                        Base ELO {p.baseElo}
                      </span>
                      {best !== undefined ? (
                        <span className="text-rose-300 font-mono">
                          Best: {best.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Untouched</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="space-y-4">
        <Card className="border-white/10 bg-gradient-to-br from-rose-900/20 to-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-rose-400" />
              Coach Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CoachPanel />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/30">
          <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">How it works.</strong> Pick a problem,
              type or speak your answer, submit. The Evaluator agent grades it 0–10,000
              against the rubric. Your ELO moves up or down.
            </p>
            <Link href="/leaderboard">
              <Button variant="outline" size="sm" className="mt-2">
                <Trophy className="h-4 w-4 mr-2" />
                Open leaderboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
