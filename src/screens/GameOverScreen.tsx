import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award, CheckCircle, RotateCcw, Target, Trophy } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import PrimaryButton from '../components/PrimaryButton';
import ScoreRing from '../components/ScoreRing';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StaveDecor from '../components/StaveDecor';
import { StatRow } from '../components/StatCard';
import TimingChart from '../components/TimingChart';
import { SCREEN_W } from '../constants/config';
import { RoundResult } from '../game/scoring';
import theme from '../constants/theme';

type Props = {
  result: RoundResult;
  bestStreak: number;
  onPlayAgain: () => void;
  onMenu: () => void;
  onReplaySound: () => void;
};

const CHART_W = Math.min(SCREEN_W - 48, 300);

function GameOverScreen({
  result,
  bestStreak,
  onPlayAgain,
  onMenu,
  onReplaySound,
}: Props) {
  return (
    <AppShell
      overlay={theme.gradients.result}
      decor={<StaveDecor width={SCREEN_W} spacing={11} opacity={0.5} style={styles.decor} />}>
      <ScreenHeader
        title="BAR REVIEW"
        onBack={onMenu}
        rightSlot={
          <View style={styles.levelChip}>
            <Text style={styles.levelText}>{`LEVEL ${result.level}`}</Text>
          </View>
        }
      />

      <View style={styles.root}>
        <View style={styles.headlineRow}>
          <View style={styles.badge}>
            <Award size={32} strokeWidth={1.6} color={theme.colors.accent.secondary} />
          </View>
          <Text style={styles.headline}>BAR COMPLETE</Text>
        </View>
        <View style={styles.rule} />

        <ScoreRing percent={result.accuracy} size={120} />

        <View style={styles.chartWrap}>
          <TimingChart judgements={result.judgements} width={CHART_W} />
        </View>

        <View style={styles.statWrap}>
          <StatRow
            stats={[
              {
                key: 'on',
                Icon: CheckCircle,
                value: result.onCount,
                label: 'on time',
                valueColor: theme.colors.semantic.on,
              },
              {
                key: 'accuracy',
                Icon: Target,
                value: `${result.accuracy}%`,
                label: 'accuracy',
                valueColor: theme.colors.accent.secondary,
              },
              {
                key: 'best',
                Icon: Trophy,
                value: bestStreak,
                label: 'best streak',
                valueColor: theme.colors.accent.primary,
              },
            ]}
          />
        </View>

        <PrimaryButton title="PLAY AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />

        <View style={styles.secondaryRow}>
          <SecondaryButton title="REPLAY SOUND" onPress={onReplaySound} style={styles.flexOne} />
          <SecondaryButton title="BACK TO STAND" onPress={onMenu} style={styles.flexOne} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  decor: { position: 'absolute', top: 190, left: 0 },
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    alignItems: 'center',
  },
  levelChip: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: theme.colors.accent.primary,
  },
  headlineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 46 },
  badge: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 36,
    color: theme.colors.text.primary,
  },
  rule: {
    width: 64,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.accent.secondary,
    marginTop: 10,
    marginBottom: 12,
  },
  chartWrap: { marginTop: 14, flexShrink: 1 },
  statWrap: { width: '100%', marginTop: 14, marginBottom: 16 },
  secondaryRow: { flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' },
  flexOne: { flex: 1 },
});

export default GameOverScreen;
