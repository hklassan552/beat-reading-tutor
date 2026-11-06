import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text } from 'react-native';
import { SPRING_SNAP } from '../constants/config';
import { TokenValue } from '../game/levels';
import theme from '../constants/theme';
import { NoteGlyphSvg } from './NoteGlyph';

type Props = {
  value: TokenValue;
  caption: string;
  onDrop: (value: TokenValue, pageX: number, pageY: number) => void;
};

/**
 * Dragging uses the built-in PanResponder API only (rule #8).
 */
function NoteBlock({ value, caption, onDrop }: Props) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          pan.setValue({ x: g.dx, y: g.dy });
        },
        onPanResponderRelease: (_, g) => {
          onDropRef.current(value, g.moveX, g.moveY);
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...SPRING_SNAP,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...SPRING_SNAP,
            useNativeDriver: false,
          }).start();
        },
      }),
    [pan, value],
  );

  return (
    <Animated.View
      {...responder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel={caption}
      style={[styles.block, { transform: pan.getTranslateTransform() }]}>
      <NoteGlyphSvg value={value} size={34} color={theme.colors.semantic.ink} />
      <Text style={styles.caption}>{caption}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.paper,
  },
  caption: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 11,
    color: theme.colors.text.muted,
  },
});

export default React.memo(NoteBlock);
