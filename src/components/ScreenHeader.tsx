import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  title: string;
  onBack?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * One header for every screen with a back affordance (rule: shared ScreenHeader
 * across Menu / Game / GameOver and the three secondary screens).
 */
function ScreenHeader({ title, onBack, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {leftSlot ? (
          leftSlot
        ) : onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.iconButton}>
            <ChevronLeft size={22} strokeWidth={1.5} color={theme.colors.accent.primary} />
          </Pressable>
        ) : null}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT + HEADER_PADDING_TOP,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.glass,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  side: { width: 92, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
});

export default React.memo(ScreenHeader);
