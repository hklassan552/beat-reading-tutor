import { Level, Token, toTokens } from './levels';

export type PlacedToken = Token & {
  /** start position in eighth units from the barline */
  unit: number;
  /** index inside the notes-only list, -1 for rests */
  noteIndex: number;
  /** true when this eighth belongs to a beamed group with the next one */
  beamNext: boolean;
  /** true when this eighth is beamed to the previous one */
  beamPrev: boolean;
};

export type Bar = {
  level: Level;
  tokens: PlacedToken[];
  /** total eighth units in the bar = number of slots on the stave */
  slots: number;
  eighthMs: number;
  beatMs: number;
  barMs: number;
  /** onset of every tappable note, in ms from the barline */
  onsets: number[];
};

export function buildBar(level: Level, bpm: number): Bar {
  const raw = toTokens(level.pattern);
  const beatMs = 60000 / bpm;
  const eighthMs = beatMs / level.unitsPerBeat;

  let unit = 0;
  let noteIndex = 0;
  const tokens: PlacedToken[] = raw.map(t => {
    const placed: PlacedToken = {
      ...t,
      unit,
      noteIndex: t.rest ? -1 : noteIndex,
      beamNext: false,
      beamPrev: false,
    };
    if (!t.rest) {
      noteIndex += 1;
    }
    unit += t.units;
    return placed;
  });

  // Beam runs of adjacent eighth notes.
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (a.value === 'e' && b.value === 'e' && !a.rest && !b.rest) {
      a.beamNext = true;
      b.beamPrev = true;
    }
  }

  const slots = unit;
  const onsets = tokens.filter(t => !t.rest).map(t => t.unit * eighthMs);

  return {
    level,
    tokens,
    slots,
    eighthMs,
    beatMs,
    barMs: slots * eighthMs,
    onsets,
  };
}

/** Slot index (eighth cell) that a given millisecond offset falls into. */
export function slotForMs(bar: Bar, ms: number): number {
  const raw = Math.floor(ms / bar.eighthMs);
  return Math.max(0, Math.min(bar.slots - 1, raw));
}
