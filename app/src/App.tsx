import { useState } from 'react';
import { color, font, radius, shadow } from '@/theme/tokens';
import { Wordmark } from '@/resident/Brand';
import { ResidentApp } from '@/resident/ResidentApp';
import { galleryGroups, galleryScreenCount } from '@/resident/gallery';
import type { ScreenKey } from '@/resident/types';

type AppId = 'resident' | 'provider' | 'admin';
type Mode = 'phone' | 'gallery';

/**
 * The shell from `Jiwar App standalone-src.dc.html`: a toolbar that switches
 * between the three interfaces, and per-app a live phone plus a gallery where
 * every screen renders in full rather than as a title and blurb.
 */
export function App() {
  const [app, setApp] = useState<AppId>('resident');
  const [mode, setMode] = useState<Mode>('phone');
  const [initialScreen, setInitialScreen] = useState<ScreenKey>('home');
  /** Remounts the phone so a gallery tap always lands on the chosen screen. */
  const [phoneKey, setPhoneKey] = useState(0);

  const openInPhone = (key: ScreenKey) => {
    setInitialScreen(key);
    setPhoneKey((k) => k + 1);
    setMode('phone');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: font.sans,
        background: `radial-gradient(1200px 600px at 50% -10%, ${color.pageLift} 0%, ${color.page} 60%)`,
      }}
    >
      <div
        dir="rtl"
        style={{
          width: '100%',
          maxWidth: 1340,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '20px 28px 14px',
          flexWrap: 'wrap',
        }}
      >
        <Wordmark />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: color.navy, lineHeight: 1.2 }}>
            رفادة{' '}
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
          <div style={{ fontSize: 11.5, color: color.slate }}>
            نموذج تفاعلي — كل المراحل 1–4 · {APP_LABEL[app]}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* interface switcher */}
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {(['resident', 'provider', 'admin'] as AppId[]).map((a) => {
            const on = app === a;
            return (
              <button
                key={a}
                onClick={() => {
                  setApp(a);
                  setMode('phone');
                }}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: '7px 18px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: font.sans,
                  background: on ? APP_TONE[a] : 'transparent',
                  color: on ? '#fff' : color.slate,
                  whiteSpace: 'nowrap',
                }}
              >
                {APP_LABEL[a]}
              </button>
            );
          })}
        </div>

        {/* mode switcher */}
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {(
            [
              { k: 'phone' as Mode, l: 'الجوال التفاعلي' },
              { k: 'gallery' as Mode, l: 'معرض الشاشات' },
            ]
          ).map((m) => {
            const on = mode === m.k;
            return (
              <button
                key={m.k}
                onClick={() => setMode(m.k)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: '7px 18px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                  whiteSpace: 'nowrap',
                }}
              >
                {m.l}
              </button>
            );
          })}
        </div>
      </div>

      {app === 'resident' && mode === 'phone' && (
        <div style={{ padding: '6px 0 60px' }}>
          <ResidentApp key={phoneKey} initialScreen={initialScreen} />
        </div>
      )}

      {app === 'resident' && mode === 'gallery' && <ResidentGallery onOpen={openInPhone} />}

      {app !== 'resident' && <NotYetBuilt app={app} />}
    </div>
  );
}

const APP_LABEL: Record<AppId, string> = {
  resident: 'تطبيق الساكن',
  provider: 'مقدم الخدمة',
  admin: 'لوحة الإدارة',
};

const APP_TONE: Record<AppId, string> = {
  resident: color.navy,
  provider: color.green,
  admin: color.gold,
};

/**
 * Live gallery: every screen rendered in full at 0.49 scale, grouped by
 * feature. Tapping a tile opens it in the interactive phone.
 */
function ResidentGallery({ onOpen }: { onOpen: (k: ScreenKey) => void }) {
  return (
    <div
      dir="rtl"
      style={{ width: '100%', maxWidth: 1340, boxSizing: 'border-box', padding: '6px 28px 70px' }}
    >
      <div style={{ fontSize: 13, color: color.slate }}>
        كل شاشة معروضة كاملة وحيّة ({galleryScreenCount} شاشة) — اضغط على أي شاشة لفتحها في الجوال
        التفاعلي.
      </div>

      {galleryGroups.map((g) => (
        <div key={g.name} style={{ marginTop: 30 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14.5,
              fontWeight: 800,
              color: color.navy,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 99, background: color.gold }} />
            {g.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 12 }}>
            {g.screens.map((s) => (
              <div key={s.key} style={{ width: 236, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px' }}>
                  <span
                    style={{
                      fontFamily: font.mono,
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: color.gold,
                      letterSpacing: 1,
                      flex: 'none',
                    }}
                  >
                    {s.id}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: color.navy,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                <div
                  style={{
                    position: 'relative',
                    width: 236,
                    height: 497,
                    borderRadius: 22,
                    overflow: 'hidden',
                    background: '#EDE9DF',
                    boxShadow: shadow.cardStrong,
                  }}
                >
                  <div
                    style={{
                      width: 480,
                      height: 1014,
                      transform: 'scale(0.49)',
                      transformOrigin: 'top right',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* `bare` keeps the status bar (the screens reserve 66px
                        for it) but drops the bezel, so the tile is all app. */}
                    <ResidentApp bare fixedScreen={s.key} width={480} height={1014} />
                  </div>
                  <button
                    onClick={() => onOpen(s.key)}
                    title="فتح في الجوال التفاعلي"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 34,
          background: 'rgba(63,166,107,0.1)',
          borderRadius: 18,
          padding: '14px 18px',
          fontSize: 12.5,
          color: color.greenDeep,
          fontWeight: 700,
          lineHeight: 1.8,
        }}
      >
        كل مراحل المنتج (1–4) مبنية وقابلة للتجربة: الخدمات والسداد والمرافق، المفقودات وتصاريح
        الزوار، المتجر وسوق العقارات، الفعاليات واسأل جيرانك ورفادتنا، والمكافآت ونقاط الثقة.
      </div>
    </div>
  );
}

function NotYetBuilt({ app }: { app: AppId }) {
  return (
    <div
      dir="rtl"
      style={{
        maxWidth: 520,
        margin: '80px 0',
        background: '#fff',
        borderRadius: radius.card,
        padding: 28,
        boxShadow: shadow.card,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 900, color: color.navy }}>{APP_LABEL[app]}</div>
      <div style={{ fontSize: 13, color: color.slate, marginTop: 8, lineHeight: 1.9 }}>
        قيد البناء ضمن هذا المستودع.
      </div>
    </div>
  );
}
