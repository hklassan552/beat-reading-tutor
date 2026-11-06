import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NEAR_TOLERANCE_MS, TIMING_STRIP_H } from '../constants/config';
import { Judgement, verdictColor } from '../game/scoring';
import theme from '../constants/theme';

type Props = {
  /** centre x of every note, in the same coordinate space as the stave */
  noteX: number[];
  judgements: (Judgement | null)[];
  slotW: number;
  width: number;
};

/**
 * The brief's "timing drawn below the notes": one bar per note, pushed left for
 * an early tap and right for a late one, proportional to the error.
 */
function TimingStrip({ noteX, judgements, slotW, width }: Props) {
  const half = slotW / 2;
  return (
    <View style={[styles.strip, { width }]}>
      {noteX.map((x, i) => {
        const j = judgements[i];
        const guideLeft = x - 0.5;
        if (!j) {
          return (
            <View
              key={`guide-${i}`}
              style={[styles.guide, { left: guideLeft }]}
            />
          );
        }
        const ratio = Math.max(-1, Math.min(1, j.errMs / NEAR_TOLERANCE_MS));
        const offset = ratio * half;
        const barW = Math.max(6, Math.abs(offset) + 6);
        const left = offset >= 0 ? x : x + offset;
        return (
          <View key={`tick-${i}`}>
            <View style={[styles.guide, { left: guideLeft }]} />
            <View
              style={[
                styles.bar,
                {
                  left,
                  width: barW,
                  backgroundColor: verdictColor(j.verdict),
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: TIMING_STRIP_H,
    marginTop: 2,
  },
  guide: {
    position: 'absolute',
    top: 6,
    width: 1,
    height: 18,
    backgroundColor: theme.colors.ui.border,
  },
  bar: {
    position: 'absolute',
    top: 13,
    height: 4,
    borderRadius: 2,
  },
});

export default React.memo(TimingStrip);
