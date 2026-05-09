import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { WandIntro } from "@/components/wand-intro";
import { CoderBoy } from "@/components/illustration-coder-boy";
import { CoderGirl } from "@/components/illustration-coder-girl";
import {
  ArrowRight,
  BrainCircuit,
  Mic,
  Trophy,
  Sparkles,
  Bot,
  Flame,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative isolate overflow-hidden">
      <WandIntro />

      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-700 to-purple-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 items-center">
          <div className="hidden lg:flex justify-center animate-float-slow">
            <CoderBoy className="w-56 h-auto drop-shadow-[0_10px_30px_rgba(244,63,94,0.25)]" />
          </div>

          <div className="text-center order-first lg:order-none">
            <Badge variant="outline" className="mb-6 border-rose-500/40 text-rose-300">
              <Sparkles className="h-3 w-3 mr-1" />
              MPA 2026 — Agentic AI Startup
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="text-rose-500">Crucio</span>
            </h1>
            <p className="mt-3 text-xl md:text-2xl text-muted-foreground italic">
              crucify the interview
            </p>
            <p className="mt-8 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              Free-text Java interview prep that actually feels like a real interview.
              Type your answer, or speak it. Two AI agents read it, score it on a 0–10,000
              rubric, then coach you on what to study next.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={session ? "/problems" : "/signup"}>
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  {session ? "Open the dojo" : "Start free"}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="lg" variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  See the leaderboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-float-slower">
            <CoderGirl className="w-56 h-auto drop-shadow-[0_10px_30px_rgba(168,85,247,0.3)]" />
          </div>

          <div className="lg:hidden flex justify-center gap-6">
            <CoderBoy className="w-32 h-auto" />
            <CoderGirl className="w-32 h-auto" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        <Card className="border-white/10 bg-black/30">
          <CardHeader>
            <BrainCircuit className="h-8 w-8 text-rose-400 mb-2" />
            <CardTitle>Free-text scoring</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            No multiple choice. No unit tests. An AI evaluator agent grades your
            actual reasoning against a per-problem rubric, with feedback you can act on.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/30">
          <CardHeader>
            <Mic className="h-8 w-8 text-rose-400 mb-2" />
            <CardTitle>Speak your answer</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Press the mic and explain it like a real screening call. The browser
            transcribes locally — your interview reps now feel like the real thing.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/30">
          <CardHeader>
            <Trophy className="h-8 w-8 text-rose-400 mb-2" />
            <CardTitle>ELO leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Win streaks, climb the ranks, prove you&apos;re not just memorizing —
            you&apos;re explaining. Coach agent recommends what to attack next.
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <Badge className="bg-rose-600/20 text-rose-300 border-rose-500/40 mb-4">
            <Bot className="h-3 w-3 mr-1" /> Two agents under the hood
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Evaluator + Coach. Working together.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The <span className="text-rose-300">Evaluator</span> reads your answer
            against a rubric, computes a score from 0 to 10,000, and breaks down
            strengths and gaps. The <span className="text-rose-300">Coach</span>
            looks at your history, finds your weakest topics, and proposes the
            next problem to crucify.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><Flame className="h-4 w-4 text-rose-400 mt-0.5" /> Tool-using agents (Vercel AI SDK + Gemini)</li>
            <li className="flex gap-2"><Flame className="h-4 w-4 text-rose-400 mt-0.5" /> Per-problem rubric: SOLID, JVM, concurrency, Spring…</li>
            <li className="flex gap-2"><Flame className="h-4 w-4 text-rose-400 mt-0.5" /> Voice-first interface — practice talking it through</li>
          </ul>
        </div>
        <Card className="border-white/10 bg-gradient-to-br from-rose-900/20 to-black">
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-rose-300">Sample question</div>
              <div className="font-semibold mt-1">Explain the SOLID principles</div>
            </div>
            <div className="bg-black/40 rounded-md p-3 font-mono text-xs text-muted-foreground">
              <div>Score: <span className="text-rose-300">8,420 / 10,000</span></div>
              <div>Coverage: 5/5 ✓</div>
              <div>Examples: 4/5 (LSP example fuzzy)</div>
              <div>Trade-offs: strong</div>
              <div className="text-rose-300 mt-2">→ Coach suggests: &ldquo;Open/Closed Principle deep dive&rdquo;</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-24 text-center">
        <h3 className="text-2xl md:text-3xl font-bold">Ready to crucify your next interview?</h3>
        <p className="mt-3 text-muted-foreground">Free during testing. No credit card.</p>
        <Link href={session ? "/problems" : "/signup"} className="inline-block mt-6">
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
            {session ? "Solve a problem" : "Create your account"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
