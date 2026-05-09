import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Download } from "lucide-react";

export const metadata = {
  title: "Crucio — Business Foundation",
  description: "Crucio business foundation document for MPA 2026.",
};

export default function BusinessFoundationPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl prose prose-invert prose-headings:tracking-tight">
      <div className="mb-8 not-prose flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Badge variant="outline" className="border-rose-500/40 text-rose-300">
          <Sparkles className="h-3 w-3 mr-1" /> MPA 2026 deliverable · Business Foundation
        </Badge>
      </div>

      <header className="not-prose mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-rose-500">Crucio</span>
        </h1>
        <p className="text-xl text-muted-foreground italic mt-2">crucify the interview</p>
        <p className="text-sm text-muted-foreground mt-3">
          Business Foundation v1.0 · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </p>
      </header>

      <Section title="1 · Motivation — the why">
        <p>
          Technical interviews are broken. Candidates spend months grinding multiple-choice
          and unit-tested algorithm puzzles on platforms like LeetCode, then walk into a
          real screen and freeze the moment the interviewer asks
          <em> &quot;tell me how garbage collection works in the JVM&quot;</em>. The skill those
          platforms train — pattern-matching toy problems against a hidden test
          oracle — is not the skill that gets you hired. The skill that gets you hired is
          <strong> explaining concepts clearly, out loud, under pressure</strong>.
        </p>
        <p>
          Crucio exists to close that gap. We grade <strong>free-text</strong> answers
          (and voice transcripts) with AI agents that follow a real per-question rubric,
          score on 0–10,000, and coach you toward your weakest topics. It feels like a
          real interview, because it is one — minus the human awkwardness, infinitely
          repeatable, free for testing.
        </p>
      </Section>

      <Section title="2 · Summary — the what">
        <p>
          Crucio is an <strong>agentic AI interview-prep platform</strong>. Java first,
          all stacks eventually. Two AI agents power the experience:
        </p>
        <ul>
          <li>
            <strong>Evaluator Agent</strong> — reads your answer, calls a tool to fetch
            the per-question rubric, optionally inspects your prior submissions, and
            returns a structured score with per-criterion breakdown, strengths, gaps and
            study hints.
          </li>
          <li>
            <strong>Coach Agent</strong> — looks at your full submission history, runs
            tools to identify weakest topics and recommends the next problems to attack,
            with concrete reasons and a 30-60 minute study plan.
          </li>
        </ul>
        <p>Core user stories:</p>
        <ul>
          <li>
            <em>As a job-seeker preparing for interviews</em>, I can pick a problem,
            type or speak my answer, and get an honest 0–10,000 score with feedback
            within 15 seconds.
          </li>
          <li>
            <em>As a regular user</em>, my ELO rating reflects my real ability across
            topics, and the leaderboard motivates me to improve.
          </li>
          <li>
            <em>As a struggling user</em>, the Coach tells me exactly what to
            study next — not generic &quot;learn concurrency&quot; advice but
            problem-specific, rubric-driven plans.
          </li>
          <li>
            <em>As a recruiter (future B2B tier)</em>, I can send a Crucio link to
            candidates for an asynchronous screening that&apos;s harder to game than a
            multiple-choice quiz.
          </li>
        </ul>
      </Section>

      <Section title="3 · SWOT analysis">
        <div className="not-prose grid md:grid-cols-2 gap-4">
          <SwotCard color="emerald" title="Strengths">
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>True free-text grading; no toy puzzles</li>
              <li>Voice-first, mirrors real screening calls</li>
              <li>Two real agentic flows with tool calling</li>
              <li>Free during testing — Gemini 2.5 Flash + Web Speech API</li>
              <li>Per-rubric scoring is explainable, not a black box</li>
              <li>Vibe-coded in days; small team can iterate fast</li>
            </ul>
          </SwotCard>
          <SwotCard color="rose" title="Weaknesses">
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Cold-start: 15 seeded problems, needs depth</li>
              <li>Voice = English only (Web Speech API limits)</li>
              <li>LLM cost grows with usage; free tier won&apos;t scale</li>
              <li>No mobile app yet</li>
              <li>No persistent identity beyond email/password</li>
              <li>Single-language (Java) at launch</li>
            </ul>
          </SwotCard>
          <SwotCard color="sky" title="Opportunities">
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>$3B+ technical-recruiting prep market</li>
              <li>Voice tech maturing rapidly (Whisper, Gemini Live)</li>
              <li>B2B screening: companies tired of leak-prone leetcode</li>
              <li>Vertical expansions: Python, Kotlin, system design, behavioral</li>
              <li>University CS departments as B2B2C channel</li>
              <li>Bootcamps as referral partners</li>
            </ul>
          </SwotCard>
          <SwotCard color="amber" title="Threats">
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>LeetCode/HackerRank shipping their own AI grading</li>
              <li>OpenAI/Anthropic going direct (&quot;Interview Coach&quot; native)</li>
              <li>Free model APIs getting price hikes</li>
              <li>AI hallucinating wrong feedback — reputation risk</li>
              <li>Candidates using ChatGPT to dictate answers, gaming the score</li>
              <li>EU AI Act compliance for &quot;evaluation of natural persons&quot;</li>
            </ul>
          </SwotCard>
        </div>
      </Section>

      <Section title="4 · Market analysis">
        <p>
          The technical-interview prep market is large, mature, and underwhelming. Players
          fall into three buckets: <strong>algorithm puzzles</strong> (LeetCode,
          HackerRank, AlgoExpert), <strong>peer mock interviews</strong> (Pramp,
          Interviewing.io) and <strong>educational courses</strong> (Educative,
          Coursera). None of them grade free-text technical reasoning the way a real
          interviewer does.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-2">Capability</th>
                <th className="p-2 text-rose-300">Crucio</th>
                <th className="p-2">LeetCode</th>
                <th className="p-2">HackerRank</th>
                <th className="p-2">Pramp</th>
                <th className="p-2">Educative</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <Tr label="Algorithm puzzles w/ unit tests" cru="—" lc="✓" hr="✓" pr="—" ed="✓" />
              <Tr label="Free-text technical Q&amp;A grading" cru="✓" lc="—" hr="—" pr="—" ed="—" />
              <Tr label="Voice-based answers" cru="✓" lc="—" hr="—" pr="✓ peer" ed="—" />
              <Tr label="AI feedback on reasoning" cru="✓" lc="partial" hr="—" pr="—" ed="—" />
              <Tr label="Per-rubric scoring (0–10,000)" cru="✓" lc="—" hr="—" pr="—" ed="—" />
              <Tr label="Personalized coach agent" cru="✓" lc="—" hr="—" pr="—" ed="—" />
              <Tr label="ELO leaderboard" cru="✓" lc="contests only" hr="—" pr="—" ed="—" />
              <Tr label="Free tier with full grading" cru="✓" lc="limited" hr="✓ partial" pr="✓" ed="—" />
              <Tr label="B2B candidate screening" cru="planned" lc="✓" hr="✓" pr="—" ed="—" />
            </tbody>
          </table>
        </div>

        <h4>Differentiator</h4>
        <p>
          We are the only platform that combines <strong>free-text + voice + agentic
          rubric grading</strong>. LeetCode optimizes for &quot;did the test pass?&quot;.
          We optimize for &quot;could you explain it to a senior engineer?&quot; — which
          is the actual interview.
        </p>
      </Section>

      <Section title="5 · Technologies">
        <div className="not-prose grid md:grid-cols-2 gap-4 my-4">
          <TechCard name="Frontend">
            Next.js 16 (App Router, Turbopack), React 19, TypeScript 5,
            Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide icons.
          </TechCard>
          <TechCard name="Backend">
            Next.js Route Handlers (Node runtime), Auth.js v5 (JWT sessions),
            bcryptjs, Zod for validation.
          </TechCard>
          <TechCard name="Database">
            SQLite via better-sqlite3 + Prisma 7 ORM (free, file-based for dev);
            migrate to Postgres on Neon (free tier) for production.
          </TechCard>
          <TechCard name="AI / Agents">
            Vercel AI SDK 6 + Google Gemini 2.5 Flash (free tier: 15 req/min, 1500/day).
            Tool-calling agentic loop with stopCondition. Pluggable provider — swap to
            Claude/GPT in 1 line.
          </TechCard>
          <TechCard name="Voice">
            Web Speech API (browser-native, free, no API key). Future: Whisper /
            Gemini Live for higher fidelity & multi-language.
          </TechCard>
          <TechCard name="Infra & Ops">
            Local dev only at this stage. Deploy targets: Vercel (frontend + edge
            functions), Railway/Fly (DB), GitHub Actions for CI.
          </TechCard>
        </div>
      </Section>

      <Section title="6 · Risks">
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-2">Risk</th>
                <th className="p-2">Type</th>
                <th className="p-2">Impact</th>
                <th className="p-2">Probability</th>
                <th className="p-2">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              <Risk
                risk="LLM hallucinations giving wrong feedback"
                type="Tech"
                impact="High"
                prob="Medium"
                plan="Per-question rubrics anchor scores; flag-low-confidence outputs; human review for outliers; user can dispute → human grader (paid tier)."
              />
              <Risk
                risk="Free Gemini tier hits limit / price hike"
                type="Business"
                impact="High"
                prob="Medium"
                plan="Provider abstraction via AI SDK lets us swap to OpenAI/Anthropic/Groq in 1 line; cache evaluator outputs by (problem, answer hash)."
              />
              <Risk
                risk="Candidates using ChatGPT to game the score"
                type="Product"
                impact="Medium"
                prob="High"
                plan="Voice mode + screen recording for B2B; latency-based heuristics; require live verbal explanation for high-stakes settings."
              />
              <Risk
                risk="Competitor (LeetCode) ships own AI grader"
                type="Business"
                impact="High"
                prob="Medium"
                plan="Build moat via voice + B2B integrations + rubric quality; speed of iteration > brand."
              />
              <Risk
                risk="Voice transcription quality on accented English"
                type="Tech"
                impact="Medium"
                prob="High"
                plan="Allow text fallback; add Whisper API as paid upgrade (better acoustic model)."
              />
              <Risk
                risk="MVP timeline (1 month) too tight"
                type="Project"
                impact="High"
                prob="Medium"
                plan="Vibe-code with AI; weekly MVP scope cuts; Gantt-tracked milestones (see §7)."
              />
              <Risk
                risk="EU AI Act compliance — &quot;evaluation of persons&quot; flagged"
                type="Legal"
                impact="High"
                prob="Low"
                plan="Position as self-improvement / not employment-decision tool; require explicit human-in-the-loop for B2B screening; transparent rubrics."
              />
              <Risk
                risk="Cold start — too few problems to retain users"
                type="Product"
                impact="Medium"
                prob="Medium"
                plan="Auto-generate variations via LLM; community submission of rubrics; aggressive seeding sprint week 2."
              />
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="7 · Planning — team & Gantt">
        <h4>Hypothetical 5-person founding team</h4>
        <ul>
          <li><strong>Founder / AI Lead</strong> — agent design, evaluator/coach prompt engineering, model selection</li>
          <li><strong>Full-stack Engineer</strong> — Next.js, Prisma, Auth, API routes</li>
          <li><strong>Frontend / UX</strong> — Tailwind, shadcn, voice UI, animations, branding</li>
          <li><strong>Content / Java SME</strong> — rubric authoring, problem curation, ground-truth answer keys</li>
          <li><strong>Marketing / GTM</strong> — landing, SEO, pitch, community (Reddit r/cscareerquestions, LinkedIn, university partnerships)</li>
        </ul>

        <h4>Gantt diagram (April 2026 sprint, 4 weeks → MPA presentation)</h4>
        <div className="not-prose">
          <GanttChart />
        </div>
      </Section>

      <Section title="8 · Costs & business model">
        <h4>Cost structure (year 1)</h4>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-2">Category</th>
                <th className="p-2">Year-1 estimate</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">LLM API (Gemini → Claude/GPT at scale)</td><td className="p-2 font-mono">€2,400</td><td className="p-2">Free tier covers ~5K daily evaluations; paid kicks in at scale.</td></tr>
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">Hosting (Vercel Pro + Postgres)</td><td className="p-2 font-mono">€500</td><td className="p-2">Free tier first 6 months, Pro for prod.</td></tr>
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">Domain + email</td><td className="p-2 font-mono">€80</td><td className="p-2">crucio.dev + Google Workspace.</td></tr>
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">Marketing (paid social, content)</td><td className="p-2 font-mono">€3,000</td><td className="p-2">Mostly organic + Reddit/LinkedIn.</td></tr>
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">Tools (analytics, monitoring, design)</td><td className="p-2 font-mono">€600</td><td className="p-2">Posthog free, Sentry free, Figma free.</td></tr>
              <tr className="border-b border-white/5"><td className="p-2 text-foreground">Founders — equity-only y1</td><td className="p-2 font-mono">€0 cash</td><td className="p-2">5 founders, vesting 4y, 1y cliff.</td></tr>
              <tr className="font-semibold"><td className="p-2 text-foreground">Total cash burn y1</td><td className="p-2 font-mono text-rose-300">~€6,580</td><td className="p-2">Lean by design.</td></tr>
            </tbody>
          </table>
        </div>

        <h4>Business model</h4>
        <ul>
          <li>
            <strong>Freemium B2C</strong> — free tier (5 evaluations/day, full rubric).
            <strong> Pro €9.99/mo</strong> = unlimited + Coach + voice mode + history export.
          </li>
          <li>
            <strong>B2B candidate screening</strong> — companies pay <strong>€499/mo per
            seat</strong> to send Crucio links instead of leaked LeetCode problems. Custom
            rubrics, recruiter dashboard, ATS integration.
          </li>
          <li>
            <strong>University & bootcamp licensing</strong> — institutional licenses
            <strong> €3,000/yr</strong> for unlimited student seats.
          </li>
          <li>
            <strong>API access (developer tier)</strong> — integrate the Evaluator agent
            into other LMS/HR tools. €0.05 per evaluation.
          </li>
        </ul>

        <h4>Revenue projection (conservative)</h4>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-2">Quarter</th>
                <th className="p-2">Pro subs</th>
                <th className="p-2">B2B seats</th>
                <th className="p-2">Univ. licenses</th>
                <th className="p-2">MRR</th>
                <th className="p-2">Cumulative</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground font-mono">
              <tr className="border-b border-white/5"><td className="p-2">Q1</td><td className="p-2">25</td><td className="p-2">0</td><td className="p-2">0</td><td className="p-2">€250</td><td className="p-2">€750</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">Q2</td><td className="p-2">120</td><td className="p-2">2</td><td className="p-2">1</td><td className="p-2">€2,448</td><td className="p-2">€8,094</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">Q3</td><td className="p-2">350</td><td className="p-2">8</td><td className="p-2">2</td><td className="p-2">€8,991</td><td className="p-2">€35,067</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">Q4</td><td className="p-2">800</td><td className="p-2">18</td><td className="p-2">4</td><td className="p-2">€18,981</td><td className="p-2">€92,010</td></tr>
            </tbody>
          </table>
        </div>

        <h4>Cost / benefit (ROI &amp; payback)</h4>
        <ul>
          <li><strong>Year-1 revenue:</strong> ~€92K · <strong>Year-1 burn:</strong> ~€6.6K → <strong>net contribution €85K</strong> (before founder salaries).</li>
          <li><strong>Payback period:</strong> ~Q2 (revenue covers burn by month 5).</li>
          <li><strong>ROI year 1:</strong> ~1,290% on cash burn (founder time treated as equity-funded).</li>
          <li><strong>CAC:</strong> targeting &lt;€10 via organic + Reddit content; <strong>LTV:</strong> €60+ for Pro (avg 6 months retention).</li>
        </ul>
      </Section>

      <Section title="9 · Lean canvas (1-page summary)">
        <div className="not-prose">
          <LeanCanvas />
        </div>
      </Section>

      <Section title="10 · AI tooling disclosure">
        <p>
          Per MPA requirement, AI was used extensively in production of this project:
        </p>
        <ul>
          <li>
            <strong>Claude (Sonnet/Opus)</strong> for code generation, architecture
            decisions, and the bulk of this document. Prompts: &quot;Build a Next.js
            interview-prep app with Prisma, Auth.js, two agents…&quot; and iterative
            edits.
          </li>
          <li>
            <strong>Google Gemini 2.5 Flash</strong> as the runtime LLM powering both
            Evaluator and Coach agents.
          </li>
          <li>
            <strong>Vercel AI SDK</strong> for the agentic tool-calling loop.
          </li>
          <li>
            All Java problem rubrics were AI-drafted, then reviewed for technical
            correctness.
          </li>
          <li>
            SVG illustrations on the landing page were hand-coded (not AI-generated)
            in this repo.
          </li>
        </ul>
      </Section>

      <div className="not-prose mt-12 flex flex-wrap gap-3">
        <Link href="/pitch">
          <Button className="bg-rose-600 hover:bg-rose-700">
            View the pitch deck →
          </Button>
        </Link>
        <Link href="/problems">
          <Button variant="outline">Try the MVP</Button>
        </Link>
        <a href="/business-foundation" target="_blank" rel="noopener">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-1" /> Print / save PDF
          </Button>
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function SwotCard({
  color,
  title,
  children,
}: {
  color: "emerald" | "rose" | "sky" | "amber";
  title: string;
  children: React.ReactNode;
}) {
  const colorMap = {
    emerald: "border-emerald-500/40 from-emerald-900/20",
    rose: "border-rose-500/40 from-rose-900/20",
    sky: "border-sky-500/40 from-sky-900/20",
    amber: "border-amber-500/40 from-amber-900/20",
  };
  return (
    <Card className={`bg-gradient-to-br to-black ${colorMap[color]} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TechCard({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Card className="border-white/10 bg-black/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-wider text-rose-300">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

function Tr({
  label,
  cru,
  lc,
  hr,
  pr,
  ed,
}: {
  label: string;
  cru: string;
  lc: string;
  hr: string;
  pr: string;
  ed: string;
}) {
  return (
    <tr className="border-b border-white/5">
      <td className="p-2 text-foreground">{label}</td>
      <td className="p-2 font-bold text-rose-300">{cru}</td>
      <td className="p-2">{lc}</td>
      <td className="p-2">{hr}</td>
      <td className="p-2">{pr}</td>
      <td className="p-2">{ed}</td>
    </tr>
  );
}

function Risk({
  risk,
  type,
  impact,
  prob,
  plan,
}: {
  risk: string;
  type: string;
  impact: string;
  prob: string;
  plan: string;
}) {
  const sev = (s: string) =>
    s === "High" ? "text-red-300" : s === "Medium" ? "text-amber-300" : "text-emerald-300";
  return (
    <tr className="border-b border-white/5 align-top">
      <td className="p-2 text-foreground">{risk}</td>
      <td className="p-2 text-muted-foreground">{type}</td>
      <td className={`p-2 ${sev(impact)}`}>{impact}</td>
      <td className={`p-2 ${sev(prob)}`}>{prob}</td>
      <td className="p-2 text-muted-foreground">{plan}</td>
    </tr>
  );
}

type GanttTask = { name: string; owner: string; weeks: [number, number] };

function GanttChart() {
  const tasks: GanttTask[] = [
    { name: "Idea + scope freeze", owner: "Founder", weeks: [1, 1] },
    { name: "Brand + landing page", owner: "Frontend/UX", weeks: [1, 2] },
    { name: "Auth + DB schema + seed", owner: "Full-stack", weeks: [1, 2] },
    { name: "Evaluator agent (rubric + tools)", owner: "AI Lead", weeks: [2, 3] },
    { name: "Coach agent (history + recs)", owner: "AI Lead", weeks: [2, 3] },
    { name: "Voice integration (Web Speech)", owner: "Frontend/UX", weeks: [2, 3] },
    { name: "Problem set authoring (15 + rubrics)", owner: "Java SME", weeks: [1, 4] },
    { name: "ELO + leaderboard + profile", owner: "Full-stack", weeks: [3, 3] },
    { name: "Polish, illustrations, wand intro", owner: "Frontend/UX", weeks: [3, 4] },
    { name: "Business foundation doc", owner: "GTM", weeks: [3, 4] },
    { name: "Pitch deck", owner: "GTM", weeks: [4, 4] },
    { name: "MPA presentation rehearsals", owner: "All", weeks: [4, 4] },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/30">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="p-2 w-1/3">Task</th>
            <th className="p-2 w-32">Owner</th>
            {[1, 2, 3, 4].map((w) => (
              <th key={w} className="p-2 text-center">W{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="p-2 text-foreground">{t.name}</td>
              <td className="p-2 text-muted-foreground">{t.owner}</td>
              {[1, 2, 3, 4].map((w) => {
                const active = w >= t.weeks[0] && w <= t.weeks[1];
                return (
                  <td key={w} className="p-1">
                    {active ? (
                      <div className="h-3 rounded bg-rose-500/70 border border-rose-400" />
                    ) : (
                      <div className="h-3 rounded bg-white/5" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeanCanvas() {
  const cells: { title: string; content: string; col: number; row: number; rowSpan?: number }[] = [
    {
      title: "Problem",
      col: 1,
      row: 1,
      rowSpan: 2,
      content:
        "Job seekers practice on platforms (LeetCode, HackerRank) that don't grade real-interview skills (free-text reasoning, voice). They walk into interviews unprepared for conceptual questions.",
    },
    {
      title: "Solution",
      col: 2,
      row: 1,
      content:
        "AI-graded free-text + voice answers, scored 0–10,000 against per-question rubrics. Two agents: Evaluator + Coach.",
    },
    {
      title: "Unique Value Prop",
      col: 3,
      row: 1,
      rowSpan: 2,
      content:
        "Practice interviews that grade how you EXPLAIN — not just how you code. Free-text + voice + rubric, all agentic.",
    },
    {
      title: "Unfair Advantage",
      col: 4,
      row: 1,
      content:
        "Per-rubric grading is hard to replicate without curated SME content. Voice-first UX. Speed of iteration with vibe-coded stack.",
    },
    {
      title: "Customer Segments",
      col: 5,
      row: 1,
      rowSpan: 2,
      content:
        "Primary: junior-mid Java engineers preparing for FAANG/scaleup interviews. Secondary: bootcamps, universities. Future: enterprise screening.",
    },
    {
      title: "Key Metrics",
      col: 2,
      row: 2,
      content:
        "DAU, evaluations/user/week, problem completion rate, free→Pro conversion, ELO progression rate, agent cost/eval.",
    },
    {
      title: "Channels",
      col: 4,
      row: 2,
      content:
        "Reddit r/cscareerquestions, LinkedIn content, university CS departments, bootcamp partnerships, organic SEO around 'java interview questions'.",
    },
    {
      title: "Cost Structure",
      col: 1,
      row: 3,
      content:
        "LLM API (~30% var), hosting, domain, content authoring, marketing. Founders equity-only y1. Total y1 ~€6.6K.",
    },
    {
      title: "Revenue Streams",
      col: 4,
      row: 3,
      content:
        "Pro subs €9.99/mo · B2B seats €499/mo · University licenses €3K/yr · API access €0.05/eval. Y1 projected MRR €19K.",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-2">
      <div className="grid grid-cols-5 gap-2 min-w-[900px]">
        {cells.map((c, i) => (
          <div
            key={i}
            className="bg-black/40 border border-white/10 rounded-md p-3 text-xs"
            style={{
              gridColumn: `${c.col} / span 1`,
              gridRow: `${c.row} / span ${c.rowSpan ?? 1}`,
            }}
          >
            <div className="text-rose-300 font-semibold uppercase tracking-wider mb-1">
              {c.title}
            </div>
            <p className="text-muted-foreground leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
