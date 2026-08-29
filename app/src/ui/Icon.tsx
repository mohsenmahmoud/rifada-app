import type { CSSProperties } from 'react';
import { color } from '@/theme/tokens';

export type IconProps = {
  /** One or more SVG path `d` strings. The prototype stores icons as bare paths. */
  path: string | string[];
  size?: number;
  stroke?: string;
  /** Line weight. The design system specifies 1.5–1.7px thin line icons. */
  width?: number;
  fill?: string;
  viewBox?: string;
  style?: CSSProperties;
  linecap?: 'round' | 'butt' | 'square';
  linejoin?: 'round' | 'miter' | 'bevel';
};

/**
 * Thin line icon. Monochrome navy/gray by default, per the component language.
 * Filled marks (rewards gem, star) pass `fill` and `stroke="none"`.
 */
export function Icon({
  path,
  size = 22,
  stroke = color.navy,
  width = 1.7,
  fill = 'none',
  viewBox = '0 0 24 24',
  style,
  linecap = 'round',
  linejoin = 'round',
}: IconProps) {
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" style={style}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={stroke === 'none' ? undefined : stroke}
          strokeWidth={stroke === 'none' ? undefined : width}
          strokeLinecap={linecap}
          strokeLinejoin={linejoin}
          fill={fill}
        />
      ))}
    </svg>
  );
}
