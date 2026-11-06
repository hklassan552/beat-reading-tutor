import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { VERDICT_FADE_OUT_MS } from '../constants/config';
import { Verdict, verdictColor, verdictLabel } from '../game/scoring';

type Props = {
  verdict: Verdict | null;
  nonce: number;
};

/** Fixed height so the layout never jumps between taps. */
function VerdictLabel({ verdict, nonce }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!verdict) {
      opacity.setValue(0);
      return;
    }
    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: VERDICT_FADE_OUT_MS,
        delay: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [nonce, verdict, opacity]);

  return (
    <Animated.Text
      style={[styles.label, { opacity, color: verdictColor(verdict) }]}
      numberOfLines={1}>
      {verdictLabel(verdict)}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  label: {
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2.4,
  },
});

export default React.memo(VerdictLabel);
