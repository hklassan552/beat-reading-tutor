import {
  NEAR_TOLERANCE_MS,
  ON_TOLERANCE_MS,
  SCORE_MISS,
  SCORE_NEAR,
  SCORE_ON,
} from '../constants/config';
import theme from '../constants/theme';

export type Verdict = 'on' | 'early' | 'late' | 'miss';

export type Judgement = {
  noteIndex: number;
  verdict: Verdict;
  errMs: number;
};

export function judge(errMs: number): Verdict {
  const abs = Math.abs(errMs);
  if (abs <= ON_TOLERANCE_MS) {
    return 'on';
  }
  if (abs <= NEAR_TOLERANCE_MS) {
    return errMs < 0 ? 'early' : 'late';
  }
  return 'miss';
}

export function verdictColor(verdict: Verdict | null): string {
  switch (verdict) {
    case 'on':
      return theme.colors.semantic.on;
    case 'early':
    case 'late':
      return theme.colors.semantic.near;
    case 'miss':
      return theme.colors.semantic.miss;
    default:
      return theme.colors.semantic.ink;
  }
}

export function verdictLabel(verdict: Verdict | null): string {
  switch (verdict) {
    case 'on':
      return 'ON';
    case 'early':
      return 'EARLY';
    case 'late':
      return 'LATE';
    case 'miss':
      return 'MISS';
    default:
      return '';
  }
}

export function verdictScore(verdict: Verdict): number {
  switch (verdict) {
    case 'on':
      return SCORE_ON;
    case 'early':
    case 'late':
      return SCORE_NEAR;
    default:
      return SCORE_MISS;
  }
}

export type RoundResult = {
  level: number;
  noteCount: number;
  onCount: number;
  earlyCount: number;
  lateCount: number;
  missed: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  errors: (number | null)[];
  judgements: (Judgement | null)[];
};

export function summarise(
  level: number,
  judgements: (Judgement | null)[],
): RoundResult {
  let onCount = 0;
  let earlyCount = 0;
  let lateCount = 0;
  let missed = 0;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;

  judgements.forEach(j => {
    const verdict: Verdict = j ? j.verdict : 'miss';
    score += verdictScore(verdict);
    if (verdict === 'on') {
      onCount += 1;
    } else if (verdict === 'early') {
      earlyCount += 1;
    } else if (verdict === 'late') {
      lateCount += 1;
    } else {
      missed += 1;
    }
    if (verdict === 'miss') {
      streak = 0;
    } else {
      streak += 1;
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    }
  });

  const noteCount = judgements.length || 1;
  return {
    level,
    noteCount: judgements.length,
    onCount,
    earlyCount,
    lateCount,
    missed,
    accuracy: Math.round((score / (SCORE_ON * noteCount)) * 100),
    streak,
    bestStreak,
    errors: judgements.map(j => (j && j.verdict !== 'miss' ? j.errMs : null)),
    judgements,
  };
}
