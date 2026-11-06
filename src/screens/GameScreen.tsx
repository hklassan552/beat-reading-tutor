import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import CountInDots from '../components/CountInDots';
import ScreenHeader from '../components/ScreenHeader';
import StaveBar from '../components/StaveBar';
import TapPad from '../components/TapPad';
import VerdictLabel from '../components/VerdictLabel';
import theme from '../constants/theme';
import { getLevel } from '../game/levels';
import { buildBar } from '../game/rhythm';
import { RoundResult } from '../game/scoring';
import useRhythmRound from '../hooks/useRhythmRound';
import useSound from '../hooks/useSound';

type Props = {
  level: number;
  bpm: number;
  latencyMs: number;
  haptics: boolean;
  onGameOver: (result: RoundResult) => void;
  onExit: () => void;
};

function GameScreen({ level, bpm, latencyMs, haptics, onGameOver, onExit }: Props) {
  const levelDef = useMemo(() => getLevel(level), [level]);
  const bar = useMemo(() => buildBar(levelDef, bpm), [levelDef, bpm]);
  const { click, tick, stop: stopSound } = useSound(haptics);
  const [paused, setPaused] = useState(false);

  const handleBeat = useCallback(
    (index: number) => {
      click(index === 0);
    },
    [click],
  );

  const handleJudged = useCallback(() => {
    tick();
  }, [tick]);

  const handleFinish = useCallback(
    (result: RoundResult) => {
      stopSound();
      onGameOver(result);
    },
    [onGameOver, stopSound],
  );

  const { phase, countIndex, judgements, verdict, progress, start, stop, registerTap } =
    useRhythmRound({
      bar,
      latencyMs,
      onBeat: handleBeat,
      onNoteJudged: handleJudged,
      onFinish: handleFinish,
    });

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const handleRestart = useCallback(() => {
    setPaused(false);
    start();
  }, [start]);

  const handlePause = useCallback(() => {
    setPaused(true);
    stop();
  }, [stop]);

  const handleTap = useCallback(() => {
    if (paused) {
      setPaused(false);
      start();
      return;
    }
    registerTap();
  }, [paused, registerTap, start]);

  const counts = useMemo(() => {
    let on = 0;
    let off = 0;
    let streak = 0;
    judgements.forEach(j => {
      if (!j) {
        return;
      }
      if (j.verdict === 'on') {
        on += 1;
        streak += 1;
      } else if (j.verdict === 'miss') {
        off += 1;
        streak = 0;
      } else {
        off += 1;
        streak += 1;
      }
    });
    return { on, off, streak };
  }, [judgements]);

  const padLabel = paused ? 'RESUME' : phase === 'countin' ? 'READY' : 'TAP';

  return (
    <AppShell
      overlay={theme.gradients.game}
      decor={<View style={styles.blob} />}>
      <ScreenHeader
        title={`LEVEL ${levelDef.id} · ${levelDef.meter}`}
        onBack={onExit}
        rightSlot={
          <View style={styles.tempoChip}>
            <Text style={styles.tempoText}>{`${bpm} BPM`}</Text>
          </View>
        }
      />

      <View style={styles.area}>
        <CountInDots
          count={levelDef.beats}
          activeIndex={phase === 'countin' ? countIndex : -1}
          dimmed={phase !== 'countin'}
        />

        <StaveBar
          bar={bar}
          judgements={judgements}
          progress={progress}
          showTiming
          dimmed={phase === 'countin'}
        />

        <VerdictLabel verdict={verdict.value} nonce={verdict.nonce} />
      </View>

      <View style={styles.statStrip}>
        <View style={styles.statCell}>
          <Text style={[styles.statValue, { color: theme.colors.semantic.on }]}>
            {String(counts.on)}
          </Text>
          <Text style={styles.statLabel}>ON</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCell}>
          <Text style={[styles.statValue, { color: theme.colors.semantic.near }]}>
            {String(counts.off)}
          </Text>
          <Text style={styles.statLabel}>OFF</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCell}>
          <Text style={[styles.statValue, { color: theme.colors.accent.secondary }]}>
            {String(counts.streak)}
          </Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
      </View>

      <TapPad
        onTap={handleTap}
        onRestart={handleRestart}
        onPause={handlePause}
        onHome={onExit}
        enabled={phase === 'playing' || paused}
        label={padLabel}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    top: 120,
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(91,63,168,0.07)',
  },
  area: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
  },
  tempoChip: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempoText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: theme.colors.accent.primary,
  },
  statStrip: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
  },
  statCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { width: 1, height: 28, backgroundColor: theme.colors.ui.divider },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 13,
    color: theme.colors.text.muted,
  },
});

export default GameScreen;
