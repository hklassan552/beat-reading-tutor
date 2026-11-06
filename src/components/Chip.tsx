import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Chip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[styles.chip, active ? styles.chipActive : null]}>
      <Text style={[styles.label, active ? styles.labelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    minWidth: 54,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.surface.alt,
    borderWidth: 1.5,
    borderColor: theme.colors.accent.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.accent.primary },
});

export default React.memo(Chip);
