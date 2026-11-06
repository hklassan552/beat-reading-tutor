import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TokenValue } from '../game/levels';
import theme from '../constants/theme';

export type NoteGlyphProps = {
  value: TokenValue;
  /** notehead centre x, in SVG units */
  x: number;
  /** notehead centre y, in SVG units */
  y: number;
  color?: string;
  /** suppress the flag when the eighth is beamed to a neighbour */
  beamed?: boolean;
  scale?: number;
};

const STEM_H = 32;
const HEAD_RX = 7;
const HEAD_RY = 5.5;

/**
 * Every musical symbol is drawn with react-native-svg — never a font glyph and
 * never an emoji (rules #15 / #16).
 */
function NoteGlyph({ value, x, y, color, beamed, scale = 1 }: NoteGlyphProps) {
  const ink = color || theme.colors.semantic.ink;
  const stemX = x + HEAD_RX - 1;
  const stemTop = y - STEM_H;
  const hollow = value === 'w' || value === 'h';

  if (value === 'qr') {
    return (
      <G scale={scale} originX={x} originY={y}>
        <Path
          d={`M ${x - 4} ${y - 15} L ${x + 3} ${y - 6} L ${x - 4} ${y + 3} L ${x + 4} ${y + 12}`}
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    );
  }

  if (value === 'er') {
    return (
      <G scale={scale} originX={x} originY={y}>
        <Circle cx={x - 2} cy={y - 7} r={2.8} fill={ink} />
        <Line
          x1={x}
          y1={y - 9}
          x2={x + 4}
          y2={y + 7}
          stroke={ink}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (value === 'hr') {
    return (
      <G scale={scale} originX={x} originY={y}>
        <Rect x={x - 7} y={y - 6} width={14} height={5} rx={1} fill={ink} />
      </G>
    );
  }

  return (
    <G scale={scale} originX={x} originY={y}>
      <Ellipse
        cx={x}
        cy={y}
        rx={HEAD_RX}
        ry={HEAD_RY}
        fill={hollow ? 'none' : ink}
        stroke={ink}
        strokeWidth={hollow ? 2.2 : 0}
        transform={`rotate(-18 ${x} ${y})`}
      />
      {value !== 'w' ? (
        <Rect x={stemX} y={stemTop} width={2} height={STEM_H} rx={1} fill={ink} />
      ) : null}
      {value === 'e' && !beamed ? (
        <Path
          d={`M ${stemX + 2} ${stemTop} C ${stemX + 11} ${stemTop + 5}, ${stemX + 11} ${
            stemTop + 13
          }, ${stemX + 3} ${stemTop + 18}`}
          stroke={ink}
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      {value === 'dq' ? <Circle cx={x + 14} cy={y - 5} r={2.5} fill={ink} /> : null}
    </G>
  );
}

/** Standalone version for cards and draggable blocks. */
export function NoteGlyphSvg({
  value,
  size = 44,
  color,
}: {
  value: TokenValue;
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size}>
      <NoteGlyph value={value} x={size * 0.4} y={size * 0.66} color={color} scale={0.9} />
    </Svg>
  );
}

export default React.memo(NoteGlyph);
