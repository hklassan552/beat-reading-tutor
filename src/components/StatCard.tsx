import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { IconCmp } from './icon';

export type StatSpec = {
  key: string;
  Icon: IconCmp;
  value: string | number;
  label: string;
  valueColor: string;
};

type Props = {
  Icon: IconCmp;
  value: string | number;
  label: string;
  valueColor: string;
};

function hasValue(value: string | number): boolean {
  if (typeof value === 'number') {
    return value > 0;
  }
  return value.trim().length > 0 && value !== '0';
}

/**
 * One pill. Rule #19a: width 100% inside a flex:1 slot, never flex:1 on both.
 * Icons come from the single project icon library so every glyph is exactly
 * 22x22 — no AI sprite with its own aspect ratio ever enters a stat row.
 */
function StatCard({ Icon, value, label, valueColor }: Props) {
  if (!hasValue(value)) {
    return null;
  }
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={1.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]}>{String(value)}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

/** A row renders only when at least two pills have something to show (rule #21). */
export function StatRow({ stats }: { stats: StatSpec[] }) {
  const visible = stats.filter(s => hasValue(s.value));
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(s => (
        <View key={s.key} style={styles.slot}>
          <StatCard Icon={s.Icon} value={s.value} label={s.label} valueColor={s.valueColor} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, width: '100%' },
  slot: { flex: 1 },
  card: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    ...theme.shadows.paper,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 13,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
});

export default React.memo(StatCard);
