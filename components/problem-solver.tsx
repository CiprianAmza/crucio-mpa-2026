"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mic, MicOff, Send, Loader2, Sparkles } from "lucide-react";

type Evaluation = {
  score: number;
  oneLine: string;
  perCriterion: { name: string; score: number; comment: string }[];
  strengths: string[];
  gaps: string[];
  studyHints: string[];
};

type SubmitResp = {
  submissionId: string;
  score: number;
  eloDelta: number;
  evaluation: Evaluation;
};

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(idx: number): SpeechRecognitionResult;
  [idx: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(idx: number): SpeechRecognitionAlternative;
  [idx: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => unknown) | null;
  onerror:
    | ((this: SpeechRecognitionInstance, ev: Event & { error?: string }) => unknown)
    | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => unknown) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

export function ProblemSolver({ problemId }: { problemId: string }) {
  const [text, setText] = useState("");
  const [isVoice, setIsVoice] = useState(false);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<SubmitResp | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalRef = useRef<string>("");

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognitionCls = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SpeechRecognitionCls) {
      // Hydration-safe: server renders default (supported=true), client downgrades on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    const r = new SpeechRecognitionCls();
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (ev: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        const transcript = res[0]?.transcript ?? "";
        if (res.isFinal) {
          finalRef.current += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      setText((finalRef.current + interim).trim());
    };

    r.onerror = (ev) => {
      const err = (ev as Event & { error?: string }).error;
      if (err && err !== "no-speech" && err !== "aborted") {
        toast.error(`Voice error: ${err}`);
      }
    };

    r.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = r;
    return () => {
      try {
        r.abort();
      } catch {}
    };
  }, []);

  function toggleRecording() {
    const r = recognitionRef.current;
    if (!r) return;
    if (recording) {
      r.stop();
    } else {
      finalRef.current = text ? text + " " : "";
      try {
        r.start();
        setRecording(true);
        setIsVoice(true);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  function submit() {
    if (text.trim().length < 20) {
      toast.error("Write at least 20 characters before submitting.");
      return;
    }
    start(async () => {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, answerText: text, isVoice }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Submission failed");
        return;
      }
      const data: SubmitResp = await res.json();
      setResult(data);
      toast.success(`Scored ${data.score.toLocaleString()} / 10,000`);
      // Note: not calling router.refresh() — RSC merge with Radix Dialog
      // portal leaves new rows un-hydrated. Verdict card has all info
      // immediately; recent attempts list refreshes on next navigation.
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-black/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Your answer</CardTitle>
          <div className="flex items-center gap-2">
            {isVoice && (
              <Badge variant="outline" className="text-xs border-rose-500/40 text-rose-300">
                Voice
              </Badge>
            )}
            <Button
              size="sm"
              variant={recording ? "destructive" : "outline"}
              onClick={toggleRecording}
              disabled={!supported}
              title={supported ? "Toggle voice recording" : "Web Speech API not supported in this browser"}
            >
              {recording ? (
                <>
                  <MicOff className="h-4 w-4 mr-1" /> Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-1" />
                  {supported ? "Speak" : "Voice n/a"}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your answer, or hit the mic and speak it like a real interview…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              finalRef.current = e.target.value;
              setIsVoice(false);
            }}
            rows={10}
            className="font-mono text-sm"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {text.length} chars · min 20
            </span>
            <Button
              onClick={submit}
              disabled={pending || recording}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Evaluating…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Submit for grading
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-rose-500/40 bg-gradient-to-br from-rose-900/20 to-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-rose-400" />
              Evaluator verdict
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold tracking-tight">
                  {result.score.toLocaleString()}
                  <span className="text-base text-muted-foreground"> / 10,000</span>
                </div>
                <div className="text-sm text-muted-foreground italic mt-1">
                  {result.evaluation.oneLine}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  result.eloDelta >= 0
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-red-500/40 text-red-300"
                }
              >
                ELO {result.eloDelta >= 0 ? "+" : ""}
                {result.eloDelta}
              </Badge>
            </div>

            <Progress value={result.score / 100} className="h-2" />

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Per criterion
              </div>
              {result.evaluation.perCriterion.map((c) => (
                <div key={c.name} className="text-sm">
                  <div className="flex justify-between">
                    <span>{c.name}</span>
                    <span className="font-mono text-rose-300">{c.score}/100</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{c.comment}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-400 mb-1">
                  Strengths
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {result.evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-red-400 mb-1">
                  Gaps
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {result.evaluation.gaps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-rose-300 mb-1">
                Study hints
              </div>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                {result.evaluation.studyHints.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
