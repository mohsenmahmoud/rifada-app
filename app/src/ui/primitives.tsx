import type { CSSProperties, ReactNode } from 'react';
import { color, font, numeric, radius, shadow, tint } from '@/theme/tokens';
import { Icon } from './Icon';

/* ------------------------------------------------------------------ *
 * Card — white fill, soft shadow, no border. The system's only card.
 * ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  onClick,
  pad = 14,
}: {
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  pad?: number | string;
}) {
  const base: CSSProperties = {
    background: color.card,
    borderRadius: radius.card,
    boxShadow: shadow.card,
    padding: pad,
    boxSizing: 'border-box',
    ...style,
  };
  if (!onClick) return <div style={base}>{children}</div>;
  return (
    <button
      onClick={onClick}
      style={{
        ...base,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'right',
        font: 'inherit',
        display: 'block',
        width: '100%',
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Buttons — primary is always a full pill.
 * ------------------------------------------------------------------ */

type ButtonTone = 'navy' | 'gold' | 'green' | 'coral' | 'outline' | 'ghost';

const tones: Record<ButtonTone, CSSProperties> = {
  navy: { background: color.navy, color: '#fff', border: 'none' },
  gold: { background: color.gold, color: '#fff', border: 'none' },
  green: { background: color.green, color: '#fff', border: 'none' },
  coral: { background: color.coral, color: '#fff', border: 'none' },
  outline: {
    background: 'transparent',
    color: color.navy,
    border: `1.5px solid ${color.navy}`,
  },
  ghost: { background: color.card, color: color.navy, border: 'none' },
};

export function PillButton({
  children,
  onClick,
  tone = 'navy',
  full = false,
  size = 'md',
  disabled = false,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: ButtonTone;
  full?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const pad = size === 'lg' ? '14px' : size === 'sm' ? '8px 18px' : '11px 22px';
  const fs = size === 'lg' ? 15 : size === 'sm' ? 12.5 : 14;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...tones[tone],
        borderRadius: radius.pill,
        padding: pad,
        fontFamily: font.sans,
        fontSize: fs,
        fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Status pill — green=positive/paid, gold=pending, coral=negative/overdue.
 * ------------------------------------------------------------------ */

export type PillTone = 'green' | 'gold' | 'coral' | 'gray' | 'navy';

export const pillTones: Record<PillTone, { bg: string; c: string }> = {
  green: { bg: tint.greenWellStrong, c: color.greenDeep },
  gold: { bg: tint.goldWellStrong, c: color.goldDeep },
  coral: { bg: tint.coralWellStrong, c: color.coralDeep },
  gray: { bg: 'rgba(107,114,128,0.12)', c: color.slate },
  navy: { bg: 'rgba(31,59,87,0.1)', c: color.navy },
};

export function StatusPill({
  children,
  tone = 'gray',
  bg,
  c,
  style,
}: {
  children: ReactNode;
  tone?: PillTone;
  bg?: string;
  c?: string;
  style?: CSSProperties;
}) {
  const t = pillTones[tone];
  return (
    <span
      style={{
        background: bg ?? t.bg,
        color: c ?? t.c,
        borderRadius: radius.pill,
        padding: '3px 10px',
        fontSize: 10.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flex: 'none',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Screen chrome
 * ------------------------------------------------------------------ */

/** Back chevron — RTL, so it points right. */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="رجوع"
      style={{
        width: 38,
        height: 38,
        borderRadius: 99,
        border: 'none',
        background: color.card,
        boxShadow: shadow.card,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon path="M9 5l7 7-7 7" size={16} width={2} />
    </button>
  );
}

/**
 * Standard screen header: back button + title, with the 66px status-bar inset
 * every screen in the prototype uses.
 */
export function ScreenHeader({
  title,
  onBack,
  trailing,
  sub,
}: {
  title: string;
  onBack?: () => void;
  trailing?: ReactNode;
  sub?: string;
}) {
  return (
    <div
      style={{
        padding: '66px 22px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: 'none',
      }}
    >
      {onBack && <BackButton onClick={onBack} />}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: color.navy,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
        {sub && <span style={{ fontSize: 11.5, color: color.slate }}>{sub}</span>}
      </div>
      <div style={{ flex: 1 }} />
      {trailing}
    </div>
  );
}

/** Section label above a group of cards. */
export function SectionTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 16.5,
        fontWeight: 800,
        color: color.navy,
        margin: '22px 2px 10px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Rounded icon tile — the beige well behind every line icon. */
export function IconTile({
  path,
  size = 42,
  bg = color.tile,
  stroke = color.navy,
  iconSize = 19,
  radius: r = 13,
}: {
  path: string | string[];
  size?: number;
  bg?: string;
  stroke?: string;
  iconSize?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon path={path} size={iconSize} stroke={stroke} width={1.6} />
    </div>
  );
}

/** Tabular figures — every balance, point total, count and date. */
export function Num({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <span style={{ ...numeric, ...style }}>{children}</span>;
}

/** The app's scrolling body region, sitting under the header. */
export function ScrollBody({
  children,
  pad = '10px 18px 130px',
  style,
}: {
  children: ReactNode;
  pad?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: pad, ...style }}>
      {children}
    </div>
  );
}

/** Full-bleed screen surface inside the device. */
export function Screen({
  children,
  bg = color.bg,
  style,
}: {
  children: ReactNode;
  bg?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Segmented control — used by move-in, events, shop, real-estate. */
export function Segmented<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (k: T) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        background: color.card,
        borderRadius: radius.pill,
        padding: 4,
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: radius.pill,
              padding: '8px 10px',
              fontSize: 12.5,
              fontWeight: 800,
              background: on ? color.navy : 'transparent',
              color: on ? '#fff' : color.slate,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Empty state used wherever a list can be empty. */
export function EmptyState({
  icon,
  title,
  sub,
}: {
  icon: string | string[];
  title: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '46px 24px',
        textAlign: 'center',
      }}
    >
      <IconTile path={icon} size={60} iconSize={26} radius={20} stroke={color.slateLight} />
      <div style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>{title}</div>
      {sub && (
        <div style={{ fontSize: 12.5, color: color.slate, lineHeight: 1.7 }}>{sub}</div>
      )}
    </div>
  );
}
