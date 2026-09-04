import type { CSSProperties } from 'react';
import { color, font, radius, shadow } from '@/theme/tokens';
import { t } from '@/i18n/lang';

/**
 * Vertical progress timeline — used by the ticket detail, live job, order
 * tracker and auto-pay cycle. The dot logic is identical in all four:
 * green = done, gold = current, grey = pending.
 */
export function Timeline({
  steps,
  doneCount,
  currentIndex,
  minLine = 22,
}: {
  steps: { label: string; sub?: string }[];
  doneCount: number;
  /** Index rendered gold. Pass -1 for none. */
  currentIndex?: number;
  minLine?: number;
}) {
  return (
    <>
      {steps.map((s, i) => {
        const done = i < doneCount;
        const current = i === currentIndex;
        const last = i === steps.length - 1;
        return (
          <div key={t(s.label)} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 99,
                  background: done ? (current ? color.gold : color.green) : color.lineSoft,
                  marginTop: 3,
                  flex: 'none',
                }}
              />
              {!last && (
                <span
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: minLine,
                    background: i < doneCount - 1 ? color.green : color.tileWarm,
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: 16 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: done ? color.navy : color.slateLight,
                  lineHeight: 1.4,
                }}
              >
                {t(s.label)}
              </div>
              {s.sub && done && (
                <div style={{ fontSize: 11, color: color.slateLight, lineHeight: 1.6 }}>{t(s.sub)}</div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

/** Five-star picker. */
export function Stars({
  value,
  onPick,
  size = 30,
  style,
}: {
  value: number;
  onPick?: (n: number) => void;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', gap: 6, ...style }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onPick?.(n)}
          aria-label={`${n} ${t('نجوم')}`}
          disabled={!onPick}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: onPick ? 'pointer' : 'default',
            padding: 2,
          }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24">
            <path
              d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-1z"
              fill={n <= value ? color.gold : 'rgba(199,154,60,0.12)'}
              stroke={color.gold}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

/**
 * Horizontal scrolling filter chips. Navy when active, white otherwise —
 * the pattern used by bills history, events, sharing and the shop.
 */
export function ChipRow<T extends string>({
  chips,
  value,
  onPick,
  style,
}: {
  chips: { key: T; label: string }[];
  value: T;
  onPick: (k: T) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 2,
        ...style,
      }}
    >
      {chips.map((c) => {
        const on = c.key === value;
        return (
          <button
            key={c.key}
            onClick={() => onPick(c.key)}
            style={{
              flex: 'none',
              border: `1px solid ${on ? color.navy : 'rgba(0,0,0,0.06)'}`,
              borderRadius: radius.pill,
              padding: '7px 15px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              background: on ? color.navy : '#fff',
              color: on ? '#fff' : color.slate,
              fontFamily: font.sans,
              whiteSpace: 'nowrap',
            }}
          >
            {t(c.label)}
          </button>
        );
      })}
    </div>
  );
}

/** Label + value row inside a card, with a hairline divider. */
export function DetailRow({
  label,
  value,
  last = false,
  valueColor = color.navy,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '11px 4px',
        borderBottom: last ? undefined : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: 12.5, color: color.slate, whiteSpace: 'nowrap' }}>{t(label)}</span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: valueColor,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </span>
    </div>
  );
}

/** Gold-tinted informational note. */
export function Note({
  children,
  tone = 'gold',
}: {
  children: React.ReactNode;
  tone?: 'gold' | 'green' | 'coral' | 'navy';
}) {
  const tones = {
    gold: { bg: 'rgba(199,154,60,0.08)', c: color.goldDeep },
    green: { bg: 'rgba(63,166,107,0.1)', c: color.greenDeep },
    coral: { bg: 'rgba(228,103,90,0.08)', c: color.coralDeep },
    navy: { bg: 'rgba(31,59,87,0.06)', c: color.navy },
  }[tone];
  return (
    <div
      style={{
        background: tones.bg,
        borderRadius: radius.tile,
        padding: '12px 14px',
        fontSize: 11.5,
        color: tones.c,
        lineHeight: 1.9,
      }}
    >
      {children}
    </div>
  );
}

/** Circular initial avatar. */
export function Avatar({
  name,
  bg,
  size = 40,
  fontSize,
}: {
  name: string;
  bg?: string;
  size?: number;
  fontSize?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: bg ?? `linear-gradient(160deg,${color.navyLight},${color.navy})`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize ?? size * 0.36,
        fontWeight: 800,
        flex: 'none',
        fontFamily: font.sans,
      }}
    >
      {t(name)[0]}
    </span>
  );
}

/** Two-up segmented tab strip used inside screens (not the bottom nav). */
export function TabStrip<T extends string>({
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
        background: '#fff',
        borderRadius: radius.pill,
        padding: 4,
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const on = tab.key === value;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: radius.pill,
              padding: 9,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: font.sans,
              background: on ? color.navy : 'transparent',
              color: on ? '#fff' : color.slate,
              whiteSpace: 'nowrap',
            }}
          >
            {t(tab.label)}
          </button>
        );
      })}
    </div>
  );
}

/** Success splash — the shape shared by payment success and booking success. */
export function SuccessMark({ size = 88 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: 'rgba(63,166,107,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12.5l5 5L20 6.5"
          stroke={color.green}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
