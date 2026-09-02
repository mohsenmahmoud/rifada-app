import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton } from '@/ui/primitives';
import {
  EDITABLE_MEMBER_IDX,
  famDefs,
  newAccountPermDefs,
  permDefs,
  relationDefs,
} from '../data/family';
import { icons } from '../data/icons';
import { UNIT_SHORT } from '../data/seed';
import { useResident } from '../store';
import { Note } from './parts';
import { t } from '@/i18n/lang';

/** R43 — Family members; the owner creates each account and sets its rights. */
function Members() {
  const { st, set, back, go, showToast } = useResident();

  const createAccount = () => {
    const name = st.nfName.trim() || t('فرد العائلة');
    const count = Object.values(st.nfPerms).filter(Boolean).length;
    set({
      nfDone: {
        name,
        phone: st.nfPhone.trim() || '05x xxx xxxx',
        code: `FAM-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      famInviteShown: false,
      nfName: '',
      nfPhone: '',
    });
    showToast(`${t('تم إنشاء حساب')} ${name} ${t('بـ')}${count} ${t('صلاحيات — الدعوة في الطريق')}`);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t('أفراد العائلة')}</div>
        <PillButton
          tone="gold"
          size="sm"
          onClick={() => set((s) => ({ famInviteShown: !s.famInviteShown, nfDone: null }))}
          style={{ padding: '8px 16px', fontSize: 11.5 }}
        >
          {t('+ دعوة فرد جديد')}
        </PillButton>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div style={{ fontSize: 11.5, color: color.slate, margin: '4px 2px 10px' }}>
          أنت مالك الوحدة — تتحكم في صلاحيات كل فرد مرتبط بـ{t(UNIT_SHORT)}
        </div>

        {famDefs.map((f, i) => {
          const granted =
            i === EDITABLE_MEMBER_IDX
              ? Object.values(st.famPerms).filter(Boolean).length
              : f.full
                ? 6
                : 3;
          return (
            <button
              key={t(f.name)}
              onClick={() => go('famPerms', { selFamIdx: i })}
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                background: '#fff',
                borderRadius: 18,
                padding: '15px 16px',
                boxShadow: shadow.card,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'right',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  background: f.avBg,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 800,
                  flex: 'none',
                }}
              >
                {f.name[0]}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(f.name)}</span>
                <span style={{ fontSize: 11, color: color.slate }}>
                  {t(f.rel)} · {f.full ? t('كل الصلاحيات') : `${granted} ${t('من 6 صلاحيات')}`}
                </span>
              </span>
              <Icon path="M15 5l-7 7 7 7" size={14} stroke={color.slateLight} width={2} />
            </button>
          );
        })}

        {st.famInviteShown && (
          <Card pad={18} style={{ marginTop: 6 }}>
            <div style={{ fontSize: 13.5, fontWeight: 900, color: color.navy }}>
              {t('إنشاء حساب لفرد جديد')}
            </div>
            <div style={{ fontSize: 10.5, color: color.slate, marginTop: 3 }}>
              {t('أنت من ينشئ الحساب ويحدد صلاحياته — الفرد يستلم دعوة جاهزة فقط')}
            </div>

            <input
              value={st.nfName}
              onChange={(e) => set({ nfName: e.target.value })}
              placeholder="اسم الفرد"
              style={{ ...wellInput, marginTop: 12 }}
            />
            <input
              dir="ltr"
              value={st.nfPhone}
              onChange={(e) => set({ nfPhone: e.target.value })}
              placeholder="رقم الجوال"
              style={{ ...wellInput, marginTop: 8, fontSize: 12.5 }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
              {relationDefs.map((r) => {
                const on = st.nfRel === r;
                return (
                  <button
                    key={r}
                    onClick={() => set({ nfRel: r })}
                    style={{
                      borderRadius: radius.pill,
                      padding: '7px 15px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: on ? color.navy : '#fff',
                      color: on ? '#fff' : color.slate,
                      border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
                      fontFamily: font.sans,
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, color: color.navy, margin: '14px 0 4px' }}>
              {t('صلاحيات الحساب من البداية')}
            </div>
            {newAccountPermDefs.map((p) => {
              const on = st.nfPerms[p.key];
              return (
                <button
                  key={p.key}
                  onClick={() => set((s) => ({ nfPerms: { ...s.nfPerms, [p.key]: !s.nfPerms[p.key] } }))}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    textAlign: 'right',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <SmallSwitch on={on} />
                  <span style={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: color.navy }}>
                    {t(p.label)}
                  </span>
                </button>
              );
            })}

            <PillButton
              tone="gold"
              full
              onClick={createAccount}
              style={{ marginTop: 14, padding: 13, fontSize: 13.5 }}
            >
              {t('إنشاء الحساب وإرسال الدعوة')}
            </PillButton>
          </Card>
        )}

        {st.nfDone && (
          <div
            style={{
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              borderRadius: 18,
              padding: 18,
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>
              تم إنشاء حساب {t(st.nfDone.name)} ✓
            </div>
            <div
              dir="ltr"
              style={{
                ...numeric,
                fontSize: 24,
                fontWeight: 700,
                color: color.gold,
                letterSpacing: 5,
                marginTop: 10,
              }}
            >
              {st.nfDone.code}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 6,
                textAlign: 'center',
                lineHeight: 1.9,
              }}
            >
              أُرسلت الدعوة برسالة SMS إلى {st.nfDone.phone} — يدخل بالكود ويجد الصلاحيات التي حددتها
              مفعّلة
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * R44 — Per-member permissions.
 *
 * Only Yousef's switches are live; toggling them and then previewing shows the
 * locked-not-hidden treatment across the whole app.
 */
function Permissions() {
  const { st, set, back, showToast } = useResident();
  const member = famDefs[st.selFamIdx] ?? famDefs[0];
  const editable = st.selFamIdx === EDITABLE_MEMBER_IDX;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>صلاحيات {t(member.name)}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad="2px 16px">
          {permDefs.map((p) => {
            const on = editable
              ? st.famPerms[p.key]
              : member.full
                ? true
                : (['maint', 'amen', 'food'] as const).includes(p.key as never);
            return (
              <button
                key={p.key}
                onClick={() =>
                  editable
                    ? set((s) => ({ famPerms: { ...s.famPerms, [p.key]: !s.famPerms[p.key] } }))
                    : showToast('هذه نسخة تجريبية — عدّل صلاحيات يوسف لتجربة القفل الحي')
                }
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  textAlign: 'right',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 99,
                    background: on ? color.green : color.line,
                    position: 'relative',
                    flex: 'none',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2.5,
                      left: on ? 21 : 2.5,
                      width: 17,
                      height: 17,
                      borderRadius: 99,
                      background: '#fff',
                      transition: 'left .15s',
                    }}
                  />
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(p.label)}</span>
                  <span style={{ fontSize: 10.5, color: color.slateLight }}>{t(p.sub)}</span>
                </span>
              </button>
            );
          })}
        </Card>

        <div style={{ marginTop: 12 }}>
          <Note tone="navy">
            المزايا الممنوعة تظهر لـ{t(member.name)} رمادية مع أيقونة قفل — لا تختفي، حتى يعرف أنها
            تحتاج إذنك.
          </Note>
        </div>

        {editable && (
          <PillButton
            full
            onClick={() => {
              set({ actingAs: 'yousef', screen: 'home', hist: [] });
              showToast('👁 أنت الآن ترى التطبيق بعين يوسف — المزايا الممنوعة مقفلة');
            }}
            style={{ marginTop: 12, padding: 13, fontSize: 13 }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              عاين التطبيق بعين {t(member.name)}
              <Icon path={icons.lock} size={14} stroke="#fff" width={1.8} />
            </span>
          </PillButton>
        )}
      </div>
    </div>
  );
}

function SmallSwitch({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        background: on ? color.green : color.line,
        position: 'relative',
        flex: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: 99,
          background: '#fff',
          transition: 'left .15s',
        }}
      />
    </span>
  );
}

const wellInput: React.CSSProperties = {
  width: '100%',
  background: color.bg,
  border: 'none',
  borderRadius: radius.tile,
  padding: '12px 15px',
  fontSize: 13,
  color: color.navy,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

export const Family = { Members, Permissions };
