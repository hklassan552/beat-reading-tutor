import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AudioLines,
  BookOpen,
  Gauge,
  Music4,
  Play,
  Settings,
  Target,
  Timer,
} from 'lucide-react-native';
import AppShell from '../components/AppShell';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StaveDecor from '../components/StaveDecor';
import { StatRow } from '../components/StatCard';
import { HEADER_PADDING_TOP, SCREEN_W, SPRING_ENTRANCE } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  level: number;
  weekTiming: number;
  bpm: number;
  onStart: () => void;
  onDictation: () => void;
  onValues: () => void;
  onSettings: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function MenuScreen({
  level,
  weekTiming,
  bpm,
  onStart,
  onDictation,
  onValues,
  onSettings,
}: Props) {
  const rise = useRef(new Animated.Value(18)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const art = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(art, {
        toValue: 1,
        delay: 120,
        ...SPRING_ENTRANCE,
        useNativeDriver: true,
      }),
    ]).start();
  }, [art, fade, rise]);

  return (
    <AppShell
      overlay={theme.gradients.menu}
      decor={
        <>
          <StaveDecor width={SCREEN_W} spacing={11} style={styles.decor} />
          <View style={styles.blob} />
        </>
      }>
      <View style={styles.root}>
        <View style={styles.topStrip}>
          <View style={styles.brand}>
            <Music4 size={24} strokeWidth={1.6} color={theme.colors.accent.primary} />
            <Text style={styles.brandText}>PRACTICE STAND</Text>
          </View>
          <View style={styles.topButtons}>
            <Pressable
              onPress={onValues}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Note values"
              style={styles.topButton}>
              <BookOpen size={22} strokeWidth={1.5} color={theme.colors.accent.primary} />
            </Pressable>
            <Pressable
              onPress={onSettings}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Stand settings"
              style={styles.topButton}>
              <Settings size={22} strokeWidth={1.5} color={theme.colors.accent.primary} />
            </Pressable>
          </View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.titleBlock, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <Text style={styles.titleInk}>BEAT</Text>
          <Text style={styles.titleViolet}>READING</Text>
          <Text style={styles.titleOrange}>TUTOR</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>Tap the written rhythm in time.</Text>
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.artWrap, { transform: [{ scale: art }] }]}>
          <View style={styles.artPad} />
          <AudioLines size={76} strokeWidth={1.4} color={theme.colors.accent.primary} />
        </Animated.View>

        <View style={styles.statWrap}>
          <StatRow
            stats={[
              {
                key: 'level',
                Icon: Gauge,
                value: level,
                label: 'level',
                valueColor: theme.colors.accent.primary,
              },
              weekTiming > 0
                ? {
                    key: 'timing',
                    Icon: Target,
                    value: `${weekTiming}%`,
                    label: 'week timing',
                    valueColor: theme.colors.accent.secondary,
                  }
                : {
                    key: 'tempo',
                    Icon: Timer,
                    value: String(bpm),
                    label: 'tempo bpm',
                    valueColor: theme.colors.accent.secondary,
                  },
            ]}
          />
        </View>

        <Text style={styles.hint}>FOUR CLICKS, THEN TAP EACH NOTE</Text>

        <PrimaryButton title="START PRACTICE" Icon={Play} onPress={onStart} />

        <View style={styles.secondaryRow}>
          <SecondaryButton title="DICTATION" onPress={onDictation} style={styles.flexOne} />
          <SecondaryButton title="VALUES" onPress={onValues} style={styles.flexOne} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  decor: { position: 'absolute', top: 268, left: 0 },
  blob: {
    position: 'absolute',
    bottom: -80,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(242,113,28,0.10)',
  },
  topStrip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 15,
    color: theme.colors.text.secondary,
  },
  topButtons: { flexDirection: 'row', gap: 10 },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { marginTop: 10, paddingRight: 90, flexShrink: 1 },
  titleInk: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
    color: theme.colors.text.primary,
  },
  titleViolet: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
    color: theme.colors.accent.primary,
  },
  titleOrange: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 6,
    lineHeight: 26,
    color: theme.colors.accent.secondary,
  },
  rule: {
    width: 56,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.accent.secondary,
    marginVertical: 10,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    color: theme.colors.text.secondary,
    maxWidth: 230,
  },
  spacer: { flex: 1, minHeight: 4 },
  artWrap: {
    alignSelf: 'flex-end',
    width: 140,
    height: 110,
    marginRight: 6,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artPad: {
    position: 'absolute',
    width: 140,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(91,63,168,0.07)',
  },
  statWrap: { marginTop: 10, marginBottom: 14 },
  hint: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 15,
    color: theme.colors.text.muted,
    marginBottom: 8,
  },
  secondaryRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  flexOne: { flex: 1 },
});

export default MenuScreen;
