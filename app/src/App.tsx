import { useState, type ReactNode } from 'react';
import { color, font, radius, shadow } from '@/theme/tokens';
import { Wordmark } from '@/resident/Brand';
import { ResidentApp } from '@/resident/ResidentApp';
import { galleryGroups, galleryScreenCount } from '@/resident/gallery';
import type { ScreenKey } from '@/resident/types';
import { ProviderApp } from '@/provider/ProviderApp';
import { providerGallery, providerScreenCount } from '@/provider/gallery';
import type { ProviderScreen } from '@/provider/types';
import { AdminConsole } from '@/admin/AdminConsole';
import { adminGallery, adminScreenCount, type AdminGalleryKey } from '@/admin/gallery';
import type { SectionKey } from '@/admin/data';
import { useLang, t } from '@/i18n/lang';

type AppId = 'resident' | 'provider' | 'admin';
type Mode = 'phone' | 'gallery';

/**
 * The shell from `Jiwar App standalone-src.dc.html`: a toolbar that switches
 * between the three interfaces, and per-app a live phone plus a gallery where
 * every screen renders in full rather than as a title and blurb.
 */
export function App() {
  const { lang, dir, setLang } = useLang();
  const [app, setApp] = useState<AppId>('resident');
  const [mode, setMode] = useState<Mode>('phone');
  const [initialScreen, setInitialScreen] = useState<ScreenKey>('home');
  const [providerScreen, setProviderScreen] = useState<ProviderScreen | null>(null);
  const [adminSection, setAdminSection] = useState<SectionKey | null>(null);
  /** Remounts the phone so a gallery tap always lands on the chosen screen. */
  const [phoneKey, setPhoneKey] = useState(0);

  const openInPhone = (key: ScreenKey) => {
    setInitialScreen(key);
    setPhoneKey((k) => k + 1);
    setMode('phone');
  };

  const openProviderInPhone = (key: ProviderScreen) => {
    setProviderScreen(key);
    setPhoneKey((k) => k + 1);
    setMode('phone');
  };

  const openAdminSection = (key: AdminGalleryKey) => {
    // 'login' is the logged-out console, so it opens as "no section chosen".
    setAdminSection(key === 'login' ? null : key);
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
        dir={dir}
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
            {t('نموذج تفاعلي — كل المراحل 1–4')} · {t(APP_LABEL[app])}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* language switcher — the bilingual shell's AR/EN segmented control */}
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {([
            { k: 'ar' as const, l: 'العربية' },
            { k: 'en' as const, l: 'English' },
          ]).map((o) => {
            const on = lang === o.k;
            return (
              <button
                key={o.k}
                onClick={() => setLang(o.k)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: '7px 18px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                  whiteSpace: 'nowrap',
                }}
              >
                {o.l}
              </button>
            );
          })}
        </div>

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
                {t(APP_LABEL[a])}
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
              { k: 'phone' as Mode, l: t(app === 'admin' ? 'اللوحة التفاعلية' : 'الجوال التفاعلي') },
              { k: 'gallery' as Mode, l: t('معرض الشاشات') },
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

      {app === 'provider' && mode === 'phone' && (
        <div style={{ padding: '6px 0 60px' }}>
          <ProviderApp key={phoneKey} fixedScreen={null} initialScreen={providerScreen} />
        </div>
      )}
      {app === 'provider' && mode === 'gallery' && (
        <ProviderGallery onOpen={openProviderInPhone} />
      )}

      {app === 'admin' && mode === 'phone' && (
        <div style={{ padding: '6px 0 60px', width: '100%', maxWidth: 1400, boxSizing: 'border-box' }}>
          <div
            style={{
              width: '100%',
              height: 940,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: shadow.cardStrong,
              background: '#fff',
            }}
          >
            {/* A definite height so the sidebar and the content pane scroll
                independently, the way the console does at 1360×940. */}
            <AdminConsole
              key={`admin-${phoneKey}`}
              height={940}
              initialSection={adminSection ?? undefined}
            />
          </div>
        </div>
      )}
      {app === 'admin' && mode === 'gallery' && <AdminGallery onOpen={openAdminSection} />}
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
function Gallery<K extends string>({
  intro,
  groups,
  onOpen,
  renderScreen,
  footer,
  /** Tile geometry. Defaults to a phone; the admin console passes a laptop. */
  tile = { w: 236, h: 497, scale: 0.49, frameW: 480, frameH: 1014 },
}: {
  intro: string;
  groups: { name: string; screens: { id: string; key: K; title: string }[] }[];
  onOpen: (k: K) => void;
  renderScreen: (k: K) => ReactNode;
  footer?: ReactNode;
  tile?: { w: number; h: number; scale: number; frameW: number; frameH: number };
}) {
  return (
    <div
      dir="rtl"
      style={{ width: '100%', maxWidth: 1340, boxSizing: 'border-box', padding: '6px 28px 70px' }}
    >
      <div style={{ fontSize: 13, color: color.slate }}>{intro}</div>

      {groups.map((g) => (
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
              <div key={s.key} style={{ width: tile.w, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                    width: tile.w,
                    height: tile.h,
                    borderRadius: 22,
                    overflow: 'hidden',
                    background: '#EDE9DF',
                    boxShadow: shadow.cardStrong,
                  }}
                >
                  <div
                    style={{
                      width: tile.frameW,
                      height: tile.frameH,
                      transform: `scale(${tile.scale})`,
                      transformOrigin: 'top right',
                      pointerEvents: 'none',
                    }}
                  >
                    {renderScreen(s.key)}
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

      {footer}
    </div>
  );
}

function ResidentGallery({ onOpen }: { onOpen: (k: ScreenKey) => void }) {
  return (
    <Gallery
      intro={`كل شاشة معروضة كاملة وحيّة (${galleryScreenCount} شاشة) — اضغط على أي شاشة لفتحها في الجوال التفاعلي.`}
      groups={galleryGroups}
      onOpen={onOpen}
      // `bare` keeps the status bar (screens reserve 66px for it) but drops the
      // bezel, so the tile is all app.
      renderScreen={(k) => <ResidentApp bare fixedScreen={k} width={480} height={1014} />}
      footer={
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
      }
    />
  );
}

function ProviderGallery({ onOpen }: { onOpen: (k: ProviderScreen) => void }) {
  return (
    <Gallery
      intro={`واجهتان في تطبيق واحد — الفني والمتجر (${providerScreenCount} شاشات). اضغط على أي شاشة لفتحها في الجوال التفاعلي.`}
      groups={providerGallery}
      onOpen={onOpen}
      renderScreen={(k) => <ProviderApp bare fixedScreen={k} width={480} height={1014} />}
    />
  );
}

function AdminGallery({ onOpen }: { onOpen: (k: AdminGalleryKey) => void }) {
  return (
    <Gallery
      intro={`لوحة الإدارة كاملة (${adminScreenCount} شاشة) بمقاس سطح المكتب 1360×940 — اضغط على أي شاشة لفتحها في اللوحة التفاعلية.`}
      groups={adminGallery}
      onOpen={onOpen}
      // Three laptop tiles per row inside the 1340px shell.
      tile={{ w: 412, h: 285, scale: 412 / 1360, frameW: 1360, frameH: 940 }}
      renderScreen={(k) =>
        k === 'login' ? (
          <AdminConsole width={1360} height={940} scrollable={false} />
        ) : (
          <AdminConsole
            initialSection={k}
            width={1360}
            height={940}
            scrollable={false}
          />
        )
      }
      footer={
        <div
          style={{
            marginTop: 34,
            background: 'rgba(199,154,60,0.12)',
            borderRadius: radius.card,
            padding: '14px 18px',
            fontSize: 12.5,
            color: color.goldDeep,
            fontWeight: 700,
            lineHeight: 1.8,
          }}
        >
          كل قرار مالي أو حسّاس في هذه اللوحة يمرّ عبر سجل التدقيق — من فعل ماذا ومتى، بلا حذف.
        </div>
      }
    />
  );
}
