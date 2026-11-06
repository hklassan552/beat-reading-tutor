import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COUNT_DOT_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  count: number;
  activeIndex: number;
  dimmed?: boolean;
};

function Dot({ active, dimmed }: { active: boolean; dimmed?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      return;
    }
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.35,
        duration: COUNT_DOT_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: COUNT_DOT_MS / 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, scale]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: active
            ? theme.colors.accent.secondary
            : dimmed
            ? theme.colors.ui.border
            : theme.colors.ui.borderStrong,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

function CountInDots({ count, activeIndex, dimmed }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={`dot-${i}`} active={i === activeIndex} dimmed={dimmed} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
});

export default React.memo(CountInDots);
