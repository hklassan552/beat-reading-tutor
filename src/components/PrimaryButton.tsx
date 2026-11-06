import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconCmp } from './icon';
import { SPRING_PRESS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  title: string;
  Icon?: IconCmp;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/**
 * Rule #8: Pressable is the PARENT, the Animated.View lives INSIDE it.
 * Rule #20: icon is a fixed 24x24, the label's lineHeight equals it, gap 10.
 */
function PrimaryButton({ title, Icon, onPress, disabled, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

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
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.press, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.animated, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.primary as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} strokeWidth={1.5} color={theme.colors.text.onDark} /> : null}
            <Text style={styles.label}>{title}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    ...theme.shadows.cta,
  },
  disabled: { opacity: 0.5 },
  animated: { width: '100%', height: 60, borderRadius: theme.radius.lg },
  gradient: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: ICON,
    color: theme.colors.text.onDark,
  },
});

export default React.memo(PrimaryButton);
