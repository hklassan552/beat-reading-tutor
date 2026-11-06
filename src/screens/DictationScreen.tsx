import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Music4, Volume2 } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import NoteBlock from '../components/NoteBlock';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StaveBar from '../components/StaveBar';
import { BOARD_FRAME, STAVE_GUTTER, slotWidth } from '../constants/config';
import { DICTATION_BLOCKS, TokenValue, getLevel, tokenUnits } from '../game/levels';
import { buildBar } from '../game/rhythm';
import theme from '../constants/theme';

type Props = {
  level: number;
  bpm: number;
  onBack: () => void;
  onPlayRhythm: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const BLOCK_CAPTIONS: Record<string, string> = {
  w: 'WHOLE',
  h: 'HALF',
  q: 'QTR',
  e: '8TH',
  dq: 'DOT Q',
  qr: 'REST',
};

function DictationScreen({ level, bpm, onBack, onPlayRhythm }: Props) {
  const levelDef = useMemo(() => getLevel(level), [level]);
  const bar = useMemo(() => buildBar(levelDef, bpm), [levelDef, bpm]);
  const slotW = slotWidth(bar.slots);

  const [placed, setPlaced] = useState<(TokenValue | null)[]>(() =>
    Array(bar.slots).fill(null),
  );
  const [feedback, setFeedback] = useState<(('ok' | 'bad') | null)[]>(() =>
    Array(bar.slots).fill(null),
  );

  const barRef = useRef<View | null>(null);
  const rectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const measure = useCallback(() => {
    const node = barRef.current;
    if (!node) {
      return;
    }
    node.measureInWindow((x, y, w, h) => {
      rectRef.current = { x, y, w, h };
    });
  }, []);

  const handleDrop = useCallback(
    (value: TokenValue, pageX: number, pageY: number) => {
      const rect = rectRef.current;
      if (rect.w === 0) {
        return;
      }
      const inside =
        pageX >= rect.x &&
        pageX <= rect.x + rect.w &&
        pageY >= rect.y &&
        pageY <= rect.y + rect.h;
      if (!inside) {
        return;
      }
      const local = pageX - rect.x - BOARD_FRAME - STAVE_GUTTER;
      const slot = Math.floor(local / slotW);
      if (slot < 0 || slot >= bar.slots) {
        return;
      }
      setPlaced(prev => {
        const next = prev.slice();
        next[slot] = value;
        return next;
      });
      setFeedback(Array(bar.slots).fill(null));
    },
    [bar.slots, slotW],
  );

  const handleClear = useCallback(() => {
    setPlaced(Array(bar.slots).fill(null));
    setFeedback(Array(bar.slots).fill(null));
  }, [bar.slots]);

  const handleCheck = useCallback(() => {
    const expected: (TokenValue | null)[] = Array(bar.slots).fill(null);
    bar.tokens.forEach(t => {
      expected[t.unit] = t.value;
    });
    setFeedback(
      expected.map((want, i) => {
        const got = placed[i];
        if (!want && !got) {
          return null;
        }
        if (want && got && want === got && tokenUnits(want) === tokenUnits(got)) {
          return 'ok';
        }
        return 'bad';
      }),
    );
  }, [bar.slots, bar.tokens, placed]);

  return (
    <AppShell overlay={theme.gradients.game} decor={<View style={styles.blob} />}>
      <ScreenHeader
        title={`DICTATION · ${levelDef.meter}`}
        onBack={onBack}
        rightSlot={
          <View style={styles.chip}>
            <Text style={styles.chipText}>{`${bpm} BPM`}</Text>
          </View>
        }
      />

      <View style={styles.root}>
        <View style={styles.listenCard}>
          <Text style={styles.listenLabel}>HEAR THE RHYTHM</Text>
          <Pressable
            onPress={onPlayRhythm}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Play rhythm"
            style={styles.listenButton}>
            <View style={styles.iconRow}>
              <Volume2 size={24} strokeWidth={1.5} color={theme.colors.accent.primary} />
              <Text style={styles.listenButtonText}>PLAY RHYTHM</Text>
            </View>
          </Pressable>
          <View style={styles.listenArt}>
            <Music4 size={34} strokeWidth={1.4} color="rgba(91,63,168,0.35)" />
          </View>
        </View>

        <View ref={barRef} onLayout={measure} collapsable={false} style={styles.barWrap}>
          <StaveBar bar={bar} placed={placed} slotFeedback={feedback} />
        </View>

        <Text style={styles.trayLabel}>DRAG A VALUE INTO A SLOT</Text>
        <View style={styles.tray}>
          {DICTATION_BLOCKS.map(value => (
            <NoteBlock
              key={`block-${value}`}
              value={value}
              caption={BLOCK_CAPTIONS[value]}
              onDrop={handleDrop}
            />
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleClear}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Clear the bar"
            style={styles.clearButton}>
            <Text style={styles.clearText}>CLEAR</Text>
          </Pressable>
          <View style={styles.flexOne}>
            <PrimaryButton title="CHECK BAR" onPress={handleCheck} />
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    bottom: -70,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(242,113,28,0.08)',
  },
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18 },
  chip: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    color: theme.colors.accent.primary,
  },
  listenCard: {
    height: 96,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...theme.shadows.paper,
  },
  listenLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
  listenButton: {
    height: 48,
    width: 196,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  listenButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 24,
    color: theme.colors.accent.primary,
  },
  listenArt: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barWrap: { marginTop: 14, alignItems: 'center' },
  trayLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 15,
    color: theme.colors.text.muted,
  },
  tray: { flexDirection: 'row', justifyContent: 'space-between' },
  spacer: { flex: 1, minHeight: 10 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clearButton: {
    width: 88,
    height: 60,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 18,
    color: theme.colors.accent.primary,
  },
  flexOne: { flex: 1 },
});

export default DictationScreen;
