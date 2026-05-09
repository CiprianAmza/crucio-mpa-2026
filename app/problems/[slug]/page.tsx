import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProblemSolver } from "@/components/problem-solver";
import { SubmissionDetailDialog } from "@/components/submission-detail-dialog";
import { Target, ChevronRight } from "lucide-react";

function difficultyLabel(d: number) {
  return ["", "Easy", "Easy+", "Medium", "Hard", "Brutal"][d] ?? "?";
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/problems/${slug}`);
  }

  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: { topics: { include: { topic: true } } },
  });
  if (!problem) notFound();

  const previous = await prisma.submission.findMany({
    where: { userId: session.user.id, problemId: problem.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      score: true,
      eloDelta: true,
      isVoice: true,
      answerText: true,
      feedback: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {problem.topics.map((t) => (
              <Badge key={t.topicId} variant="secondary" className="text-xs">
                {t.topic.name}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {problem.title}
          </h1>
        </div>
        <Badge variant="outline" className="whitespace-nowrap">
          <Target className="h-3 w-3 mr-1" />
          {difficultyLabel(problem.difficulty)} · base {problem.baseElo}
        </Badge>
      </div>

      <Card className="border-white/10 bg-black/30 mb-6">
        <CardHeader>
          <CardTitle className="text-base">The question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {problem.prompt}
          </p>
        </CardContent>
      </Card>

      <ProblemSolver problemId={problem.id} />

      {previous.length > 0 && (
        <Card className="border-white/10 bg-black/30 mt-8">
          <CardHeader>
            <CardTitle className="text-base">Your recent attempts</CardTitle>
            <p className="text-xs text-muted-foreground">Click any attempt to see your answer + feedback.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {previous.map((s) => (
                <li key={s.id}>
                  <SubmissionDetailDialog
                    submission={{ ...s, problemTitle: problem.title }}
                    trigger={
                      <button
                        type="button"
                        className="w-full flex justify-between items-center gap-2 font-mono text-xs px-2 py-2 rounded hover:bg-white/5 transition text-left"
                      >
                        <span className="text-muted-foreground">
                          {new Date(s.createdAt).toLocaleString()}
                          {s.isVoice ? " · voice" : " · text"}
                        </span>
                        <span className="flex items-center gap-2">
                          Score{" "}
                          <span className="text-rose-300">{s.score.toLocaleString()}</span>
                          {" · "}
                          ELO{" "}
                          <span className={s.eloDelta >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {s.eloDelta >= 0 ? "+" : ""}
                            {s.eloDelta}
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </button>
                    }
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
