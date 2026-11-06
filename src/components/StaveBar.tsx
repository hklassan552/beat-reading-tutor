import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import {
  BOARD_BORDER,
  BOARD_PAD,
  STAVE_GAP,
  STAVE_GUTTER,
  STAVE_H,
  STAVE_MID_Y,
  boardWidth,
  innerWidth,
  slotWidth,
} from '../constants/config';
import { TokenValue } from '../game/levels';
import { Bar } from '../game/rhythm';
import { Judgement, verdictColor } from '../game/scoring';
import theme from '../constants/theme';
import NoteGlyph from './NoteGlyph';
import TimingStrip from './TimingStrip';

type Props = {
  bar: Bar;
  judgements?: (Judgement | null)[];
  /** 0..1 Animated value driving the playhead; omit for a static stave */
  progress?: Animated.Value;
  showTiming?: boolean;
  /** dictation mode: dashed empty slots plus whatever the learner dropped */
  placed?: (TokenValue | null)[];
  slotFeedback?: (('ok' | 'bad') | null)[];
  dimmed?: boolean;
};

const STEM_OFFSET = 6;
const STEM_TOP = STAVE_MID_Y - 32;

function StaveBar({
  bar,
  judgements,
  progress,
  showTiming,
  placed,
  slotFeedback,
  dimmed,
}: Props) {
  const slots = bar.slots;
  const slotW = slotWidth(slots);
  const innerW = innerWidth(slots);
  const cardW = boardWidth(slots);

  const lineYs = useMemo(
    () => [-2, -1, 0, 1, 2].map(k => STAVE_MID_Y + k * STAVE_GAP),
    [],
  );

  const noteX = useMemo(
    () =>
      bar.tokens
        .filter(t => !t.rest)
        .map(t => STAVE_GUTTER + t.unit * slotW + slotW / 2),
    [bar.tokens, slotW],
  );

  const isTarget = !!placed;

  return (
    <View style={[styles.card, { width: cardW }, dimmed ? styles.dim : null]}>
      <Svg width={innerW} height={STAVE_H}>
        {lineYs.map((y, i) => (
          <Line
            key={`line-${i}`}
            x1={0}
            y1={y}
            x2={innerW}
            y2={y}
            stroke={theme.colors.ui.borderStrong}
            strokeWidth={1}
          />
        ))}

        <Rect
          x={0}
          y={lineYs[0]}
          width={2}
          height={lineYs[4] - lineYs[0]}
          fill={theme.colors.accent.primary}
        />
        <Rect
          x={innerW - 2}
          y={lineYs[0]}
          width={2}
          height={lineYs[4] - lineYs[0]}
          fill={theme.colors.accent.primary}
        />

        <SvgText
          x={15}
          y={STAVE_MID_Y - 2}
          fontSize={19}
          fontWeight="bold"
          fill={theme.colors.text.primary}
          textAnchor="middle">
          {String(bar.level.beats)}
        </SvgText>
        <SvgText
          x={15}
          y={STAVE_MID_Y + 17}
          fontSize={19}
          fontWeight="bold"
          fill={theme.colors.text.primary}
          textAnchor="middle">
          {String(bar.level.beatUnit)}
        </SvgText>

        {isTarget
          ? Array.from({ length: slots }).map((_, i) => {
              const token = placed ? placed[i] : null;
              const x = STAVE_GUTTER + i * slotW + slotW / 2;
              const fb = slotFeedback ? slotFeedback[i] : null;
              const strokeColor =
                fb === 'ok'
                  ? theme.colors.semantic.on
                  : fb === 'bad'
                  ? theme.colors.semantic.miss
                  : theme.colors.ui.borderStrong;
              return (
                <G key={`slot-${i}`}>
                  <Rect
                    x={STAVE_GUTTER + i * slotW + 2}
                    y={STAVE_MID_Y - 26}
                    width={slotW - 4}
                    height={48}
                    rx={6}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={fb ? 1.6 : 1}
                    strokeDasharray="4 4"
                  />
                  {token ? (
                    <NoteGlyph value={token} x={x} y={STAVE_MID_Y} scale={0.8} />
                  ) : null}
                </G>
              );
            })
          : null}

        {!isTarget
          ? bar.tokens.map((t, i) => {
              const x = STAVE_GUTTER + t.unit * slotW + slotW / 2;
              const j = t.noteIndex >= 0 && judgements ? judgements[t.noteIndex] : null;
              const colour = j ? verdictColor(j.verdict) : theme.colors.semantic.ink;
              return (
                <NoteGlyph
                  key={`tok-${i}`}
                  value={t.value}
                  x={x}
                  y={STAVE_MID_Y}
                  color={colour}
                  beamed={t.beamNext || t.beamPrev}
                />
              );
            })
          : null}

        {!isTarget
          ? bar.tokens.map((t, i) => {
              if (!t.beamNext) {
                return null;
              }
              const next = bar.tokens[i + 1];
              const x1 = STAVE_GUTTER + t.unit * slotW + slotW / 2 + STEM_OFFSET;
              const x2 = STAVE_GUTTER + next.unit * slotW + slotW / 2 + STEM_OFFSET + 2;
              return (
                <Rect
                  key={`beam-${i}`}
                  x={x1}
                  y={STEM_TOP}
                  width={Math.max(4, x2 - x1)}
                  height={4}
                  fill={theme.colors.semantic.ink}
                />
              );
            })
          : null}
      </Svg>

      {showTiming && judgements ? (
        <TimingStrip noteX={noteX} judgements={judgements} slotW={slotW} width={innerW} />
      ) : null}

      {progress ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.trail,
              {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, innerW - 3],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.playhead,
              {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, innerW - 3],
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: BOARD_PAD,
    paddingVertical: BOARD_PAD,
    borderRadius: theme.radius.lg,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface.card,
    alignSelf: 'center',
    overflow: 'hidden',
    ...theme.shadows.paper,
  },
  dim: { opacity: 0.75 },
  playhead: {
    position: 'absolute',
    left: BOARD_PAD,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent.secondary,
  },
  trail: {
    position: 'absolute',
    left: BOARD_PAD - 16,
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: 'rgba(242,113,28,0.18)',
  },
});

export default React.memo(StaveBar);
