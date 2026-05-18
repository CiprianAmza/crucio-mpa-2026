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
  Check,
  Mail,
  Tag,
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

      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-rose-500/40 text-rose-300 mb-4">
            <Tag className="h-3 w-3 mr-1" />
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free during testing.{" "}
            <span className="text-rose-400">Pick your tier when you scale.</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Start free, no credit card. Upgrade if you want unlimited reps + the Coach agent.
            Companies and universities have dedicated tiers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* FREE */}
          <Card className="border-white/10 bg-black/30 flex flex-col hover:border-rose-500/30 transition">
            <CardHeader>
              <div className="text-xs uppercase tracking-wider text-rose-300">Free</div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                €0
                <span className="text-sm text-muted-foreground font-normal ml-1">/ forever</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Perfect for trying it out.</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-2 text-sm mb-6 flex-1">
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> 5 evaluations / day</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Full per-rubric feedback</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Public ELO leaderboard</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Voice + text input</li>
              </ul>
              <Link href={session ? "/problems" : "/signup"}>
                <Button variant="outline" className="w-full">
                  {session ? "Open dojo" : "Start free"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* PRO — featured */}
          <Card className="border-rose-500/50 bg-gradient-to-br from-rose-900/30 to-black flex flex-col relative shadow-lg shadow-rose-900/20">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 hover:bg-rose-600 border-0">
              Most popular
            </Badge>
            <CardHeader>
              <div className="text-xs uppercase tracking-wider text-rose-300">Pro</div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                €9.99
                <span className="text-sm text-muted-foreground font-normal ml-1">/ month</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">For serious interview prep.</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-2 text-sm mb-6 flex-1">
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Unlimited evaluations</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> <strong>Coach agent</strong> — personalised plan</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Full ELO history + export</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Priority on new features</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Email support</li>
              </ul>
              <Link href={session ? "/problems?upgrade=pro" : "/signup?tier=pro"}>
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* B2B */}
          <Card className="border-white/10 bg-black/30 flex flex-col hover:border-rose-500/30 transition">
            <CardHeader>
              <div className="text-xs uppercase tracking-wider text-rose-300">B2B Screening</div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                €499
                <span className="text-sm text-muted-foreground font-normal ml-1">/ seat / mo</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">For recruiting teams.</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-2 text-sm mb-6 flex-1">
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Recruiter dashboard</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Custom rubrics per role</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Async candidate links</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> ATS integration (Greenhouse, Lever)</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> SLA & dedicated support</li>
              </ul>
              <a href="mailto:sales@crucio.dev?subject=B2B%20Screening%20enquiry&body=Hi%20Crucio%20team%2C%20I%27d%20like%20to%20learn%20more%20about%20the%20B2B%20Screening%20tier.">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-1" />
                  Contact sales
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* UNIVERSITY */}
          <Card className="border-white/10 bg-black/30 flex flex-col hover:border-rose-500/30 transition">
            <CardHeader>
              <div className="text-xs uppercase tracking-wider text-rose-300">University</div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                €3,000
                <span className="text-sm text-muted-foreground font-normal ml-1">/ year</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">For institutions & bootcamps.</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-2 text-sm mb-6 flex-1">
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Unlimited student seats</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Cohort analytics</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> SSO (Google, Microsoft)</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Custom problem packs</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> On-site training day</li>
              </ul>
              <a href="mailto:partnerships@crucio.dev?subject=University%20license%20enquiry&body=Hi%20Crucio%20team%2C%20I%20represent%20a%20university%20%2F%20bootcamp%20and%20want%20to%20learn%20about%20institutional%20licensing.">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-1" />
                  Talk to us
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <p className="text-center mt-8 text-xs text-muted-foreground">
          All tiers include voice input, ELO leaderboard, and AI evaluation with per-criterion feedback.
          Pricing in EUR · VAT not included · Paid tiers launch Q3 2026.
        </p>
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
