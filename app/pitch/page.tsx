import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoderBoy } from "@/components/illustration-coder-boy";
import { CoderGirl } from "@/components/illustration-coder-girl";
import {
  Sparkles,
  ArrowDown,
  ArrowLeft,
  Mic,
  Bot,
  BrainCircuit,
  Target,
  Rocket,
  Users,
  TrendingUp,
  ShieldCheck,
  Code,
  Wand2,
} from "lucide-react";

export const metadata = {
  title: "Crucio — Pitch deck",
  description: "Crucio investor pitch deck.",
};

export default function PitchPage() {
  return (
    <div className="bg-background">
      <div className="fixed top-3 left-3 z-50 flex gap-2 print:hidden">
        <Link href="/">
          <Button size="sm" variant="ghost" className="bg-black/60 backdrop-blur">
            <ArrowLeft className="h-4 w-4 mr-1" /> Home
          </Button>
        </Link>
        <Link href="/business-foundation">
          <Button size="sm" variant="ghost" className="bg-black/60 backdrop-blur">
            Business Foundation
          </Button>
        </Link>
      </div>

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <Slide bg="from-rose-950 via-black to-black">
          <div className="text-center">
            <div className="flex justify-center gap-8 mb-8 opacity-90">
              <CoderBoy className="w-32 h-auto animate-float-slow" />
              <CoderGirl className="w-32 h-auto animate-float-slower" />
            </div>
            <Badge variant="outline" className="border-rose-500/40 text-rose-300 mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              MPA 2026 — Pitch deck
            </Badge>
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight">
              <span className="text-rose-500">Crucio</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground italic mt-4">
              crucify the interview
            </p>
            <p className="text-sm text-muted-foreground mt-12 uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
          <SlideHint />
        </Slide>

        <Slide bg="from-black via-rose-950/40 to-black">
          <div className="max-w-4xl">
            <SlideEyebrow icon={Target} label="The problem" />
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Interview prep is{" "}
              <span className="text-rose-400">training the wrong skill</span>.
            </h2>
            <p className="mt-8 text-xl md:text-2xl text-muted-foreground">
              People grind LeetCode for months, then walk into a real screen and freeze
              the moment a senior asks{" "}
              <em className="text-foreground">&ldquo;explain how the JVM garbage collector
              works&rdquo;</em>.
            </p>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              The gap is real — and it&apos;s costing candidates jobs and companies
              great hires.
            </p>
          </div>
        </Slide>

        <Slide bg="from-black via-rose-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={Sparkles} label="Why now" />
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <Stat number="73%" label="of senior engineering interviews are conceptual / verbal, not algorithmic" />
              <Stat number="3.4M" label="active monthly users on LeetCode — the wrong tool for most of those interviews" />
              <Stat number="2025" label="the year LLMs became smart enough to grade free-text technical reasoning" />
            </div>
            <p className="mt-12 text-xl md:text-2xl text-muted-foreground max-w-3xl">
              Two years ago, agentic AI couldn&apos;t score nuanced answers. Today it can —
              and the interview-prep market hasn&apos;t adapted yet.
            </p>
          </div>
        </Slide>

        <Slide bg="from-rose-900/30 via-black to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={Wand2} label="Our solution" />
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Two AI agents that interview you{" "}
              <span className="text-rose-400">like a real engineer would</span>.
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Feature
                icon={BrainCircuit}
                title="Free-text grading"
                desc="Type your answer. The Evaluator agent grades it 0-10,000 against a rubric — no multiple choice, no hidden tests."
              />
              <Feature
                icon={Mic}
                title="Speak it"
                desc="Press the mic and explain it like a screening call. Voice-first reps that actually transfer to the real thing."
              />
              <Feature
                icon={Bot}
                title="Personal Coach"
                desc="A second agent looks at your history, finds your weakest topics, and tells you exactly what to attack next."
              />
            </div>
          </div>
        </Slide>

        <Slide bg="from-black via-purple-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={Bot} label="How it works" />
            <div className="space-y-6">
              <Step n="1" title="Pick a problem" desc="15 curated Java questions across SOLID, JVM, concurrency, Spring, design patterns. Each has a hand-authored rubric." />
              <Step n="2" title="Answer free-text or voice" desc="Type or hit the mic. Web Speech API transcribes locally — no API key, no cost." />
              <Step n="3" title="Evaluator scores you" desc="Tool-using agent fetches the rubric, optionally inspects your prior submissions, returns score + per-criterion breakdown + study hints." />
              <Step n="4" title="ELO + leaderboard" desc="Your rating moves up or down. Climb the ranks against other engineers prepping for the same companies." />
              <Step n="5" title="Coach plans your next session" desc="Tool-using agent identifies weak topics, recommends 3 unsolved problems, gives you a 30-minute concrete plan." />
            </div>
          </div>
        </Slide>

        <Slide bg="from-black via-rose-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={TrendingUp} label="Market" />
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <Stat number="$3.2B" label="global technical-recruiting / interview-prep market (2025)" />
              <Stat number="14%" label="annual growth in AI-augmented edtech (Gartner, 2025)" />
              <Stat number="800K+" label="bootcamp + new-CS-grad job seekers per year, EU + NA combined" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mt-12">Reachable bands:</h3>
            <ul className="mt-4 space-y-2 text-lg text-muted-foreground">
              <li>👉 <strong className="text-foreground">B2C engineers (TAM 4M+)</strong>: anyone preparing for tech interviews</li>
              <li>👉 <strong className="text-foreground">B2B candidate screening (SAM €240M)</strong>: companies tired of leaked LeetCode questions</li>
              <li>👉 <strong className="text-foreground">University & bootcamps (SOM €18M)</strong>: institutional licenses</li>
            </ul>
          </div>
        </Slide>

        <Slide bg="from-black via-rose-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={ShieldCheck} label="Competition" />
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-3">Capability</th>
                    <th className="p-3 text-rose-300">Crucio</th>
                    <th className="p-3">LeetCode</th>
                    <th className="p-3">Pramp</th>
                    <th className="p-3">Educative</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Algorithm puzzles + tests", "—", "✓", "—", "✓"],
                    ["Free-text reasoning grading", "✓", "—", "—", "—"],
                    ["Voice-based answers", "✓", "—", "✓ peer", "—"],
                    ["Per-rubric scoring", "✓", "—", "—", "—"],
                    ["Personal Coach agent", "✓", "—", "—", "—"],
                    ["Free during testing", "✓", "limited", "✓", "—"],
                  ].map(([cap, cru, lc, pr, ed]) => (
                    <tr key={cap} className="border-b border-white/5">
                      <td className="p-3 text-foreground">{cap}</td>
                      <td className="p-3 font-bold text-rose-300">{cru}</td>
                      <td className="p-3">{lc}</td>
                      <td className="p-3">{pr}</td>
                      <td className="p-3">{ed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-xl text-muted-foreground">
              <span className="text-rose-300 font-semibold">Differentiator:</span> we&apos;re
              the only platform that grades how you <em>explain</em>, not just how you
              code.
            </p>
          </div>
        </Slide>

        <Slide bg="from-black via-purple-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={TrendingUp} label="Business model" />
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <PriceCard
                tier="Free"
                price="€0"
                features={["5 evaluations/day", "Full rubric feedback", "Public leaderboard"]}
              />
              <PriceCard
                tier="Pro"
                price="€9.99/mo"
                accent
                features={["Unlimited evaluations", "Coach agent", "Voice mode", "History export", "ELO history"]}
              />
              <PriceCard
                tier="B2B Screening"
                price="€499/mo / seat"
                features={["Recruiter dashboard", "Custom rubrics", "Async candidate links", "ATS integration"]}
              />
              <PriceCard
                tier="University / Bootcamp"
                price="€3K / yr"
                features={["Unlimited student seats", "Cohort analytics", "SSO", "Custom problem packs"]}
              />
            </div>
          </div>
        </Slide>

        <Slide bg="from-rose-950/30 via-black to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={Rocket} label="Traction & roadmap" />
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-rose-300">Today (April 2026)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ MVP live with 15 Java problems + rubrics</li>
                  <li>✓ Two agents (Evaluator + Coach) using Gemini 2.5 Flash</li>
                  <li>✓ Voice input via Web Speech API</li>
                  <li>✓ ELO + leaderboard + profile</li>
                  <li>✓ 100% free for testing tier</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-rose-300">Next 6 months</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>→ 200 problems across Java, Python, Kotlin</li>
                  <li>→ System design + behavioral tracks</li>
                  <li>→ Whisper-based voice (multi-language)</li>
                  <li>→ B2B alpha with 3 design partners</li>
                  <li>→ Romanian universities pilot</li>
                  <li>→ Stripe + Pro tier launch</li>
                </ul>
              </div>
            </div>
          </div>
        </Slide>

        <Slide bg="from-black via-rose-950/30 to-black">
          <div className="max-w-5xl">
            <SlideEyebrow icon={Users} label="Team" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <TeamCard role="Founder / AI Lead" focus="Agent design, prompt engineering, rubric quality. Owns the moat." />
              <TeamCard role="Full-stack Engineer" focus="Next.js, Prisma, Auth, API. Owns reliability." />
              <TeamCard role="Frontend / UX" focus="Tailwind, voice UI, motion. Owns the &quot;feels real&quot; bar." />
              <TeamCard role="Java SME" focus="Rubric authoring, problem curation, ground-truth answers." />
              <TeamCard role="GTM / Marketing" focus="Reddit content, university partnerships, B2B outbound." />
              <TeamCard role="Advisor (TBD)" focus="Senior interviewer at FAANG-tier, signs off on rubrics." />
            </div>
          </div>
        </Slide>

        <Slide bg="from-rose-950 via-black to-black">
          <div className="max-w-4xl text-center">
            <SlideEyebrow icon={Code} label="The ask" centered />
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="text-rose-400">€80K pre-seed</span>
            </h2>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              for 12 months of runway: content authoring, B2B GTM, infra scale-up.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-12 text-left">
              <UseOfFunds pct="35%" label="Content & rubric quality" />
              <UseOfFunds pct="40%" label="Engineering & scale" />
              <UseOfFunds pct="25%" label="GTM & B2B sales" />
            </div>
            <p className="mt-12 text-lg text-muted-foreground">
              Or: <span className="text-rose-300 font-semibold">10K signed-up users</span>{" "}
              by end of Q3 — your testimonial gets us there.
            </p>
          </div>
        </Slide>

        <Slide bg="from-rose-700 via-rose-950 to-black">
          <div className="text-center">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight">
              Crucify <span className="text-emerald-300">your</span> next interview.
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground">
              Free during testing. No credit card.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg">
                  Start free
                </Button>
              </Link>
              <Link href="/business-foundation">
                <Button size="lg" variant="outline" className="text-lg">
                  Read the business foundation
                </Button>
              </Link>
            </div>
            <p className="mt-16 text-sm text-muted-foreground">
              <span className="text-rose-300">Crucio</span> · Bucharest · 2026
            </p>
          </div>
        </Slide>
      </div>
    </div>
  );
}

function Slide({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`snap-start h-screen flex items-center justify-center px-6 md:px-12 bg-gradient-to-br ${bg} relative`}
    >
      <div className="w-full">{children}</div>
    </section>
  );
}

function SlideHint() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground animate-bounce">
      <ArrowDown className="h-3 w-3" />
      Scroll
    </div>
  );
}

function SlideEyebrow({
  icon: Icon,
  label,
  centered,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  centered?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 mb-6 ${centered ? "justify-center" : ""}`}>
      <Icon className="h-4 w-4 text-rose-400" />
      <span className="text-xs uppercase tracking-widest text-rose-300">{label}</span>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border border-white/10 rounded-xl bg-black/40 p-6">
      <div className="text-4xl md:text-5xl font-bold text-rose-300">{number}</div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="border border-white/10 rounded-xl bg-black/40 p-6">
      <Icon className="h-8 w-8 text-rose-400 mb-3" />
      <div className="font-bold text-lg">{title}</div>
      <p className="text-sm text-muted-foreground mt-2">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="text-4xl md:text-5xl font-extrabold text-rose-500/70 leading-none w-12 shrink-0">
        {n}
      </div>
      <div>
        <div className="text-xl md:text-2xl font-bold">{title}</div>
        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}

function PriceCard({
  tier,
  price,
  features,
  accent,
}: {
  tier: string;
  price: string;
  features: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-6 ${
        accent
          ? "border-rose-500/50 bg-gradient-to-br from-rose-900/30 to-black"
          : "border-white/10 bg-black/40"
      }`}
    >
      <div className="text-sm uppercase tracking-wider text-rose-300">{tier}</div>
      <div className="text-3xl font-extrabold mt-1">{price}</div>
      <ul className="mt-3 text-sm text-muted-foreground space-y-1">
        {features.map((f) => (
          <li key={f}>· {f}</li>
        ))}
      </ul>
    </div>
  );
}

function TeamCard({ role, focus }: { role: string; focus: string }) {
  return (
    <div className="border border-white/10 rounded-xl bg-black/40 p-4">
      <div className="font-semibold text-rose-300">{role}</div>
      <p className="text-sm text-muted-foreground mt-1">{focus}</p>
    </div>
  );
}

function UseOfFunds({ pct, label }: { pct: string; label: string }) {
  return (
    <div className="border border-white/10 rounded-xl bg-black/40 p-4">
      <div className="text-3xl font-extrabold text-rose-300">{pct}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
