import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { CHART_STAGGER_MS, NEAR_TOLERANCE_MS } from '../constants/config';
import { Judgement, verdictColor } from '../game/scoring';
import theme from '../constants/theme';

type Props = {
  judgements: (Judgement | null)[];
  width: number;
};

const ROW_H = 12;

/**
 * Early / late chart: a centre line marks perfect time, every note gets one bar
 * pushed left (early) or right (late). Built from Views so the staggered growth
 * can run on the native driver (transform + opacity only).
 */
function TimingChart({ judgements, width }: Props) {
  const half = width / 2 - 10;
  const progress = useRef(judgements.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      CHART_STAGGER_MS,
      progress.map(v =>
        Animated.timing(v, { toValue: 1, duration: 220, useNativeDriver: true }),
      ),
    ).start();
  }, [progress]);

  return (
    <View style={[styles.wrap, { width }]}>
      <View style={styles.axisRow}>
        <Text style={styles.axis}>EARLY</Text>
        <Text style={styles.axis}>LATE</Text>
      </View>
      <View style={[styles.plot, { width, height: judgements.length * ROW_H + 8 }]}>
        <View style={[styles.centerLine, { left: width / 2 - 0.5 }]} />
        {judgements.map((j, i) => {
          const err = j && j.verdict !== 'miss' ? j.errMs : j ? NEAR_TOLERANCE_MS : 0;
          const ratio = Math.max(-1, Math.min(1, err / NEAR_TOLERANCE_MS));
          const len = Math.max(8, Math.abs(ratio) * half);
          const left = ratio >= 0 ? width / 2 : width / 2 - len;
          return (
            <Animated.View
              key={`row-${i}`}
              style={[
                styles.bar,
                {
                  top: 4 + i * ROW_H,
                  left,
                  width: len,
                  backgroundColor: verdictColor(j ? j.verdict : 'miss'),
                  opacity: progress[i],
                  transform: [
                    {
                      scaleX: progress[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.05, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  axis: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
  plot: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  centerLine: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: theme.colors.ui.borderStrong,
  },
  bar: { position: 'absolute', height: 10, borderRadius: 5 },
});

export default React.memo(TimingChart);
