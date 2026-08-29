import { color } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { icons } from './data/icons';
import { useResident } from './store';
import type { ScreenKey } from './types';

/** Screens that keep the bottom bar visible. */
const NAV_HIDDEN: ScreenKey[] = ['splash', 'otp', 'setup'];

/**
 * Persistent 5-item bar. «اسأل جيرانك» sits in slot 3 — the user swapped
 * المكافآت out of the bar and onto the home grid, and asked for a distinct
 * icon here so it wouldn't read as الرسائل.
 */
const items: {
  key: string;
  label: string;
  icon: string;
  screens: ScreenKey[];
  go: ScreenKey;
}[] = [
  { key: 'home', label: 'الرئيسية', icon: icons.home, screens: ['home'], go: 'home' },
  { key: 'services', label: 'الخدمات', icon: icons.grid, screens: ['services'], go: 'services' },
  {
    key: 'community',
    label: 'اسأل جيرانك',
    icon: icons.people,
    screens: ['community', 'communityPost', 'communityNew'],
    go: 'community',
  },
  { key: 'share', label: 'رفادتنا', icon: icons.neighbors, screens: ['share', 'shareCreate', 'shareDetail'], go: 'share' },
  { key: 'chat', label: 'الرسائل', icon: icons.chat, screens: ['chat'], go: 'chat' },
];

export function BottomNav() {
  const { screen, go } = useResident();
  if (NAV_HIDDEN.includes(screen)) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        padding: '10px 6px 26px',
      }}
    >
      {items.map((it) => {
        const on = it.screens.includes(screen);
        const c = on ? color.navy : color.slateLight;
        return (
          <button
            key={it.key}
            onClick={() => go(it.go)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Icon path={it.icon} size={22} stroke={c} width={1.7} />
            <span style={{ fontSize: 10, fontWeight: 800, color: c }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
