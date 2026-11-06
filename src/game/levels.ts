/**
 * Rhythm patterns. Every duration is expressed in EIGHTH-NOTE UNITS,
 * so one bar of 4/4 is 8 units, 3/4 is 6 units and 6/8 is 6 units.
 */
export type NoteValue = 'w' | 'h' | 'dq' | 'q' | 'e';
export type RestValue = 'hr' | 'qr' | 'er';
export type TokenValue = NoteValue | RestValue;

export type Token = {
  value: TokenValue;
  /** duration in eighth units */
  units: number;
  rest: boolean;
};

export type Level = {
  id: number;
  title: string;
  meter: string;
  /** beats shown in the count-in and in the time signature numerator */
  beats: number;
  /** denominator of the time signature */
  beatUnit: number;
  /** how many eighth units one metronome beat lasts (2 for x/4, 3 for 6/8) */
  unitsPerBeat: number;
  pattern: TokenValue[];
};

const UNITS: Record<TokenValue, number> = {
  w: 8,
  h: 4,
  hr: 4,
  dq: 3,
  q: 2,
  qr: 2,
  e: 1,
  er: 1,
};

const RESTS: TokenValue[] = ['hr', 'qr', 'er'];

export function tokenUnits(value: TokenValue): number {
  return UNITS[value];
}

export function isRest(value: TokenValue): boolean {
  return RESTS.indexOf(value) !== -1;
}

export function toTokens(pattern: TokenValue[]): Token[] {
  return pattern.map(value => ({
    value,
    units: UNITS[value],
    rest: isRest(value),
  }));
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'STEADY QUARTERS',
    meter: '4/4',
    beats: 4,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['q', 'q', 'q', 'q'],
  },
  {
    id: 2,
    title: 'QUARTERS AND RESTS',
    meter: '4/4',
    beats: 4,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['q', 'qr', 'q', 'q'],
  },
  {
    id: 3,
    title: 'BEAMED EIGHTHS',
    meter: '4/4',
    beats: 4,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['e', 'e', 'e', 'e', 'q', 'q'],
  },
  {
    id: 4,
    title: 'DOTTED QUARTER',
    meter: '4/4',
    beats: 4,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['dq', 'e', 'q', 'q'],
  },
  {
    id: 5,
    title: 'SYNCOPATION',
    meter: '4/4',
    beats: 4,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['e', 'q', 'q', 'q', 'e'],
  },
  {
    id: 6,
    title: 'WALTZ COUNT',
    meter: '3/4',
    beats: 3,
    beatUnit: 4,
    unitsPerBeat: 2,
    pattern: ['q', 'e', 'e', 'q'],
  },
  {
    id: 7,
    title: 'COMPOUND SIX',
    meter: '6/8',
    beats: 2,
    beatUnit: 8,
    unitsPerBeat: 3,
    pattern: ['dq', 'dq'],
  },
];

export function getLevel(id: number): Level {
  const found = LEVELS.find(l => l.id === id);
  return found || LEVELS[0];
}

/** Catalogue used by the Value Chart screen. */
export const VALUE_CHART: { value: TokenValue; name: string; beats: string }[] = [
  { value: 'w', name: 'Whole', beats: '4 beats' },
  { value: 'h', name: 'Half', beats: '2 beats' },
  { value: 'q', name: 'Quarter', beats: '1 beat' },
  { value: 'e', name: 'Eighth', beats: 'half a beat' },
  { value: 'dq', name: 'Dotted quarter', beats: '1 and a half' },
  { value: 'qr', name: 'Quarter rest', beats: '1 beat silent' },
];

/** Blocks the learner drags on the Dictation screen. */
export const DICTATION_BLOCKS: TokenValue[] = ['w', 'h', 'q', 'e', 'dq', 'qr'];
