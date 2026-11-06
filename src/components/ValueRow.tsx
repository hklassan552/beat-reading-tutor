import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { TokenValue } from '../game/levels';
import theme from '../constants/theme';
import { NoteGlyphSvg } from './NoteGlyph';

type Props = {
  value: TokenValue;
  name: string;
  beats: string;
  onPlay: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ValueRow({ value, name, beats, onPlay }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.glyphWrap}>
        <NoteGlyphSvg value={value} size={44} color={theme.colors.semantic.ink} />
      </View>
      <View style={styles.text}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.beats}>
          {beats}
        </Text>
      </View>
      <Pressable
        onPress={onPlay}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={`Play ${name}`}
        style={styles.play}>
        <Play size={18} strokeWidth={1.5} color={theme.colors.accent.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 104,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    ...theme.shadows.paper,
  },
  glyphWrap: { height: 44, justifyContent: 'center' },
  text: { marginTop: 2 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
    color: theme.colors.text.primary,
  },
  beats: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  play: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface.alt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ValueRow);
