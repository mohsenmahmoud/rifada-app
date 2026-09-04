import type { CSSProperties, ReactNode } from 'react';
import { color, font, numeric, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { t } from '@/i18n/lang';

/**
 * Desktop-console primitives. The phone apps use `@/ui/primitives`; the admin
 * console has its own scale (smaller type, 18px cards, table rows) so it keeps
 * its own set rather than bending the mobile one.
 */

export const CHECK = 'M4 12.5l5 5L20 6.5';
export const CHEVRON_BACK = 'M9 5l7 7-7 7';

/** White 18px card — the console's only surface. */
export function Card({
  children,
  pad = '18px 20px',
  style,
}: {
  children: ReactNode;
  pad?: string | number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: color.card,
        borderRadius: 18,
        padding: pad,
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Navy gradient card — used for the one "hero" stat in each section. */
export function NavyCard({
  children,
  pad = 20,
  style,
}: {
  children: ReactNode;
  pad?: string | number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
        borderRadius: 18,
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{children}</div>;
}

/** A plain white stat tile: caption, big tabular number, sub-caption. */
export function Stat({
  label,
  value,
  unit,
  sub,
  subC = color.slate,
  valueC = color.navy,
  size = 28,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subC?: string;
  valueC?: string;
  size?: number;
}) {
  return (
    <Card pad={20}>
      <div style={{ fontSize: 12, color: color.slate }}>{t(label)}</div>
      <div style={{ ...numeric, fontSize: size, fontWeight: 700, color: valueC, marginTop: 6 }}>
        {t(value)}
        {unit && <span style={{ fontSize: 12.5, color: color.slate }}> {t(unit)}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: subC, marginTop: 6 }}>{t(sub)}</div>}
    </Card>
  );
}

/** Small status pill. */
export function Pill({
  children,
  bg,
  c,
  style,
}: {
  children: ReactNode;
  bg: string;
  c: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        background: bg,
        color: c,
        borderRadius: 999,
        padding: '3px 12px',
        fontSize: 10,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type BtnTone = 'navy' | 'gold' | 'green' | 'coral' | 'outline' | 'ghost';

const toneStyles: Record<BtnTone, CSSProperties> = {
  navy: { background: color.navy, color: '#fff', border: 'none' },
  gold: { background: color.gold, color: '#fff', border: 'none' },
  green: { background: color.green, color: '#fff', border: 'none' },
  coral: { background: color.coral, color: '#fff', border: 'none' },
  outline: {
    background: 'transparent',
    color: color.navy,
    border: `1.5px solid rgba(31,59,87,0.2)`,
  },
  ghost: { background: 'transparent', color: color.slate, border: 'none' },
};

export function Btn({
  children,
  onClick,
  tone = 'navy',
  size = 'md',
  style,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: BtnTone;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
  title?: string;
}) {
  const pad = size === 'sm' ? '5px 14px' : size === 'lg' ? '13px 22px' : '8px 18px';
  const fs = size === 'sm' ? 10.5 : size === 'lg' ? 13.5 : 12;
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        cursor: 'pointer',
        borderRadius: 999,
        padding: pad,
        fontSize: fs,
        fontWeight: 800,
        fontFamily: font.sans,
        whiteSpace: 'nowrap',
        ...toneStyles[tone],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Segmented pill used for filters, tabs, and target pickers. */
export function ChipToggle({
  label,
  on,
  onClick,
  tone = color.navy,
}: {
  label: ReactNode;
  on: boolean;
  onClick: () => void;
  tone?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: '8px 18px',
        fontSize: 12,
        fontWeight: 800,
        fontFamily: font.sans,
        cursor: 'pointer',
        background: on ? tone : '#fff',
        color: on ? '#fff' : color.slate,
        border: `1.5px solid ${on ? tone : 'rgba(31,59,87,0.15)'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/** Square checkbox used by the two bulk-action tables. */
export function CheckBox({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `1.5px solid ${on ? color.navy : 'rgba(31,59,87,0.25)'}`,
        background: on ? color.navy : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        padding: 0,
      }}
    >
      <Icon path={CHECK} size={12} stroke={on ? '#fff' : 'transparent'} width={3.2} />
    </button>
  );
}

/** iOS-style switch, for the automation rules. */
export function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        border: 'none',
        background: on ? color.green : color.line,
        position: 'relative',
        cursor: 'pointer',
        flex: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 3 : 23,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: '#fff',
          transition: 'left .18s ease',
        }}
      />
    </button>
  );
}

/** Track + fill, the console's one chart primitive. */
export function Bar({
  w,
  c = color.gold,
  h = 11,
  track = color.tileAlt,
}: {
  w: string;
  c?: string;
  h?: number;
  track?: string;
}) {
  return (
    <div style={{ flex: 1, height: h, borderRadius: 999, background: track, overflow: 'hidden' }}>
      <div style={{ width: w, height: '100%', borderRadius: 999, background: c }} />
    </div>
  );
}

/** Circular initials avatar. */
export function Avatar({
  name,
  size = 30,
  bg,
}: {
  name: string;
  size?: number;
  bg?: string;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: bg ?? `linear-gradient(160deg,${color.navyLight},${color.navy})`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.37,
        fontWeight: 800,
        flex: 'none',
      }}
    >
      {initialOf(name)}
    </span>
  );
}

/** First letter of the first two words — how the prototype builds every avatar. */
export function initialOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0][0]} ${parts[1][0]}` : parts[0].slice(0, 2);
}

/** Table header strip. Children are the column labels. */
export function TableHead({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        background: color.tile,
        fontSize: 11,
        fontWeight: 800,
        color: color.slate,
      }}
    >
      {children}
    </div>
  );
}

export function TableRow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 18px',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A card that clips its table rows to the 18px radius. */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: color.card,
        borderRadius: 18,
        boxShadow: shadow.card,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export function Grid({
  cols,
  gap = 14,
  children,
  style,
}: {
  cols: string;
  gap?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap, ...style }}>{children}</div>
  );
}

export function Field({
  value,
  onChange,
  placeholder,
  dir,
  style,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
  style?: CSSProperties;
  rows?: number;
}) {
  const base: CSSProperties = {
    width: '100%',
    background: color.bg,
    border: 'none',
    borderRadius: 14,
    padding: '12px 16px',
    fontSize: 13,
    color: color.navy,
    fontFamily: dir === 'ltr' ? font.mono : font.sans,
    boxSizing: 'border-box',
    ...style,
  };
  if (rows) {
    return (
      <textarea
        rows={rows}
        dir={dir}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...base, resize: 'none', lineHeight: 1.8 }}
      />
    );
  }
  return (
    <input
      dir={dir}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={base}
    />
  );
}

/** Back link above a drill-down section. */
export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 12.5,
        fontWeight: 800,
        color: color.slate,
        marginBottom: 12,
        fontFamily: font.sans,
        padding: 0,
      }}
    >
      <Icon path={CHEVRON_BACK} size={14} stroke={color.slate} width={2} />
      {t(label)}
    </button>
  );
}

/** Explanatory line the prototype places above several tables. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, color: color.slate, marginBottom: 14, lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

/** Rounded icon tile — 10px radius on tables, 12px on cards. */
export function IconChip({
  path,
  bg = color.tile,
  c = color.navy,
  size = 32,
  icon = 15,
  radius = 10,
}: {
  path: string;
  bg?: string;
  c?: string;
  size?: number;
  icon?: number;
  radius?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon path={path} size={icon} stroke={c} width={1.6} />
    </span>
  );
}

export const Spacer = () => <span style={{ flex: 1 }} />;
