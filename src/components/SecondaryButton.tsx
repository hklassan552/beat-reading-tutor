import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { SPRING_PRESS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  tone?: 'paper' | 'onDark';
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Text-only by design (rule #20: a clean button beats a crooked decorated one).
 * Pressable outside, Animated.View inside (rule #8).
 */
function SecondaryButton({ title, onPress, tone = 'paper', style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const onDark = tone === 'onDark';

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, ...SPRING_PRESS, useNativeDriver: true }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING_PRESS, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          onDark ? styles.bodyDark : styles.bodyPaper,
          { transform: [{ scale }] },
        ]}>
        <Text style={[styles.label, onDark ? styles.labelDark : styles.labelPaper]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { height: 48 },
  body: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  bodyPaper: {
    backgroundColor: theme.colors.surface.card,
    borderColor: theme.colors.ui.border,
  },
  bodyDark: {
    backgroundColor: theme.colors.surface.onDarkStrong,
    borderColor: theme.colors.ui.borderOnDark,
  },
  label: { fontSize: 13, fontWeight: '800', letterSpacing: 1.4, lineHeight: 18 },
  labelPaper: { color: theme.colors.accent.primary },
  labelDark: { color: theme.colors.text.onDark },
});

export default React.memo(SecondaryButton);
