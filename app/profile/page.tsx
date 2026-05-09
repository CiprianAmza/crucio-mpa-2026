import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmissionDetailRow } from "@/components/submission-detail-dialog";
import { Trophy, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      eloRating: true,
      createdAt: true,
    },
  });
  if (!user) redirect("/login");

  const [submissions, allUsers] = await Promise.all([
    prisma.submission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { problem: { select: { title: true, slug: true } } },
    }),
    prisma.user.findMany({
      orderBy: { eloRating: "desc" },
      select: { id: true },
    }),
  ]);

  const rank = allUsers.findIndex((u) => u.id === user.id) + 1;
  const totalSubs = submissions.length;
  const avg = totalSubs
    ? Math.round(submissions.reduce((s, x) => s + x.score, 0) / totalSubs)
    : 0;
  const best = totalSubs ? Math.max(...submissions.map((s) => s.score)) : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-1">
        {user.name || user.email}
      </h1>
      <p className="text-muted-foreground text-sm flex items-center gap-2">
        <Calendar className="h-4 w-4" /> Joined {user.createdAt.toLocaleDateString()}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Card className="border-white/10 bg-black/30">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground uppercase">ELO</div>
            <div className="text-2xl font-bold text-rose-300 font-mono">{user.eloRating}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/30">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground uppercase">Rank</div>
            <div className="text-2xl font-bold font-mono">#{rank}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/30">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground uppercase">Best score</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {best.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/30">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground uppercase">Avg (last 20)</div>
            <div className="text-2xl font-bold font-mono">{avg.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/30 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-rose-400" />
            Recent submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You haven&apos;t crucified anything yet.{" "}
              <Link href="/problems" className="text-rose-300 hover:underline">
                Pick a problem
              </Link>.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                Click a submission to see your answer + AI feedback.
              </p>
              <ul className="divide-y divide-white/5">
                {submissions.map((s) => (
                  <li key={s.id}>
                    <SubmissionDetailRow
                      submission={{ ...s, problemTitle: s.problem.title }}
                      className="w-full py-3 px-2 flex items-center justify-between text-sm rounded hover:bg-white/5 transition text-left"
                    >
                      <span className="block">
                        <span className="font-medium">{s.problem.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {new Date(s.createdAt).toLocaleString()}
                          {s.isVoice && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              voice
                            </Badge>
                          )}
                        </span>
                      </span>
                      <span className="text-right font-mono text-xs block">
                        <span className="text-rose-300 font-bold block">
                          {s.score.toLocaleString()}
                        </span>
                        <span
                          className={
                            "block " +
                            (s.eloDelta >= 0 ? "text-emerald-400" : "text-red-400")
                          }
                        >
                          {s.eloDelta >= 0 ? "+" : ""}
                          {s.eloDelta} ELO
                        </span>
                      </span>
                    </SubmissionDetailRow>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
