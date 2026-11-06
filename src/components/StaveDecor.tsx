import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type Props = {
  width: number;
  lines?: number;
  spacing?: number;
  color?: string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

/** The recurring editorial motif: five thin stave rules behind a heading. */
function StaveDecor({
  width,
  lines = 5,
  spacing = 11,
  color = '#DCD3F0',
  opacity = 1,
  style,
}: Props) {
  const height = (lines - 1) * spacing + 2;
  return (
    <View pointerEvents="none" style={style}>
      <Svg width={width} height={height}>
        {Array.from({ length: lines }).map((_, i) => (
          <Line
            key={`stave-${i}`}
            x1={0}
            y1={i * spacing + 1}
            x2={width}
            y2={i * spacing + 1}
            stroke={color}
            strokeWidth={1}
            opacity={opacity}
          />
        ))}
      </Svg>
    </View>
  );
}

export default React.memo(StaveDecor);
