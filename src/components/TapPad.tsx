import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Hand, House, Pause } from 'lucide-react-native';
import { RIPPLE_MS, TAP_PAD_H } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  onTap: () => void;
  onRestart: () => void;
  onPause: () => void;
  onHome: () => void;
  enabled: boolean;
  label: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const RIPPLE_SIZE = 240;

function TapPad({ onTap, onRestart, onPause, onHome, enabled, label }: Props) {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (!enabled) {
        return;
      }
      const { locationX, locationY } = e.nativeEvent;
      setOrigin({ x: locationX, y: locationY });
      scale.setValue(0.2);
      opacity.setValue(0.55);
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: RIPPLE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: RIPPLE_MS,
          useNativeDriver: true,
        }),
      ]).start();
      onTap();
    },
    [enabled, onTap, opacity, scale],
  );

  return (
    <LinearGradient
      colors={theme.gradients.pad as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.pad}>
      <View style={styles.strip}>
        <Pressable
          onPress={onHome}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Back to the practice stand"
          style={styles.iconButton}>
          <View style={styles.iconRow}>
            <House size={24} strokeWidth={1.75} color={theme.colors.text.onDark} />
          </View>
        </Pressable>

        <Pressable
          onPress={onRestart}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Restart bar"
          style={styles.restartButton}>
          <View style={styles.iconRow}>
            <Text style={styles.restartLabel}>RESTART BAR</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onPause}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Pause"
          style={styles.iconButton}>
          <View style={styles.iconRow}>
            <Pause size={24} strokeWidth={1.75} color={theme.colors.text.onDark} />
          </View>
        </Pressable>
      </View>

      <Pressable
        onPressIn={handlePressIn}
        disabled={!enabled}
        accessibilityRole="button"
        accessibilityLabel="Tap the rhythm"
        style={styles.tapZone}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ripple,
            {
              left: origin.x - RIPPLE_SIZE / 2,
              top: origin.y - RIPPLE_SIZE / 2,
              opacity,
              transform: [{ scale }],
            },
          ]}
        />
        <View style={styles.plate}>
          <Hand size={40} strokeWidth={1.5} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={[styles.tapLabel, enabled ? null : styles.tapLabelOff]}>{label}</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pad: {
    height: TAP_PAD_H,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 18,
    ...theme.shadows.pad,
  },
  strip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 56,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.onDarkStrong,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.onDarkStrong,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  restartLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 24,
    color: theme.colors.text.onDark,
  },
  tapZone: {
    flex: 1,
    marginTop: 12,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: RIPPLE_SIZE,
    height: RIPPLE_SIZE,
    borderRadius: RIPPLE_SIZE / 2,
    backgroundColor: 'rgba(242,113,28,0.35)',
  },
  plate: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  tapLabel: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  tapLabelOff: { color: 'rgba(255,255,255,0.45)' },
});

export default React.memo(TapPad);
