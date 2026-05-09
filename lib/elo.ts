// ELO update tuned for free-text interview grading.
// `score` is 0..10000 from the evaluator. We translate to an "actual" in [0..1]
// using a sigmoid centered at 0.65 (= 6500/10000 ≈ "passing grade" in interview terms).
// "Expected" is computed against the problem's base ELO using standard ELO formula.

export function expectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

export function actualFromAgentScore(agentScore: number): number {
  // Sigmoid: < 6500 progressively penalized; = 6500 is a tie; > 6500 rewarded.
  // Steepness 8 makes the curve clearly differentiate fail / pass / strong levels.
  const s = Math.max(0, Math.min(1, agentScore / 10000));
  return 1 / (1 + Math.exp(-(s - 0.65) * 8));
}

export function eloDelta(
  playerRating: number,
  problemBaseElo: number,
  agentScore: number,
  k: number = 48,
): number {
  const expected = expectedScore(playerRating, problemBaseElo);
  const actual = actualFromAgentScore(agentScore);
  let delta = Math.round(k * (actual - expected));
  // Nudge to ±1 if rounding zeroed out a real difference (UX: every effort moves the needle).
  if (delta === 0) {
    if (actual > expected) delta = 1;
    else if (actual < expected) delta = -1;
  }
  return delta;
}
