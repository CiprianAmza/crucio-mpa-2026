"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Mic, Type as TypeIcon, Copy, Check } from "lucide-react";
import { toast } from "sonner";

type Evaluation = {
  score: number;
  oneLine: string;
  perCriterion: { name: string; score: number; comment: string }[];
  strengths: string[];
  gaps: string[];
  studyHints: string[];
};

export type SubmissionDetail = {
  id: string;
  score: number;
  eloDelta: number;
  isVoice: boolean;
  answerText: string;
  feedback: string;
  createdAt: Date | string;
  problemTitle?: string;
};

function safeParseFeedback(raw: string | null | undefined): Evaluation | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.score !== "number") return null;
    return parsed as Evaluation;
  } catch {
    return null;
  }
}

export function SubmissionDetailRow({
  submission,
  className,
  children,
}: {
  submission: SubmissionDetail;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const evaluation = safeParseFeedback(submission.feedback);
  const when = new Date(submission.createdAt);

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(submission.answerText);
      setCopied(true);
      toast.success("Answer copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy. Try selecting the text manually.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-rose-950/30 to-black border-rose-500/30 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-400" />
              {submission.problemTitle ?? "Submission details"}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {when.toLocaleString()}
              {" · "}
              <span className="inline-flex items-center gap-1">
                {submission.isVoice ? (
                  <>
                    <Mic className="h-3 w-3" /> voice
                  </>
                ) : (
                  <>
                    <TypeIcon className="h-3 w-3" /> text
                  </>
                )}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold tracking-tight">
                  {submission.score.toLocaleString()}
                  <span className="text-sm text-muted-foreground"> / 10,000</span>
                </div>
                {evaluation?.oneLine && (
                  <div className="text-xs text-muted-foreground italic mt-1">
                    {evaluation.oneLine}
                  </div>
                )}
              </div>
              <Badge
                variant="outline"
                className={
                  submission.eloDelta >= 0
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-red-500/40 text-red-300"
                }
              >
                ELO {submission.eloDelta >= 0 ? "+" : ""}
                {submission.eloDelta}
              </Badge>
            </div>

            <Progress value={submission.score / 100} className="h-2" />

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Your answer
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={copyAnswer}
                  title="Copy answer to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-md p-3 text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                {submission.answerText}
              </div>
            </div>

            {evaluation?.perCriterion && evaluation.perCriterion.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Per criterion
                </div>
                <div className="space-y-2">
                  {evaluation.perCriterion.map((c) => (
                    <div key={c.name} className="text-sm">
                      <div className="flex justify-between">
                        <span>{c.name}</span>
                        <span className="font-mono text-rose-300">{c.score}/100</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evaluation && (evaluation.strengths.length > 0 || evaluation.gaps.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {evaluation.strengths.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 mb-1">
                      Strengths
                    </div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evaluation.gaps.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-red-400 mb-1">
                      Gaps
                    </div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {evaluation.gaps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {evaluation?.studyHints && evaluation.studyHints.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wider text-rose-300 mb-1">
                  Study hints
                </div>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  {evaluation.studyHints.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {!evaluation && (
              <div className="text-xs text-muted-foreground italic">
                (Feedback structure unavailable for this older submission.)
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
