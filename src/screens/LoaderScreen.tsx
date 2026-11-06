import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AudioLines } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import StaveDecor from '../components/StaveDecor';
import {
  LOADER_DURATION_MS,
  SCREEN_FADE_MS,
  SCREEN_W,
  SPRING_ENTRANCE,
} from '../constants/config';
import theme from '../constants/theme';

const BAR_W = 220;
const PULSE_MS = 500;

/**
 * Deep violet splash. The Menu is pale lilac on the same AI background, so the
 * two screens are far apart perceptually (rule #14).
 */
function LoaderScreen({ onDone }: { onDone: () => void }) {
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const fill = useRef(new Animated.Value(0)).current;
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, ...SPRING_ENTRANCE, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();

    Animated.timing(fill, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      // width is a layout property — it must stay on the JS driver.
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 4);
    }, PULSE_MS);

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: SCREEN_FADE_MS,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [cardOpacity, cardScale, fade, fill, onDone]);

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell
      dark
      overlay={theme.gradients.loader}
      decor={
        <>
          <View style={styles.blob} />
          <StaveDecor
            width={SCREEN_W}
            spacing={9}
            color="rgba(244,241,250,0.18)"
            style={styles.decorTop}
          />
          <StaveDecor
            width={SCREEN_W}
            spacing={9}
            color="rgba(244,241,250,0.14)"
            style={styles.decorBottom}
          />
        </>
      }>
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <AudioLines size={104} strokeWidth={1.4} color={theme.colors.accent.secondary} />
        </Animated.View>

        <Text style={styles.title}>BEAT READING</Text>
        <Text style={styles.titleAccent}>TUTOR</Text>
        <Text style={styles.subtitle}>READ IT · CLAP IT · NAIL IT</Text>

        <View style={styles.track}>
          <Animated.View style={[styles.fillWrap, { width }]}>
            <LinearGradient
              colors={theme.gradients.accent as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={`pulse-${i}`}
              style={[styles.dot, i === pulse ? styles.dotOn : null]}
            />
          ))}
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  blob: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(242,113,28,0.22)',
  },
  decorTop: { position: 'absolute', top: 110, left: 0 },
  decorBottom: { position: 'absolute', bottom: 90, left: 0 },
  card: {
    width: 168,
    height: 168,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface.onDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3.5,
    lineHeight: 40,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 2 },
  },
  titleAccent: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 9,
    lineHeight: 40,
    color: theme.colors.accent.secondary,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2.2,
    lineHeight: 16,
    color: theme.colors.text.onDarkSoft,
  },
  track: {
    marginTop: 30,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  fillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { flex: 1, borderRadius: 3 },
  loading: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 15,
    color: theme.colors.text.onDarkMuted,
  },
  dots: { marginTop: 22, flexDirection: 'row', gap: 10 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotOn: { backgroundColor: theme.colors.accent.secondary },
});

export default LoaderScreen;
