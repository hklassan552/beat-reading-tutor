import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TRACK_W = 52;
const TRACK_H = 32;
const KNOB = 26;

function Toggle({ value, onChange, label }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      // backgroundColor interpolation is a JS-driver property.
      useNativeDriver: false,
    }).start();
  }, [anim, value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.ui.border, theme.colors.accent.primary],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: TRACK_W, height: TRACK_H },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#FFFFFF',
  },
});

export default React.memo(Toggle);
