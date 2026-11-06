import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Timer } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import Chip from '../components/Chip';
import ScreenHeader from '../components/ScreenHeader';
import Toggle from '../components/Toggle';
import { BPM_CHOICES } from '../constants/config';
import useSound from '../hooks/useSound';
import theme from '../constants/theme';

export type ClickSound = 'WOOD' | 'BEEP' | 'RIM';

type Props = {
  bpm: number;
  clickSound: ClickSound;
  latencyMs: number;
  haptics: boolean;
  onBpm: (value: number) => void;
  onClickSound: (value: ClickSound) => void;
  onLatency: (value: number) => void;
  onHaptics: (value: boolean) => void;
  onBack: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CAL_CLICKS = 8;
const CAL_INTERVAL = 600;
const SOUNDS: ClickSound[] = ['WOOD', 'BEEP', 'RIM'];

function SettingsScreen({
  bpm,
  clickSound,
  latencyMs,
  haptics,
  onBpm,
  onClickSound,
  onLatency,
  onHaptics,
  onBack,
}: Props) {
  const { click } = useSound(haptics);
  const [calibrating, setCalibrating] = useState(false);
  const [taps, setTaps] = useState(0);

  const startedAtRef = useRef(0);
  const offsetsRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopCalibration = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (endRef.current) {
      clearTimeout(endRef.current);
      endRef.current = null;
    }
  }, []);

  useEffect(() => stopCalibration, [stopCalibration]);

  const finishCalibration = useCallback(() => {
    stopCalibration();
    setCalibrating(false);
    const offsets = offsetsRef.current;
    if (offsets.length >= 3) {
      const mean = offsets.reduce((a, b) => a + b, 0) / offsets.length;
      onLatency(Math.round(Math.max(-120, Math.min(220, mean))));
    }
  }, [onLatency, stopCalibration]);

  const startCalibration = useCallback(() => {
    stopCalibration();
    offsetsRef.current = [];
    setTaps(0);
    setCalibrating(true);
    startedAtRef.current = Date.now();
    click(true);
    timerRef.current = setInterval(() => click(false), CAL_INTERVAL);
    endRef.current = setTimeout(finishCalibration, CAL_CLICKS * CAL_INTERVAL + 400);
  }, [click, finishCalibration, stopCalibration]);

  const registerCalibrationTap = useCallback(() => {
    if (!calibrating) {
      startCalibration();
      return;
    }
    const elapsed = Date.now() - startedAtRef.current;
    const nearest = Math.round(elapsed / CAL_INTERVAL) * CAL_INTERVAL;
    offsetsRef.current.push(elapsed - nearest);
    setTaps(t => t + 1);
  }, [calibrating, startCalibration]);

  return (
    <AppShell overlay={theme.gradients.menu} decor={<View style={styles.blob} />}>
      <ScreenHeader title="STAND SETTINGS" onBack={onBack} />

      <View style={styles.root}>
        <View style={styles.row}>
          <View style={styles.rowHead}>
            <View style={styles.rowArt}>
              <Timer size={26} strokeWidth={1.5} color={theme.colors.accent.primary} />
            </View>
            <View style={styles.flexOne}>
              <Text style={styles.rowTitle}>Tempo</Text>
              <Text style={styles.rowHint}>Clicks per minute</Text>
            </View>
          </View>
          <View style={styles.chips}>
            {BPM_CHOICES.map(value => (
              <Chip
                key={`bpm-${value}`}
                label={String(value)}
                active={value === bpm}
                onPress={() => onBpm(value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Click sound</Text>
          <View style={styles.chips}>
            {SOUNDS.map(value => (
              <Chip
                key={`sound-${value}`}
                label={value}
                active={value === clickSound}
                onPress={() => onClickSound(value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.rowInline}>
          <View style={styles.flexOne}>
            <Text style={styles.rowTitle}>Latency calibration</Text>
            <Text style={styles.rowHint}>
              {calibrating
                ? `Tap with the click  ${taps}/${CAL_CLICKS}`
                : `Offset ${latencyMs} ms`}
            </Text>
          </View>
          <Pressable
            onPress={registerCalibrationTap}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Calibrate latency"
            style={[styles.calButton, calibrating ? styles.calButtonActive : null]}>
            <Text style={[styles.calText, calibrating ? styles.calTextActive : null]}>
              {calibrating ? 'TAP' : 'CALIBRATE'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.rowInline}>
          <View style={styles.flexOne}>
            <Text style={styles.rowTitle}>Haptics</Text>
            <Text style={styles.rowHint}>A short pulse on every click and tap</Text>
          </View>
          <Toggle value={haptics} onChange={onHaptics} label="Haptics" />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    top: 160,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(91,63,168,0.07)',
  },
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 14, gap: 12 },
  row: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    ...theme.shadows.paper,
  },
  rowInline: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    ...theme.shadows.paper,
  },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowArt: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  rowHint: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  calButton: {
    width: 118,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calButtonActive: { backgroundColor: theme.colors.accent.primary },
  calText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 18,
    color: theme.colors.accent.primary,
  },
  calTextActive: { color: theme.colors.text.onDark },
  flexOne: { flex: 1 },
});

export default SettingsScreen;
