import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { RING_MS } from '../constants/config';
import theme from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STROKE = 10;

function ScoreRing({ percent, size = 148 }: { percent: number; size?: number }) {
  const SIZE = size;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const value = useRef(new Animated.Value(0)).current;
  const safe = Math.max(0, Math.min(100, percent));

  useEffect(() => {
    value.setValue(0);
    Animated.timing(value, {
      toValue: safe / 100,
      duration: RING_MS,
      easing: Easing.out(Easing.cubic),
      // strokeDashoffset is an SVG property — it cannot run on the native driver.
      useNativeDriver: false,
    }).start();
  }, [safe, value]);

  const offset = value.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRC, 0],
  });

  return (
    <View style={[styles.wrap, { width: SIZE, height: SIZE }]}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={theme.colors.ui.border}
          strokeWidth={STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={theme.colors.accent.primary}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={offset as unknown as number}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View pointerEvents="none" style={styles.center}>
        <Text style={styles.value}>{`${Math.round(safe)}%`}</Text>
        <Text style={styles.caption}>TIMING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  value: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    color: theme.colors.accent.primary,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 14,
    color: theme.colors.text.muted,
  },
});

export default React.memo(ScoreRing);
