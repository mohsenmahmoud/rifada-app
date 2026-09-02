import { color, font } from '@/theme/tokens';
import { t } from '@/i18n/lang';

/**
 * The Rifada mark — two interlocking roofs, gold over navy.
 * On dark grounds the lower roof flips to white.
 */
export function Wordmark({ size = 30, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ flex: 'none' }}>
      <path
        d="M8 27L21 14l13 13"
        stroke={color.gold}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 36L30 23l13 13"
        stroke={onDark ? '#FFFFFF' : color.navy}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Lockup: mark + «رفادة RIFADA» + optional caption. */
export function BrandLockup({ caption }: { caption?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Wordmark />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: color.navy, lineHeight: 1.2 }}>
          {t('رفادة')}{' '}
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 11,
              fontWeight: 600,
              color: color.gold,
              letterSpacing: 2,
            }}
          >
            RIFADA
          </span>
        </div>
        {caption && <div style={{ fontSize: 11.5, color: color.slate }}>{caption}</div>}
      </div>
    </div>
  );
}
