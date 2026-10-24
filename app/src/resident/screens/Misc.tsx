import { useState } from 'react';
import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  BackButton, Card, EmptyState, PillButton, ScreenHeader, StatusPill,
} from '@/ui/primitives';
import { Wordmark } from '../Brand';
import { icons } from '../data/icons';
import { marketDefs } from '../data/marketplace';
import {
  contactDefs,
  docDefs,
  linkDefs,
  moveTabDefs,
  notifDefs,
  petDef,
  redeemDefs,
  redeemTiles,
  renewDefs,
  scoreItems,
  surveyChipDefs,
  profileTileDefs,
  TRUST_MAX,
  TRUST_SCORE,
  visitFilterDefs,
  visitStateMeta,
} from '../data/misc';
import { fmt, statementTotal } from '../data/payments';
import { useLang } from '@/i18n/lang';
import { ME_UNIT, UNIT_SHORT } from '../data/seed';
import { useResident } from '../store';
import type { VisitEntry, VisitPeriod } from '../types';
import { ChipRow } from './parts';
import { Radio } from './Marketplace';
import { t } from '@/i18n/lang';

/* ------------------------------------------------------------------ *
 * R14 — Profile
 * ------------------------------------------------------------------ */

function Profile() {
  const { cfg, set, go, initials, isFam, isRent, can, lockToast, showToast } = useResident();
  const { lang, setLang } = useLang();

  const groups = [
    {
      title: t('الحساب والوحدة'),
      items: [
        {
          label: t('أفراد العائلة والصلاحيات'),
          icon: icons.people,
          act: () => (isFam ? lockToast() : go('family')),
        },
        {
          label: t('الوثائق وعقد الوحدة'),
          icon: icons.file,
          act: () => (can('findocs') ? go('docs') : lockToast()),
        },
        { label: t('الحيوانات الأليفة'), icon: icons.pets, act: () => go('pets') },
      ],
    },
    // The «نشاطي» group is gone — its three histories are the quick tiles
    // at the top of the screen now.
    {
      title: t('الخصوصية والدعم'),
      items: [
        { label: t('مشاركة البيانات بين الكمبوندات'), icon: icons.shield, act: () => go('consent') },
        { label: t('المساعدة والدعم'), icon: icons.help, act: () => go('chat') },
      ],
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      {/* The identity card moved into the header: avatar, greeting, unit chip
          and settings, with no back button — the profile is a bottom-bar
          destination, not somewhere you arrive from a particular screen. */}
      <div style={{ padding: '66px 22px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: 99,
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            border: `2px solid ${color.gold}`,
            color: color.goldSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 900,
            flex: 'none',
          }}
        >
          {t(initials)}
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, color: color.slateLight }}>{t('أهلًا')}</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: color.navy, whiteSpace: 'nowrap' }}>
            {t(cfg.residentName)}
          </span>
        </span>
        <span
          style={{
            background: '#fff',
            color: color.navy,
            borderRadius: radius.pill,
            padding: '6px 14px',
            fontSize: 10.5,
            fontWeight: 800,
            boxShadow: shadow.card,
            whiteSpace: 'nowrap',
            flex: 'none',
          }}
        >
          {t(UNIT_SHORT)}
        </span>
        <button
          onClick={() => showToast(t('الإعدادات المتقدمة — قريبًا'))}
          aria-label={t('الإعدادات')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            border: 'none',
            background: '#fff',
            boxShadow: shadow.card,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon path={icons.gear} size={17} width={1.5} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 130px' }}>
        {/* What you owe, as a way straight into payment. */}
        <button
          onClick={() => (can('pay') ? go('pay') : lockToast())}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(155deg,${color.navyLift},${color.navy})`,
            borderRadius: 20,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            boxShadow: '0 8px 24px rgba(31,59,87,0.22)',
            textAlign: 'start',
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: 'rgba(199,154,60,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path="M3 7h18v12H3zM3 11h18M16 15h2" size={20} stroke={color.goldSoft} width={1.6} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.65)' }}>
              {t('المستحق حتى 25 يوليو')}
            </span>
            <span style={{ ...numeric, fontSize: 19, fontWeight: 700, color: '#fff' }}>
              {fmt(statementTotal(isRent))} {t('ر.س')}
            </span>
          </span>
          <span
            style={{
              background: color.gold,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '8px 18px',
              fontSize: 11.5,
              fontWeight: 800,
              flex: 'none',
              fontFamily: font.sans,
            }}
          >
            {t('ادفع')}
          </span>
        </button>

        {/* The four histories that used to sit in a «نشاطي» list. */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginTop: 14 }}
        >
          {profileTileDefs.map((tile) => (
            <button
              key={tile.label}
              onClick={() => tile.open(go, set)}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: '#fff',
                borderRadius: 16,
                padding: '13px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: shadow.card,
              }}
            >
              <Icon path={tile.icon} size={20} width={1.5} />
              <span
                style={{ fontSize: 10, fontWeight: 800, color: color.navy, fontFamily: font.sans }}
              >
                {t(tile.label)}
              </span>
            </button>
          ))}
        </div>

        {/* preferences */}
        <Card pad="4px 16px" style={{ marginTop: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <PrefIcon path="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: color.navy }}>{t('اللغة')}</span>
            {/* A live switch, per the design's `switchToEn` handler — the
                prototype turned this chip from a label into a real button. */}
            <span style={{ display: 'flex', background: color.tile, borderRadius: radius.pill, padding: 3 }}>
              {([
                { k: 'ar' as const, l: 'العربية' },
                { k: 'en' as const, l: 'English' },
              ]).map((o) => {
                const on = lang === o.k;
                return (
                  <button
                    key={o.k}
                    onClick={() => {
                      if (on) return;
                      setLang(o.k);
                      showToast(o.k === 'en' ? 'Language switched to English' : 'تم التبديل إلى العربية');
                    }}
                    style={{
                      border: 'none',
                      cursor: on ? 'default' : 'pointer',
                      background: on ? color.navy : 'transparent',
                      color: on ? '#fff' : color.slate,
                      borderRadius: radius.pill,
                      padding: '4px 13px',
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: font.sans,
                    }}
                  >
                    {t(o.l)}
                  </button>
                );
              })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px 0' }}>
            <PrefIcon path={icons.bell} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: color.navy }}>
              {t('الإشعارات')}
            </span>
            <span
              style={{
                width: 44,
                height: 25,
                borderRadius: 99,
                background: color.green,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: 22,
                  width: 19,
                  height: 19,
                  borderRadius: 99,
                  background: '#fff',
                }}
              />
            </span>
          </div>
        </Card>

        {groups.map((g) => (
          <div key={t(g.title)}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: color.slateLight, margin: '18px 6px 8px' }}>
              {t(g.title)}
            </div>
            <Card pad="4px 16px">
              {g.items.map((it, i) => (
                <button
                  key={t(it.label)}
                  onClick={it.act}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '14px 0',
                    borderBottom: i === g.items.length - 1 ? undefined : '1px solid rgba(0,0,0,0.05)',
                    textAlign: 'start',
                  }}
                >
                  <PrefIcon path={it.icon} />
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: color.navy }}>
                    {t(it.label)}
                  </span>
                  <Icon path="M15 5l-7 7 7 7" size={13} stroke={color.slateLight} width={2} />
                </button>
              ))}
            </Card>
          </div>
        ))}

        <button
          onClick={() => showToast(t('تم تسجيل الخروج'))}
          style={{
            width: '100%',
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            padding: '15px 0',
            borderRadius: radius.card,
            boxShadow: shadow.card,
          }}
        >
          <Icon path="M15 4h4v16h-4M11 8l-4 4 4 4M7 12h9" size={17} stroke={color.coral} width={1.7} />
          <span style={{ fontSize: 13.5, fontWeight: 800, color: color.coral }}>{t('تسجيل الخروج')}</span>
        </button>
      </div>
    </div>
  );
}

function PrefIcon({ path }: { path: string }) {
  return (
    <span
      style={{
        width: 34,
        height: 34,
        borderRadius: 11,
        background: color.tile,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        marginLeft: 12,
      }}
    >
      <Icon path={path} size={17} width={1.6} />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * R22 — Notifications
 * ------------------------------------------------------------------ */

function Notifications() {
  const { back, isRent } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الإشعارات')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {notifDefs.map((n, i) => (
          <div
            key={t(n.title)}
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: '13px 16px',
              boxShadow: shadow.card,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              borderRight: `3px solid ${n.bar}`,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={n.icon} size={18} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: color.navy, lineHeight: 1.5 }}>
                {i === 0 ? `${t(n.title)} ${fmt(statementTotal(isRent))} ${t('ر.س')}` : t(n.title)}
              </span>
              <span style={{ fontSize: 11.5, color: color.slate }}>{t(n.sub)}</span>
            </span>
            <span style={{ fontSize: 10.5, color: color.slateLight, whiteSpace: 'nowrap' }}>
              {t(n.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R23 — Chat with the management office
 * ------------------------------------------------------------------ */

function Chat() {
  const { st, set } = useResident();

  const send = () => {
    const body = st.chatInput.trim();
    if (!body) return;
    set((s) => ({
      chatMsgs: [...s.chatMsgs, { me: true, text: body, time: t('الآن') }],
      chatInput: '',
    }));
    // The office replies a beat later, so the thread feels two-way.
    window.setTimeout(
      () =>
        set((s) => ({
          chatMsgs: [
            ...s.chatMsgs,
            { me: false, text: t('وصلتنا رسالتك — نراجعها ونرد عليك خلال دقائق.'), time: t('الآن') },
          ],
        })),
      900,
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '66px 22px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          flex: 'none',
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 99,
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Wordmark size={20} onDark />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: color.navy }}>{t('إدارة الكمبوند')}</span>
          <span style={{ fontSize: 10.5, color: color.green, fontWeight: 700 }}>
            {t('متصل الآن · يرد خلال دقائق')}
          </span>
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {st.chatMsgs.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: c.me ? 'flex-start' : 'flex-end' }}>
            <div
              style={{
                maxWidth: '78%',
                background: c.me ? color.navy : '#fff',
                color: c.me ? '#fff' : color.navy,
                borderRadius: c.me ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                padding: '9px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>{t(c.text)}</span>
              <span
                style={{
                  fontSize: 9.5,
                  color: c.me ? 'rgba(255,255,255,0.6)' : color.slateLight,
                  alignSelf: 'flex-end',
                }}
              >
                {t(c.time)} {c.me ? '✓✓' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 16px 100px', display: 'flex', gap: 8, background: color.bg }}>
        <input
          value={st.chatInput}
          onChange={(e) => set({ chatInput: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('اكتب رسالتك…')}
          style={{
            flex: 1,
            minWidth: 0,
            background: '#fff',
            border: 'none',
            borderRadius: radius.pill,
            padding: '12px 18px',
            fontSize: 13.5,
            color: color.navy,
            boxShadow: shadow.card,
            fontFamily: font.sans,
          }}
        />
        <button
          onClick={send}
          aria-label="إرسال"
          style={{
            width: 46,
            height: 46,
            borderRadius: 99,
            border: 'none',
            cursor: 'pointer',
            background: color.navy,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon
            path="M3 11l18-8-8 18-2.5-7.5z"
            size={19}
            stroke="#fff"
            width={1.7}
            style={{ transform: 'scaleX(-1)' }}
          />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R24 / R25 — Rewards and the redemption sheet
 * ------------------------------------------------------------------ */

function Rewards() {
  const { st, set, go, showToast } = useResident();

  const doRedeem = () => {
    const r = redeemDefs[st.redeemSel];
    if (st.points < r.pts) {
      showToast(t('نقاطك لا تكفي لهذا الخيار'));
      return;
    }
    set((s) => ({ points: s.points - r.pts, redeemOpen: false }));
    showToast(`${t('تم الاستبدال:')} ${t(r.cash)} ${t('— خُصمت')} ${r.pts.toLocaleString('en-US')} ${t('نقطة')}`);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 21, fontWeight: 900, color: color.navy }}>{t('المكافآت')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 130px' }}>
        {/* the navy → purple points card */}
        <div
          style={{
            background: `linear-gradient(140deg,${color.navy} 0%,${color.purple} 100%)`,
            borderRadius: radius.card,
            padding: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon path={icons.gem} size={26} stroke={color.gold} width={1.5} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              {t('نقاط المكافآت')}
            </span>
          </div>
          <div style={{ ...numeric, fontSize: 38, fontWeight: 700, color: '#fff', marginTop: 6 }}>
            {st.points.toLocaleString('en-US')}{' '}
            <span
              style={{
                fontFamily: font.sans,
                fontSize: 15,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {t('نقطة')}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            {t('تكسب نقاطًا مع كل سداد في موعده، وتقييم بلاغ، ومشاركة في الفعاليات')}
          </div>
        </div>

        <button
          onClick={() => go('score')}
          style={{
            width: '100%',
            marginTop: 10,
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: 18,
            padding: '13px 16px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            textAlign: 'start',
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 99,
              background: 'rgba(199,154,60,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={icons.star} size={19} stroke={color.gold} width={1.5} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>
              {t('نقاط الثقة:')} {TRUST_SCORE} {t('— مستوى ذهبي')}
            </span>
            <span style={{ fontSize: 11, color: color.slate }}>
              {t('سجل سداد إيجابي يفيدك في عقود مستقبلية')}
            </span>
          </span>
          <Icon path="M15 5l-7 7 7 7" size={13} stroke={color.slateLight} width={2} />
        </button>

        <div style={{ fontSize: 15, fontWeight: 800, color: color.navy, margin: '18px 2px 10px' }}>
          {t('استبدال')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {redeemTiles.map((item) => (
            <button
              key={t(item.label)}
              onClick={() => set({ redeemOpen: true, redeemTitle: item.label, redeemSel: 1 })}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                borderRadius: 18,
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 8,
                textAlign: 'start',
              }}
            >
              <Icon path={item.icon} size={22} stroke={color.gold} width={1.6} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.5 }}>
                {t(item.label)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* R25 — frosted redemption sheet */}
      {st.redeemOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 55,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() => set({ redeemOpen: false })}
            aria-label="إغلاق"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(21,42,63,0.5)',
              backdropFilter: 'blur(5px)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
          <div
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(14px)',
              borderRadius: '26px 26px 0 0',
              padding: '20px 20px 40px',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: 38,
                height: 4,
                borderRadius: 99,
                background: color.lineSoft,
                margin: '0 auto 14px',
              }}
            />
            <div style={{ fontSize: 16.5, fontWeight: 900, color: color.navy }}>{t(st.redeemTitle)}</div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 2 }}>
              رصيدك: {st.points.toLocaleString('en-US')} نقطة
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {redeemDefs.map((r, i) => {
                const afford = st.points >= r.pts;
                const on = st.redeemSel === i;
                return (
                  <button
                    key={t(r.cash)}
                    onClick={() =>
                      afford ? set({ redeemSel: i }) : showToast(t('نقاطك لا تكفي لهذا الخيار'))
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: on ? 'rgba(199,154,60,0.1)' : '#fff',
                      border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.06)'}`,
                      borderRadius: radius.inner,
                      padding: '13px 14px',
                      cursor: afford ? 'pointer' : 'not-allowed',
                      opacity: afford ? 1 : 0.45,
                      textAlign: 'start',
                    }}
                  >
                    <Radio on={on} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t(r.cash)}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ ...numeric, fontSize: 12.5, fontWeight: 600, color: color.slate }}>
                      {r.pts.toLocaleString('en-US')} نقطة
                    </span>
                  </button>
                );
              })}
            </div>
            <PillButton
              tone="gold"
              full
              onClick={doRedeem}
              style={{ marginTop: 14, padding: 13, fontSize: 14.5 }}
            >
              {t('استبدال الآن')}
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R26 — Trust score
 * ------------------------------------------------------------------ */

function Score() {
  const { back } = useResident();
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const filled = (TRUST_SCORE / TRUST_MAX) * circumference;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('نقاط الثقة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={22} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={r} fill="none" stroke={color.tileAlt} strokeWidth="11" />
              <circle
                cx="65"
                cy="65"
                r={r}
                fill="none"
                stroke={color.gold}
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circumference}`}
                transform="rotate(-90 65 65)"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ ...numeric, fontSize: 30, fontWeight: 700, color: color.navy }}>
                {TRUST_SCORE}
              </span>
              <span style={{ fontSize: 10.5, color: color.slate }}>{t('من')} {TRUST_MAX}</span>
            </div>
          </div>
          <StatusPill tone="gold" style={{ fontSize: 12, padding: '5px 18px', fontWeight: 800, marginTop: 12 }}>
            {t('مستوى ذهبي')}
          </StatusPill>
          <div
            style={{
              fontSize: 11.5,
              color: color.slate,
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 1.8,
            }}
          >
            {t('سجل السداد الإيجابي يفيدك عند التقدم لعقود إيجار أو تقسيط مستقبلية')}
          </div>
        </Card>

        <Card pad="6px 16px" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, padding: '12px 0 4px' }}>
            {t('كيف تكوّنت نقاطك')}
          </div>
          {scoreItems.map((si, i) => (
            <div
              key={t(si.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: i === scoreItems.length - 1 ? undefined : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: 12.5, color: color.slateDark }}>{t(si.label)}</span>
              <span style={{ flex: 1 }} />
              <span
                style={{
                  ...numeric,
                  fontSize: 13,
                  fontWeight: 700,
                  color: si.positive ? color.green : color.coral,
                }}
              >
                {t(si.pts)}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R12 — Move-in / move-out checklist
 * ------------------------------------------------------------------ */

function MoveIn() {
  const { st, set, go } = useResident();
  // Handover stays locked until a move-out request is filed with the office,
  // so only the two editable tabs have a checklist behind them.
  const editableTab = st.moveTab === 'handover' ? null : st.moveTab;
  const locked = editableTab === null;
  const rooms = editableTab ? st.moveRooms[editableTab] : [];

  let done = 0;
  let total = 0;
  st.moveRooms.receive.forEach((r) =>
    r.items.forEach((it) => {
      total++;
      if (it.done) done++;
    }),
  );
  const pct = Math.round((done / total) * 100);

  const toggle = (ri: number, ii: number) => {
    if (!editableTab) return;
    set((s) => ({
      moveRooms: {
        ...s.moveRooms,
        [editableTab]: s.moveRooms[editableTab].map((room, r) =>
          r !== ri
            ? room
            : {
                ...room,
                items: room.items.map((it, k) => (k === ii ? { ...it, done: !it.done } : it)),
              },
        ),
      },
    }));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('الانتقال والاستلام')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {moveTabDefs.map((item) => {
            const on = st.moveTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => set({ moveTab: item.key })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 8,
                  fontSize: 12.5,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {t(item.label)}
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: radius.card,
            padding: '16px 18px',
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{t('متبقي 3 أيام على الاستلام!')}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
            {t('موعد الاستلام: الأحد 13 يوليو — 11 صباحًا')}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[t('دليل الترحيب'), t('فيديو تعريفي')].map((p) => (
              <span
                key={p}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: radius.pill,
                  padding: '5px 14px',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {t(p)}
              </span>
            ))}
          </div>
        </div>

        {locked ? (
          <Card
            pad="22px 18px"
            style={{
              borderRadius: 18,
              marginTop: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon
              path="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v3"
              size={26}
              stroke={color.slateLight}
              width={1.6}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: color.slate,
                textAlign: 'center',
                lineHeight: 1.8,
              }}
            >
              {t('تُفعَّل قائمة التسليم عند تقديم طلب إخلاء الوحدة من إدارة الكمبوند')}
            </span>
          </Card>
        ) : (
          <>
            <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>
                  {st.moveTab === 'before' ? t('قبل الانتقال') : t('قبل الاستلام')}
                </span>
                <span style={{ flex: 1 }} />
                <StatusPill tone="gold" style={{ fontSize: 10.5, padding: '3px 12px', fontWeight: 800 }}>
                  {t('قيد التنفيذ')}
                </StatusPill>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 99,
                  background: color.tileAlt,
                  marginTop: 12,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 99,
                    background: color.gold,
                    transition: 'width .3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 6 }}>{pct}{t('% مكتمل')}</div>
            </Card>

            {rooms.map((room, ri) => (
              <Card key={t(room.name)} pad="14px 16px" style={{ borderRadius: 18, marginTop: 10 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy, marginBottom: 4 }}>
                  {t(room.name)}
                </div>
                {room.items.map((it, ii) => (
                  <div
                    key={t(it.label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}
                  >
                    <button
                      onClick={() => toggle(ri, ii)}
                      aria-label={t(it.label)}
                      style={{
                        width: 23,
                        height: 23,
                        borderRadius: 8,
                        border: `1.5px solid ${it.done ? color.green : t(color.line)}`,
                        background: it.done ? color.green : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                        padding: 0,
                      }}
                    >
                      <Icon
                        path={icons.check}
                        size={13}
                        stroke="#fff"
                        width={3}
                        style={{ opacity: it.done ? 1 : 0 }}
                      />
                    </button>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 600,
                        color: it.done ? color.slateLight : color.navy,
                      }}
                    >
                      {t(it.label)}
                    </span>
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 99,
                        background: color.tile,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      <Icon path={icons.camera} size={15} stroke={color.slate} width={1.5} />
                    </span>
                  </div>
                ))}
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R17 — Vehicles and visitor gate passes
 * ------------------------------------------------------------------ */

/** Ⅰ:MM ص/م from a 24-hour `<input type="time">` value. */
function fmtTime(v: string): string {
  if (!v) return '';
  const [h, m] = v.split(':').map(Number);
  const suffix = h >= 12 ? t('م') : t('ص');
  const hh = h % 12 || 12;
  return `${hh}${m ? `:${String(m).padStart(2, '0')}` : ''} ${suffix}`;
}

/** D/M from an ISO `<input type="date">` value. */
function fmtDate(v: string): string {
  if (!v) return t('غدًا');
  const [, m, d] = v.split('-');
  return `${parseInt(d, 10)}/${parseInt(m, 10)}`;
}

/** Shared input chrome for the gate forms. */
const gateInput: React.CSSProperties = {
  width: '100%',
  background: color.bg,
  border: 'none',
  borderRadius: radius.tile,
  padding: '12px 14px',
  fontSize: 13.5,
  fontWeight: 600,
  color: color.navy,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

/** One row of the visit log, shared by R17 and R17b. */
function VisitRow({ v }: { v: VisitEntry }) {
  const meta = visitStateMeta[v.st];
  const label = v.st === 'out' ? `${t('خرج')} ${t(v.exit ?? '')}` : t(meta.label);
  return (
    <Card
      pad="11px 14px"
      style={{ borderRadius: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 11 }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: color.tile,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon
          path="M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
          size={15}
          width={1.5}
        />
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(v.name)}</span>
        <span style={{ fontSize: 10.5, color: color.slate }}>{t(v.when)}</span>
      </span>
      <span
        style={{
          background: meta.bg,
          color: meta.c,
          borderRadius: radius.pill,
          padding: '3px 11px',
          fontSize: 10,
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Card>
  );
}

/**
 * R17 — «سياراتك والزوار». The visitor pass became a scheduled permit: a
 * start, an optional end, and an SMS to the visitor. Vehicles are editable,
 * and every issued pass drops into the visit log underneath.
 */
function GatePass() {
  const { st, set, back, go, showToast } = useResident();

  const passDayLabel = fmtDate(st.passDate);
  const issuePass = () => {
    const when = `${passDayLabel} — ${fmtTime(st.passStart)}${
      st.passEndOn && st.passEnd ? ` ${t('حتى')} ${fmtTime(st.passEnd)}` : ''
    }`;
    const name = st.visitorName.trim() || t('زائر');
    const phone = st.visitorPhone.trim();
    set((s) => ({
      passIssued: true,
      passName: name,
      passWhen: when,
      visitorFormOpen: false,
      visitLog: [{ name, when, st: 'upcoming', exit: null }, ...s.visitLog],
    }));
    showToast(
      phone
        ? `${t('صدر التصريح — وصل للأمن وبرسالة إلى')} ${phone}`
        : t('صدر التصريح — وصل للأمن، أضف رقم الزائر ليصله الكود برسالة'),
    );
  };

  const saveVehicle = () => {
    const name = st.vehName.trim();
    const plate = st.vehPlate.trim();
    if (!name || !plate) {
      showToast(t('اكتب نوع العربية ورقم اللوحة'));
      return;
    }
    if (st.vehForm === -1) {
      set((s) => ({ vehiclesList: [...s.vehiclesList, { name, plate }], vehForm: null }));
      showToast(t('سُجّلت عربيتك — الدخول الآلي يتفعّل بعد اعتماد الأمن'));
    } else {
      set((s) => ({
        vehiclesList: s.vehiclesList.map((v, i) => (i === s.vehForm ? { name, plate } : v)),
        vehForm: null,
      }));
      showToast(t('حُفظت تعديلات العربية'));
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('سياراتك والزوار')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '6px 2px 8px' }}>
          {t('مركباتك المسجلة')}
        </div>
        {st.vehiclesList.map((v, i) => (
          <Card
            key={v.plate}
            pad="13px 16px"
            style={{ borderRadius: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.cars} size={20} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(v.name)}</span>
              {/* Plates are Arabic letters + Latin digits; forcing LTR keeps
                  the grouping stable in both interface directions. */}
              <span dir="ltr" style={{ fontSize: 11, color: color.slate, textAlign: 'start' }}>
                {v.plate}
              </span>
            </span>
            <button
              onClick={() => set({ vehForm: i, vehName: v.name, vehPlate: v.plate })}
              style={{
                border: 'none',
                background: color.bg,
                cursor: 'pointer',
                borderRadius: radius.pill,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 800,
                color: color.navy,
                fontFamily: font.sans,
                flex: 'none',
              }}
            >
              {t('تعديل')}
            </button>
          </Card>
        ))}

        {st.vehForm !== null ? (
          <Card pad={16} style={{ borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>
              {st.vehForm === -1 ? t('أضف عربيتك') : t('تعديل بيانات العربية')}
            </div>
            <input
              value={st.vehName}
              onChange={(e) => set({ vehName: e.target.value })}
              placeholder={t('نوع العربية ولونها — مثال: تويوتا كامري بيضاء')}
              style={gateInput}
            />
            <input
              dir="ltr"
              value={st.vehPlate}
              onChange={(e) => set({ vehPlate: e.target.value })}
              placeholder={t('رقم اللوحة')}
              style={{ ...gateInput, textAlign: 'start' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <PillButton full onClick={saveVehicle} style={{ padding: 11, fontSize: 12.5 }}>
                {st.vehForm === -1 ? t('إضافة العربية') : t('حفظ التعديلات')}
              </PillButton>
              <PillButton
                tone="ghost"
                onClick={() => set({ vehForm: null })}
                style={{ padding: '11px 20px', fontSize: 12.5 }}
              >
                {t('إلغاء')}
              </PillButton>
            </div>
          </Card>
        ) : (
          <button
            onClick={() => set({ vehForm: -1, vehName: '', vehPlate: '' })}
            style={{
              width: '100%',
              border: `1.5px dashed ${color.line}`,
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: 18,
              padding: 13,
              fontSize: 12.5,
              fontWeight: 800,
              color: color.slate,
              fontFamily: font.sans,
            }}
          >
            {t('+ أضف عربيتك')}
          </button>
        )}

        <PillButton
          full
          tone={st.visitorFormOpen ? 'ghost' : 'navy'}
          onClick={() => set((s) => ({ visitorFormOpen: !s.visitorFormOpen }))}
          style={{ marginTop: 14, padding: 13, fontSize: 13.5 }}
        >
          {st.visitorFormOpen ? t('إغلاق النموذج') : t('إصدار تصريح زائر')}
        </PillButton>

        {st.visitorFormOpen && (
          <Card
            pad={16}
            style={{ borderRadius: 18, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <FieldLabel>{t('اسم الزائر')}</FieldLabel>
            <input
              value={st.visitorName}
              onChange={(e) => set({ visitorName: e.target.value })}
              placeholder={t('مثال: محمد الشناوي')}
              style={gateInput}
            />
            <FieldLabel>{t('رقم جوال الزائر')}</FieldLabel>
            <input
              dir="ltr"
              value={st.visitorPhone}
              onChange={(e) => set({ visitorPhone: e.target.value })}
              placeholder="05x xxx xxxx"
              inputMode="tel"
              style={{ ...gateInput, textAlign: 'start' }}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FieldLabel>{t('بداية الزيارة')}</FieldLabel>
                <input
                  type="date"
                  value={st.passDate}
                  onChange={(e) => set({ passDate: e.target.value })}
                  style={gateInput}
                />
                <input
                  type="time"
                  value={st.passStart}
                  onChange={(e) => set({ passStart: e.target.value })}
                  style={gateInput}
                />
              </div>
              {st.passEndOn && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FieldLabel style={{ flex: 1 }}>{t('نهاية الزيارة')}</FieldLabel>
                    <button
                      onClick={() => set({ passEndOn: false })}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: color.slateLight,
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: font.sans,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="date"
                    value={st.passEndDate}
                    onChange={(e) => set({ passEndDate: e.target.value })}
                    style={gateInput}
                  />
                  <input
                    type="time"
                    value={st.passEnd}
                    onChange={(e) => set({ passEnd: e.target.value })}
                    style={gateInput}
                  />
                </div>
              )}
            </div>
            {!st.passEndOn && (
              <button
                onClick={() => set({ passEndOn: true })}
                style={{
                  border: `1.5px dashed ${color.line}`,
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: radius.tile,
                  padding: 11,
                  fontSize: 12,
                  fontWeight: 800,
                  color: color.slate,
                  fontFamily: font.sans,
                }}
              >
                {t('+ أضف وقت انتهاء (اختياري)')}
              </button>
            )}
            <PillButton full onClick={issuePass} style={{ padding: 12, fontSize: 13.5 }}>
              {t('أصدر التصريح')}
            </PillButton>
          </Card>
        )}

        {st.passIssued && (
          <Card pad={16} style={{ borderRadius: 18, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 99,
                  background: 'rgba(63,166,107,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path="M4 12.5l5 5L20 6.5" size={13} stroke={color.green} width={2.4} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: color.greenDeep }}>
                {t('صدر التصريح — وصل للأمن ولرقم الزائر برسالة')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 12 }}>
              <Icon path={icons.qr} size={34} width={1.5} style={{ flex: 'none' }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: color.navy }}>
                  {t(st.passName)} · <span dir="ltr">GT-8214</span>
                </span>
                <span style={{ fontSize: 11, color: color.slate }}>{st.passWhen}</span>
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: color.slateLight, marginTop: 10 }}>
              {t('يظهر الكود للحظات ثم يُحفظ في سجل الزيارات')}
            </div>
          </Card>
        )}

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '18px 2px 8px' }}>
          {t('سجل الزيارات')}
        </div>
        {st.visitLog.slice(0, 3).map((v, i) => (
          <VisitRow key={`${v.name}-${i}`} v={v} />
        ))}
        {st.visitLog.length > 3 && (
          <button
            onClick={() => go('visitLog')}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 10,
              fontSize: 12,
              fontWeight: 800,
              color: color.gold,
              fontFamily: font.sans,
            }}
          >
            {t('عرض كل الزيارات')} ({st.visitLog.length}) ←
          </button>
        )}
      </div>
    </div>
  );
}

/** R17b — the full visit log, filtered by period. */
function VisitLog() {
  const { st, set, back } = useResident();
  const rows = st.visitLog.filter(
    (v) => st.vlFilter === 'all' || (v.period ?? 'week') === st.vlFilter,
  );
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('سجل الزيارات')} onBack={back} />
      <ChipRow
        chips={visitFilterDefs}
        value={st.vlFilter}
        onPick={(k: VisitPeriod | 'all') => set({ vlFilter: k })}
        style={{ padding: '4px 18px 10px' }}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 40px' }}>
        {rows.length === 0 ? (
          <EmptyState
            icon="M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
            title={t('لا زيارات في هذه الفترة')}
          />
        ) : (
          rows.map((v, i) => <VisitRow key={`${v.name}-${i}`} v={v} />)
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R18 / R18b / R19 — Lost & found
 * ------------------------------------------------------------------ */

/**
 * A lost-item thumbnail. These are the app's only remote images, so a failed
 * load falls back to the camera placeholder rather than a broken-image glyph.
 */
function LostPhoto({ src, size, height }: { src?: string; size: number; height?: number }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <Icon path={icons.camera} size={size} stroke={color.slateLight} width={1.5} />;
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      style={{
        width: '100%',
        height: height ?? '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}

function LostBrowse() {
  const { st, back, go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('المفقودات')}</div>
        <div style={{ flex: 1 }} />
        <PillButton tone="gold" size="sm" onClick={() => go('lostReport')}>
          {t('+ إبلاغ')}
        </PillButton>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {st.lostItems.map((li, i) => (
            <button
              key={`${t(li.title)}-${i}`}
              onClick={() => go('lostDetail', { selLostIdx: i })}
              style={{
                background: '#fff',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'start',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: shadow.card,
              }}
            >
              <div
                style={{
                  height: 84,
                  background: color.tile,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LostPhoto src={li.photo} size={30} />
              </div>
              <div
                style={{
                  padding: '11px 13px 13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <StatusPill
                  tone={li.kind === 'found' ? 'green' : 'coral'}
                  style={{ alignSelf: 'flex-start', fontSize: 9.5, padding: '2px 10px', fontWeight: 800 }}
                >
                  {li.kind === 'found' ? t('وُجد') : t('مفقود')}
                </StatusPill>
                <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(li.title)}</span>
                <span style={{ fontSize: 10.5, color: color.slate, lineHeight: 1.6 }}>
                  {t(li.loc)} · {t(li.date)}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: color.slateLight }}>
                  {t('أبلغ عنها')} {t(li.owner ?? ME_UNIT)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * R18b — one lost-and-found report, with a way to reach whoever filed it.
 * Contact stays inside the app: neither side sees the other's number.
 */
function LostDetail() {
  const { st, back, go, showToast } = useResident();
  const li = st.lostItems[st.selLostIdx] ?? st.lostItems[0];
  const owner = li.owner ?? ME_UNIT;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تفاصيل البلاغ')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={0} style={{ borderRadius: radius.card, overflow: 'hidden' }}>
          {li.photo && (
            <div
              style={{
                height: 190,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LostPhoto src={li.photo} size={44} height={190} />
            </div>
          )}
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <StatusPill
              tone={li.kind === 'found' ? 'green' : 'coral'}
              style={{ alignSelf: 'flex-start', fontSize: 10, padding: '3px 12px', fontWeight: 800 }}
            >
              {li.kind === 'found' ? t('وُجد') : t('مفقود')}
            </StatusPill>
            <span style={{ fontSize: 17, fontWeight: 900, color: color.navy }}>{t(li.title)}</span>
            <span style={{ fontSize: 12, color: color.slate, lineHeight: 1.7 }}>
              {t(li.loc)} · {t(li.date)}
            </span>
          </div>
        </Card>

        <Card
          pad="14px 16px"
          style={{ borderRadius: 18, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 99,
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              flex: 'none',
            }}
          >
            {t(owner)[0]}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(owner)}</span>
            <span style={{ fontSize: 11, color: color.slate }}>{t('أبلغ عنها')}</span>
          </span>
        </Card>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <PillButton
            full
            onClick={() => {
              go('chat');
              showToast(`${t('فُتحت محادثة مع')} ${t(owner)}`);
            }}
            style={{ padding: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          >
            <Icon path={icons.chat} size={15} stroke="#fff" width={1.6} />
            {t('افتح محادثة')}
          </PillButton>
          <PillButton
            tone="ghost"
            onClick={() => showToast(`${t('جاري الاتصال بـ')}${t(owner)}…`)}
            style={{ padding: '12px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}
          >
            <Icon path={icons.call} size={15} width={1.6} />
            {t('اتصال')}
          </PillButton>
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: color.slateLight,
            textAlign: 'center',
            marginTop: 12,
            lineHeight: 1.7,
          }}
        >
          {t('التواصل داخل التطبيق — بلاغ موثّق بوحدة صاحبه')}
        </div>
      </div>
    </div>
  );
}

function LostReport() {
  const { st, set, back, showToast } = useResident();

  const submit = () => {
    const title = st.lostTitle.trim() || t('غرض بدون اسم');
    const loc = st.lostLoc.trim() || t('داخل الكمبوند');
    set((s) => ({
      lostItems: [{ title, loc, date: t('الآن'), kind: s.lostKind }, ...s.lostItems],
      lostTitle: '',
      lostLoc: '',
      screen: 'lost',
      hist: [...s.hist, 'lostReport'],
    }));
    showToast(t('تم نشر البلاغ — سيصل إشعار للسكان'));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الإبلاغ عن غرض')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {[
            { k: 'found' as const, l: t('وجدت غرضًا') },
            { k: 'lost' as const, l: t('فقدت غرضًا') },
          ].map((item) => {
            const on = st.lostKind === item.k;
            return (
              <button
                key={item.k}
                onClick={() => set({ lostKind: item.k })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {t(item.l)}
              </button>
            );
          })}
        </div>

        <FieldLabel style={{ marginTop: 16 }}>{t('ما هو الغرض؟')}</FieldLabel>
        <input
          value={st.lostTitle}
          onChange={(e) => set({ lostTitle: e.target.value })}
          placeholder={t('مثال: مفتاح سيارة')}
          style={inputStyle}
        />
        <FieldLabel style={{ marginTop: 14 }}>{t('أين؟')}</FieldLabel>
        <input
          value={st.lostLoc}
          onChange={(e) => set({ lostLoc: e.target.value })}
          placeholder={t('مثال: بجوار البوابة الرئيسية')}
          style={inputStyle}
        />
        <button
          style={{
            width: '100%',
            marginTop: 12,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'transparent',
            borderRadius: radius.inner,
            padding: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Icon path={icons.camera} size={18} stroke={color.slate} width={1.5} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>{t('إضافة صورة')}</span>
        </button>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={submit}>
          {t('نشر البلاغ')}
        </PillButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R20 / R21 — Service detail (kept reachable from the gallery)
 * ------------------------------------------------------------------ */

function MarketBrowse() {
  const { back, go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('خدمات معتمدة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {marketDefs.map((m, i) => (
          <button
            key={t(m.name)}
            onClick={() => go('marketDetail', { mdIdx: i })}
            style={{
              width: '100%',
              textAlign: 'start',
              background: '#fff',
              border: 'none',
              borderRadius: 18,
              padding: '14px 16px',
              boxShadow: shadow.card,
              cursor: 'pointer',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={m.icon} size={20} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(m.name)}</span>
              <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                {t(m.vendor)} · ★ {m.rating}
              </span>
            </span>
            <span style={{ ...numeric, fontSize: 13, fontWeight: 700, color: color.goldDeep }}>
              {t(m.price)} {t('ر.س')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MarketDetail() {
  const { st, back, go } = useResident();
  const m = marketDefs[st.mdIdx] ?? marketDefs[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تفاصيل الخدمة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 30px' }}>
        <Card pad={18}>
          <div style={{ fontSize: 17, fontWeight: 900, color: color.navy }}>{t(m.name)}</div>
          <div style={{ fontSize: 12, color: color.slate, marginTop: 3 }}>
            {t(m.vendor)} · ★ {m.rating} ({m.reviews} {t('تقييمًا)')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
            <span style={{ ...numeric, fontSize: 26, fontWeight: 700, color: color.navy }}>
              {t(m.price)}
            </span>
            <span style={{ fontSize: 12.5, color: color.slate }}>{t('ر.س')} {t(m.unit)}</span>
          </div>
          <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 10, lineHeight: 1.9 }}>
            {t(m.desc)}
          </div>
        </Card>
        <Card pad="14px 16px" style={{ borderRadius: 18, marginTop: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t('آخر التقييمات')}</div>
          <div style={{ fontSize: 12, color: color.slateDark, marginTop: 8, lineHeight: 1.8 }}>
            {t('«خدمة ممتازة وفي الموعد» — نورة، فيلا 88')}
          </div>
          <div style={{ fontSize: 12, color: color.slateDark, marginTop: 4, lineHeight: 1.8 }}>
            {t('«تعامل محترم وسعر مناسب» — فهد، فيلا 152')}
          </div>
        </Card>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => go('reqService')}
          style={{ boxShadow: '0 6px 18px rgba(199,154,60,0.35)' }}
        >
          {t('احجز الخدمة')}
        </PillButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R28 — Post-ticket pulse survey
 * ------------------------------------------------------------------ */

function Survey() {
  const { st, set, back, showToast } = useResident();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 24px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, color: color.navy, lineHeight: 1.6 }}>
        {t('كيف كانت تجربتك بشكل عام هذا الشهر؟')}
      </div>
      <div style={{ fontSize: 12.5, color: color.slate, marginTop: 6 }}>
        {t('استبيان سريع — إجابتك تصل مباشرة لإدارة الكمبوند')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = st.surveySel === n;
          return (
            <button
              key={n}
              onClick={() => set({ surveySel: n })}
              style={{
                width: 56,
                height: 56,
                borderRadius: 99,
                cursor: 'pointer',
                background: on ? color.gold : '#fff',
                border: `2px solid ${on ? color.gold : 'rgba(0,0,0,0.08)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...numeric,
                fontSize: 18,
                fontWeight: 700,
                color: on ? '#fff' : color.navy,
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 6px' }}>
        <span style={{ fontSize: 10.5, color: color.coral, fontWeight: 700 }}>{t('غير راضٍ')}</span>
        <span style={{ fontSize: 10.5, color: color.green, fontWeight: 700 }}>{t('ممتاز')}</span>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, margin: '24px 0 8px' }}>
        {t('ما أكثر ما يحتاج تحسينًا؟')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {surveyChipDefs.map((label) => {
          const on = !!st.surveyChipsSel[surveyChipDefs.indexOf(label)];
          return (
            <button
              key={label}
              onClick={() =>
                set((s) => ({
                  surveyChipsSel: {
                    ...s.surveyChipsSel,
                    [surveyChipDefs.indexOf(label)]: !on,
                  },
                }))
              }
              style={{
                borderRadius: radius.pill,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                background: on ? 'rgba(31,59,87,0.08)' : '#fff',
                color: color.navy,
                border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
                fontFamily: font.sans,
              }}
            >
              {t(label)}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <PillButton
        size="lg"
        full
        onClick={() => {
          back();
          showToast(t('شكرًا! تم إرسال تقييمك لإدارة الكمبوند'));
        }}
      >
        {t('إرسال')}
      </PillButton>
      <button
        onClick={back}
        style={{
          width: '100%',
          marginTop: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: color.slate,
          fontSize: 12.5,
          fontWeight: 700,
          padding: 8,
          fontFamily: font.sans,
        }}
      >
        {t('تخطي')}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * R29 / R30 / R32 / D1–D3
 * ------------------------------------------------------------------ */

function Consent() {
  const { st, set, back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('مشاركة البيانات')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Card pad={18}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: color.navy, lineHeight: 1.7 }}>
            {t('انقل سجلك معك عند الانتقال بين الكمبوندات المدعومة برفادة')}
          </div>
          <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 10, lineHeight: 2 }}>
            {t('عند موافقتك، يُشارك سجل السداد ونقاط الثقة الخاصة بك مع إدارة الكمبوند الجديد فقط — ما يسهّل قبول طلبك ويمنحك مزايا الساكن الموثّق من اليوم الأول.')}
          </div>
          <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 8, lineHeight: 2 }}>
            {t('لا تُشارك بياناتك مع أي طرف ثالث، ويمكنك سحب الموافقة في أي وقت من الإعدادات.')}
          </div>
        </Card>

        <Card
          pad="14px 16px"
          style={{ borderRadius: 18, marginTop: 12, display: 'flex', alignItems: 'center' }}
        >
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: color.navy }}>
            {t('أوافق على مشاركة سجلي')}
          </span>
          <button
            onClick={() => set({ consentOn: !st.consentOn })}
            aria-label="تبديل الموافقة"
            style={{
              width: 46,
              height: 26,
              borderRadius: 99,
              border: 'none',
              cursor: 'pointer',
              background: st.consentOn ? color.green : color.line,
              position: 'relative',
              transition: 'background .2s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: st.consentOn ? 23 : 3,
                width: 20,
                height: 20,
                borderRadius: 99,
                background: '#fff',
                transition: 'left .2s',
              }}
            />
          </button>
        </Card>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          size="lg"
          full
          onClick={() => {
            back();
            showToast(st.consentOn ? t('حُفظ تفضيلك — المشاركة مفعّلة') : t('حُفظ تفضيلك — المشاركة متوقفة'));
          }}
        >
          {t('حفظ التفضيل')}
        </PillButton>
      </div>
    </div>
  );
}

function Pets() {
  const { back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الحيوانات الأليفة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 99,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={icons.pets} size={26} width={1.6} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: color.navy }}>{t(petDef.name)}</span>
            <span style={{ fontSize: 11.5, color: color.slate }}>{t(petDef.sub)}</span>
          </span>
          <StatusPill tone="green" style={{ fontSize: 10.5, padding: '3px 12px', fontWeight: 800 }}>
            {t('تطعيمات سارية')}
          </StatusPill>
        </Card>

        <Card pad="6px 16px" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, padding: '12px 0 4px' }}>
            {t('سجل التطعيمات')}
          </div>
          {petDef.vaccines.map((v, i) => (
            <div
              key={t(v.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: i === petDef.vaccines.length - 1 ? undefined : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: 12.5, color: color.slateDark }}>{t(v.label)}</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: color.greenDeep }}>{t(v.until)}</span>
            </div>
          ))}
        </Card>

        <div
          style={{
            background: 'rgba(31,59,87,0.06)',
            borderRadius: 18,
            padding: '13px 16px',
            marginTop: 12,
            fontSize: 11.5,
            color: color.slateDark,
            lineHeight: 1.9,
          }}
        >
          {t(petDef.policy)}
        </div>

        <PillButton
          tone="outline"
          full
          onClick={() => showToast(t('نموذج تسجيل حيوان أليف جديد'))}
          style={{ marginTop: 12, padding: 12, fontSize: 13.5 }}
        >
          {t('+ تسجيل حيوان أليف جديد')}
        </PillButton>
      </div>
    </div>
  );
}

function Docs() {
  const { back, go, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الوثائق')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <button
          onClick={() => go('renew')}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: 18,
            padding: '15px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'start',
          }}
        >
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>
              {t('عقد الصيانة السنوي ينتهي بعد 5 أشهر')}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              {t('جدّد الآن واختر عرضًا حصريًا')}
            </span>
          </span>
          <span
            style={{
              background: color.gold,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            {t('التجديد')}
          </span>
        </button>

        {docDefs.map((d) => (
          <Card
            key={t(d.name)}
            pad="14px 16px"
            style={{ borderRadius: 18, marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.docs} size={18} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(d.name)}</span>
              <span style={{ fontSize: 11, color: color.slate }}>{t(d.sub)}</span>
            </span>
            <button
              onClick={() => showToast(`${t('جارٍ تحميل')} ${t(d.name)}…`)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 800,
                color: color.gold,
                fontFamily: font.sans,
              }}
            >
              {t('تحميل')}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Renew() {
  const { st, set, back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تجديد العقد')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 30px' }}>
        <Card pad={16}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>
            {t('عقد الخدمات والصيانة السنوي')}
          </div>
          <div style={{ fontSize: 11.5, color: color.slate, marginTop: 3 }}>
            {t(UNIT_SHORT)} {t('· ينتهي 31 ديسمبر 2026')}
          </div>
        </Card>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '16px 2px 8px' }}>
          {t('اختر عرض التجديد')}
        </div>
        {renewDefs.map((r, i) => {
          const on = st.renewSel === i;
          return (
            <button
              key={t(r.title)}
              onClick={() => set({ renewSel: i })}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: on ? 'rgba(199,154,60,0.1)' : '#fff',
                border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.05)'}`,
                borderRadius: radius.inner,
                padding: 14,
                cursor: 'pointer',
                marginBottom: 8,
                textAlign: 'start',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  border: `1.5px solid ${on ? color.gold : t(color.line)}`,
                  background: on ? color.gold : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon
                  path={icons.check}
                  size={13}
                  stroke="#fff"
                  width={3}
                  style={{ opacity: on ? 1 : 0 }}
                />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(r.title)}</span>
                <span style={{ fontSize: 11, color: color.slate }}>{t(r.sub)}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '0 20px 34px', display: 'flex', gap: 10 }}>
        <PillButton
          tone="gold"
          onClick={() => {
            showToast(t('تم إرسال طلب التجديد — ستتواصل معك الإدارة للتوقيع'));
            back();
          }}
          style={{ flex: 1, padding: 13, fontSize: 14 }}
        >
          {t('اختر العرض')}
        </PillButton>
        <PillButton
          tone="outline"
          onClick={() => showToast(t('تفاصيل العقد الكاملة'))}
          style={{ flex: 1, padding: 13, fontSize: 14 }}
        >
          {t('التفاصيل')}
        </PillButton>
      </div>
    </div>
  );
}

function Contacts() {
  const { back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('أرقام مهمة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {contactDefs.map((ct) => (
          <Card
            key={t(ct.name)}
            pad="14px 16px"
            style={{ borderRadius: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(ct.name)}</span>
              <span style={{ fontSize: 11, color: color.slate }}>{t(ct.sub)}</span>
            </span>
            <button
              onClick={() => showToast(`${t('جارٍ الاتصال بـ')}${t(ct.name)}…`)}
              aria-label={`${t('اتصال بـ')}${t(ct.name)}`}
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                border: 'none',
                background: 'rgba(63,166,107,0.12)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.contacts} size={18} stroke={color.green} width={1.6} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Links() {
  const { back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('روابط سريعة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {linkDefs.map((lk) => (
          <button
            key={t(lk.name)}
            onClick={() => showToast(`${t('فتح')} ${t(lk.name)}`)}
            style={{
              width: '100%',
              textAlign: 'start',
              background: '#fff',
              border: 'none',
              borderRadius: 18,
              padding: '14px 16px',
              boxShadow: shadow.card,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.links} size={17} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(lk.name)}</span>
              <span style={{ fontSize: 11, color: color.slate }}>{t(lk.sub)}</span>
            </span>
            <Icon path="M15 5l-7 7 7 7" size={13} stroke={color.slateLight} width={2} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Coming soon — the placeholder the navigation reserves for later cycles
 * ------------------------------------------------------------------ */

function ComingSoon() {
  const { st, back } = useResident();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 30px',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 26,
          background: color.tile,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          path="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2L19 19M19 5l-2.8 2.8M7.8 16.2L5 19"
          size={34}
          stroke={color.gold}
          width={1.7}
        />
      </div>
      <div style={{ fontSize: 19, fontWeight: 900, color: color.navy, marginTop: 16 }}>
        {st.soonTitle || t('قريبًا')}
      </div>
      <StatusPill tone="gold" style={{ fontSize: 11.5, padding: '4px 16px', fontWeight: 800, marginTop: 10 }}>
        {t('ضمن المرحلة')} {st.soonCycle}
      </StatusPill>
      <div
        style={{
          fontSize: 13,
          color: color.slate,
          marginTop: 12,
          textAlign: 'center',
          lineHeight: 1.8,
        }}
      >
        {t('هذه الخدمة قادمة قريبًا في رفادة — التنقّل جاهز لها منذ الآن.')}
      </div>
      <PillButton tone="outline" onClick={back} style={{ marginTop: 22, padding: '10px 34px', fontSize: 13.5 }}>
        {t('العودة')}
      </PillButton>
    </div>
  );
}

function FieldLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 6, ...style }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: 'none',
  borderRadius: radius.inner,
  padding: '13px 16px',
  fontSize: 13.5,
  fontWeight: 600,
  color: color.navy,
  boxShadow: shadow.card,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

export const Misc = {
  Profile,
  Notifications,
  Chat,
  Rewards,
  Score,
  MoveIn,
  GatePass,
  VisitLog,
  LostBrowse,
  LostDetail,
  LostReport,
  MarketBrowse,
  MarketDetail,
  Survey,
  Consent,
  Pets,
  Docs,
  Renew,
  Contacts,
  Links,
  ComingSoon,
};
