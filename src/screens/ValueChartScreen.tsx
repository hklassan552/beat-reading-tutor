import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Hourglass } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StaveDecor from '../components/StaveDecor';
import ValueRow from '../components/ValueRow';
import { SCREEN_W } from '../constants/config';
import { VALUE_CHART } from '../game/levels';
import useSound from '../hooks/useSound';
import theme from '../constants/theme';

type Props = {
  haptics: boolean;
  onBack: () => void;
};

/** A fixed 3x2 grid — six cards fit inside flex:1, so no ScrollView (rule #3). */
function ValueChartScreen({ haptics, onBack }: Props) {
  const { click } = useSound(haptics);

  const handlePlay = useCallback(() => {
    click(true);
  }, [click]);

  return (
    <AppShell
      overlay={theme.gradients.result}
      decor={<StaveDecor width={SCREEN_W} spacing={11} opacity={0.6} style={styles.decor} />}>
      <ScreenHeader title="NOTE VALUES" onBack={onBack} />

      <View style={styles.root}>
        <Text style={styles.lead}>Every value, and how many beats it holds.</Text>

        <View style={styles.grid}>
          {VALUE_CHART.map(item => (
            <View key={`value-${item.value}`} style={styles.cell}>
              <ValueRow
                value={item.value}
                name={item.name}
                beats={item.beats}
                onPlay={handlePlay}
              />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerArt}>
            <Hourglass size={30} strokeWidth={1.5} color={theme.colors.accent.secondary} />
          </View>
          <Text style={styles.footerText}>
            A rest is silence with a length. Count it, do not tap it.
          </Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  decor: { position: 'absolute', top: 170, left: 0 },
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18 },
  lead: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    color: theme.colors.text.secondary,
    marginBottom: 14,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: (SCREEN_W - 32 - 12) / 2 },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
  },
  footerArt: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  footerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: theme.colors.text.secondary,
  },
});

export default ValueChartScreen;
