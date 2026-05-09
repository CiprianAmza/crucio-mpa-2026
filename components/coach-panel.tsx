"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Brain, Loader2, ArrowRight } from "lucide-react";

type CoachAdvice = {
  summary: string;
  weakTopics: { slug: string; name: string; avgScore: number; hint: string }[];
  recommendedProblems: { slug: string; title: string; reason: string }[];
  nextSession: string;
};

export function CoachPanel() {
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);
  const [pending, start] = useTransition();

  function run() {
    start(async () => {
      const res = await fetch("/api/coach", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Coach failed");
        return;
      }
      const data = await res.json();
      setAdvice(data.advice);
      toast.success("Personalized plan ready");
    });
  }

  if (!advice) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Ask the Coach to look at your history and recommend the next problems.
        </p>
        <Button
          onClick={run}
          disabled={pending}
          size="sm"
          className="w-full bg-rose-600 hover:bg-rose-700"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Thinking…
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" /> Get my plan
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-foreground">{advice.summary}</p>

      {advice.weakTopics.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Weakest topics
          </div>
          <ul className="space-y-2">
            {advice.weakTopics.map((t) => (
              <li key={t.slug}>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{t.name}</Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    avg {t.avgScore}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{t.hint}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {advice.recommendedProblems.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Attack next
          </div>
          <ul className="space-y-2">
            {advice.recommendedProblems.map((p) => (
              <li key={p.slug} className="border border-white/5 rounded-md p-2">
                <Link
                  href={`/problems/${p.slug}`}
                  className="font-medium text-rose-300 hover:underline flex items-center gap-1"
                >
                  {p.title} <ArrowRight className="h-3 w-3" />
                </Link>
                <p className="text-muted-foreground text-xs mt-1">{p.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          Next 30–60 min
        </div>
        <p className="text-muted-foreground text-xs">{advice.nextSession}</p>
      </div>

      <Button onClick={run} variant="outline" size="sm" disabled={pending} className="w-full">
        {pending ? "Refreshing…" : "Refresh plan"}
      </Button>
    </div>
  );
}
