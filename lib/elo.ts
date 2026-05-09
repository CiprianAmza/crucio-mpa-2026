// ELO update tuned for free-text grading.
// `score` is 0..10000 from the evaluator. We translate that to an "actual" score in [0..1].
// The "expected" is computed against the problem's base ELO using standard ELO formula.

export function expectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

export function actualFromAgentScore(agentScore: number): number {
  // 0–10000 → 0–1, with center at 5000
  return Math.max(0, Math.min(1, agentScore / 10000));
}

export function eloDelta(
  playerRating: number,
  problemBaseElo: number,
  agentScore: number,
  k: number = 32,
): number {
  const expected = expectedScore(playerRating, problemBaseElo);
  const actual = actualFromAgentScore(agentScore);
  return Math.round(k * (actual - expected));
}
