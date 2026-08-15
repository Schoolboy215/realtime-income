// A unit's `rate` is dollars/year, taken completely literally: a
// $100,000/year unit takes exactly one real year of wall-clock time to add
// $100,000 to the score — whether the tab was open the whole time (the tick
// loop, small elapsedSeconds many times a second) or closed and reopened
// later (offline catch-up, one large elapsedSeconds). Both cases are the
// same formula.
export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60 // 31,536,000

export function scoreEarned(totalRate: number, elapsedSeconds: number): number {
  return (totalRate * elapsedSeconds) / SECONDS_PER_YEAR
}
