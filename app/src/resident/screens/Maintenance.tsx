import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { catDefs, stepsDoneFor, ticketSteps } from '../data/amenities';
import { icons } from '../data/icons';
import { ticketMeta } from '../data/services';
import { useResident } from '../store';
import { t } from '@/i18n/lang';

/** R5 — Create a ticket. */
export function MaintNew() {
  const { st, set, back, go, showToast } = useResident();

  const submit = () => {
    const cat = st.cat ?? t('أخرى');
    const title = st.desc.trim() ? st.desc.trim() : `بلاغ ${cat} جديد`;

    // The auto-assign switch reroutes to instant matching instead of the
    // management queue — that's the whole point of the toggle.
    if (st.autoMatch) {
      set({ reqKind: cat, reqNotes: st.desc, cat: null, desc: '', priority: 'normal' });
      go('matching');
      return;
    }

    const id = st.nextId;
    set((s) => ({
      tickets: [{ id, title, cat, status: 'received', date: t('الآن'), note: null }, ...s.tickets],
      nextId: s.nextId + 1,
      cat: null,
      desc: '',
      priority: 'normal',
      screen: 'maintList',
      hist: [...s.hist, 'maintNew'],
    }));
    showToast(`تم استلام بلاغك — رقم #${id}`);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="بلاغ جديد" onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Label>{t('نوع المشكلة')}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {catDefs.map((c) => {
            const on = st.cat === c.label;
            return (
              <button
                key={c.label}
                onClick={() => set({ cat: c.label })}
                style={{
                  borderRadius: radius.inner,
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  background: on ? 'rgba(199,154,60,0.14)' : '#fff',
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.04)'}`,
                }}
              >
                <Icon path={c.icon} size={21} stroke={on ? color.goldDeep : color.navy} width={1.6} />
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: on ? color.goldDeep : color.navy,
                    fontFamily: font.sans,
                  }}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 16 }}>{t('وصف المشكلة')}</Label>
        <textarea
          value={st.desc}
          onChange={(e) => set({ desc: e.target.value })}
          rows={4}
          placeholder="مثال: تسريب مياه أسفل حوض المطبخ منذ يومين…"
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 13.5,
            color: color.navy,
            boxShadow: shadow.card,
            resize: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />

        <button
          style={{
            width: '100%',
            marginTop: 10,
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
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>
            إضافة صور أو فيديو
          </span>
        </button>

        <Label style={{ marginTop: 16 }}>{t('الأولوية')}</Label>
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
            { k: 'normal', l: t('عادية') },
            { k: 'urgent', l: t('عاجلة') },
          ].map((p) => {
            const on = st.priority === p.k;
            return (
              <button
                key={p.k}
                onClick={() => set({ priority: p.k })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: font.sans,
                  background: on ? (p.k === 'urgent' ? color.coral : color.navy) : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {p.l}
              </button>
            );
          })}
        </div>

        {/* Auto-assign to the marketplace instead of the admin queue. */}
        <button
          onClick={() => set({ autoMatch: !st.autoMatch })}
          style={{
            width: '100%',
            marginTop: 14,
            cursor: 'pointer',
            background: st.autoMatch ? 'rgba(199,154,60,0.1)' : '#fff',
            border: `1.5px solid ${st.autoMatch ? color.gold : 'rgba(0,0,0,0.05)'}`,
            borderRadius: radius.inner,
            padding: '13px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            textAlign: 'right',
          }}
        >
          <Switch on={st.autoMatch} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
              إسناد تلقائي لأقرب مقدم خدمة متاح
            </span>
            <span style={{ fontSize: 10.5, color: color.slate }}>
              بدل الانتظار في طابور مكتب الإدارة
            </span>
          </span>
        </button>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={submit}>
          {st.autoMatch ? t('ابحث عن مقدم خدمة الآن') : t('إرسال البلاغ')}
        </PillButton>
      </div>
    </div>
  );
}

/** R6 — Ticket list. */
export function MaintList() {
  const { st, go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('svcHub')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('بلاغاتي')}</div>
        <div style={{ flex: 1 }} />
        <PillButton tone="gold" size="sm" onClick={() => go('maintNew')}>
          + بلاغ جديد
        </PillButton>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {st.tickets.map((t, i) => {
          const m = ticketMeta[t.status];
          return (
            <button
              key={t.id}
              onClick={() => go('maintDetail', { selIdx: i, starSel: 0 })}
              style={{
                width: '100%',
                textAlign: 'right',
                background: '#fff',
                border: 'none',
                borderRadius: 18,
                padding: '14px 16px',
                boxShadow: shadow.card,
                cursor: 'pointer',
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ ...numeric, fontSize: 11.5, fontWeight: 600, color: color.slate }}>
                  بلاغ #{t.id}
                </span>
                <span style={{ flex: 1 }} />
                <StatusPill bg={m.bg} c={m.c} style={{ fontSize: 11, padding: '3px 12px', fontWeight: 800 }}>
                  {m.label}
                </StatusPill>
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: color.navy, lineHeight: 1.5 }}>
                {t.title}
              </span>
              <span style={{ fontSize: 11.5, color: color.slate }}>
                {t.cat} · {t.date}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** R7 — Ticket detail, timeline and rating. */
export function MaintDetail() {
  const { st, set, back, go, showToast } = useResident();
  const sel = st.tickets[st.selIdx] ?? st.tickets[0];
  const m = ticketMeta[sel.status];
  const stepsDone = stepsDoneFor[sel.status];
  const isResolved = sel.status === 'resolved';
  const rated = !!st.ratedIds[sel.id];

  const sendRating = () => {
    set((s) => ({ ratedIds: { ...s.ratedIds, [sel.id]: true } }));
    showToast('شكرًا لتقييمك');
    // The post-ticket pulse survey is auto-triggered from here (R28).
    window.setTimeout(() => go('survey'), 700);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>
          بلاغ <span style={numeric}>#{sel.id}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusPill bg={m.bg} c={m.c} style={{ fontSize: 11.5, padding: '4px 14px', fontWeight: 800 }}>
              {m.label}
            </StatusPill>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: color.slate }}>
              {sel.cat} · {sel.date}
            </span>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: color.navy, marginTop: 10, lineHeight: 1.6 }}>
            {sel.title}
          </div>
        </Card>

        <Card pad="18px 16px 8px" style={{ borderRadius: 18, marginTop: 12 }}>
          {ticketSteps.map((s, i) => {
            const done = i < stepsDone;
            const current = i === stepsDone - 1 && !isResolved;
            const last = i === ticketSteps.length - 1;
            return (
              <div key={s.label} style={{ display: 'flex', gap: 12 }}>
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
                        minHeight: 22,
                        background: i < stepsDone - 1 ? color.green : color.tileWarm,
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
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: color.slateLight }}>
                    {done ? (s.time ? `${sel.date} — ${s.time}` : (s.sub ?? '')) : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        {sel.note && (
          <div style={{ background: color.tile, borderRadius: radius.inner, padding: '13px 16px', marginTop: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: color.goldDeep }}>
              ملاحظة الفني — محمد الغامدي
            </div>
            <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 4, lineHeight: 1.7 }}>
              {sel.note}
            </div>
          </div>
        )}

        {isResolved && !rated && (
          <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t('قيّم تجربتك مع الفني')}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => set({ starSel: n })}
                  aria-label={`${n} نجوم`}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2 }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24">
                    <path
                      d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-1z"
                      fill={n <= st.starSel ? color.gold : 'rgba(199,154,60,0.12)'}
                      stroke={color.gold}
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="أضف تعليقًا (اختياري)"
              style={{
                width: '100%',
                marginTop: 10,
                background: color.bg,
                border: 'none',
                borderRadius: radius.tile,
                padding: '11px 14px',
                fontSize: 12.5,
                color: color.navy,
                resize: 'none',
                boxSizing: 'border-box',
                fontFamily: font.sans,
              }}
            />
            <PillButton full onClick={sendRating} style={{ marginTop: 10, padding: 11, fontSize: 13.5 }}>
              إرسال التقييم
            </PillButton>
          </Card>
        )}

        {isResolved && rated && (
          <div
            style={{
              background: 'rgba(63,166,107,0.12)',
              borderRadius: 18,
              padding: 16,
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon path={icons.check} size={22} stroke={color.green} width={2.4} />
            <span style={{ fontSize: 13, fontWeight: 800, color: color.greenDeep }}>
              شكرًا! تقييمك يساعدنا في تحسين الخدمة
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared toggle switch, matching the prototype's 40×22 pill. */
export function Switch({ on, w = 40 }: { on: boolean; w?: number }) {
  const knob = w === 40 ? 17 : 15;
  return (
    <span
      style={{
        width: w,
        height: 22,
        borderRadius: 99,
        background: on ? color.green : color.line,
        position: 'relative',
        flex: 'none',
        transition: 'background .18s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2.5,
          left: on ? w - knob - 2.5 : 2.5,
          width: knob,
          height: knob,
          borderRadius: 99,
          background: '#fff',
          transition: 'left .18s ease',
        }}
      />
    </span>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}
