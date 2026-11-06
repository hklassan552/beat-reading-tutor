import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash duration — rule #13: exactly 8000 ms, never shorter. */
export const LOADER_DURATION_MS = 8000;

/** Screen cross-fade, per the design doc (the beat is never visually disturbed). */
export const SCREEN_FADE_MS = 200;

/** Header geometry — rule #6. */
export const HEADER_HEIGHT = 72;
export const HEADER_PADDING_TOP = 44;

/** Notation board geometry — rule #4 / #5. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 12;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 13

/** Left gutter inside the stave reserved for the time signature. */
export const STAVE_GUTTER = 30;

/**
 * Width of one eighth-note cell. The card's own padding and border are taken
 * out first (rule #4) so the drawing can never stick out of the rounded card.
 */
export function slotWidth(slots: number): number {
  return Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME - STAVE_GUTTER) / slots);
}
/** Width of the drawing area inside the card. */
export function innerWidth(slots: number): number {
  return slotWidth(slots) * slots + STAVE_GUTTER;
}
/** Outer width of the notation card. */
export function boardWidth(slots: number): number {
  return innerWidth(slots) + 2 * BOARD_FRAME;
}

/** Stave drawing metrics (inside the card, above the timing strip). */
export const STAVE_H = 112;
export const STAVE_MID_Y = 54;
export const STAVE_GAP = 9;
export const TIMING_STRIP_H = 26;

/** Tap pad occupies the bottom third of the screen. */
export const TAP_PAD_H = Math.max(220, Math.round(SCREEN_H * 0.33));

/** Tempo. */
export const DEFAULT_BPM = 96;
export const BPM_CHOICES = [60, 72, 84, 96, 112];

/** Judgement tolerances in milliseconds. */
export const ON_TOLERANCE_MS = 45;
export const NEAR_TOLERANCE_MS = 120;

/** Score weights per verdict. */
export const SCORE_ON = 100;
export const SCORE_NEAR = 60;
export const SCORE_MISS = 0;

/** Animation timings. */
export const RIPPLE_MS = 140;
export const SNAP_MS = 120;
export const RING_MS = 500;
export const CHART_STAGGER_MS = 40;
export const VERDICT_FADE_OUT_MS = 320;
export const NOTE_RECOLOUR_MS = 160;
export const COUNT_DOT_MS = 180;

/** Springs. */
export const SPRING_PRESS = { tension: 300, friction: 18 };
export const SPRING_ENTRANCE = { tension: 52, friction: 8 };
export const SPRING_SNAP = { tension: 120, friction: 12 };

/** Haptics. */
export const HAPTIC_TAP_MS = 12;

/** Progression. */
export const UNLOCK_ACCURACY = 85;
export const MAX_LEVEL = 7;
