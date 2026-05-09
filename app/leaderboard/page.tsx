import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown } from "lucide-react";

export default async function LeaderboardPage() {
  const session = await auth();
  const meId = session?.user?.id;

  const top = await prisma.user.findMany({
    orderBy: [{ eloRating: "desc" }, { createdAt: "asc" }],
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      eloRating: true,
      _count: { select: { submissions: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-rose-400" />
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      </div>

      <Card className="border-white/10 bg-black/30">
        <CardHeader>
          <CardTitle className="text-base">Top crucifiers</CardTitle>
        </CardHeader>
        <CardContent>
          {top.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No one has submitted yet. Be the first.
            </p>
          ) : (
            <ol className="space-y-1">
              {top.map((u, i) => {
                const isMe = u.id === meId;
                const display = u.name || (u.email ? u.email.split("@")[0] : "anon");
                return (
                  <li
                    key={u.id}
                    className={`flex items-center justify-between py-2 px-3 rounded-md font-mono text-sm ${
                      isMe ? "bg-rose-900/20 border border-rose-500/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-right text-muted-foreground">
                        {i + 1}
                      </span>
                      {i === 0 && <Crown className="h-4 w-4 text-yellow-400" />}
                      <span className={isMe ? "text-rose-300" : ""}>{display}</span>
                      {isMe && <Badge variant="outline" className="text-xs">you</Badge>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground text-xs">
                        {u._count.submissions} subs
                      </span>
                      <span className="text-rose-300 font-bold">{u.eloRating}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
