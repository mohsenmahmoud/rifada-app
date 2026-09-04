import { color, font, numeric } from '@/theme/tokens';
import {
  amenDefs,
  broadcastReach,
  broadcastTargets,
  cannedReplies,
  gateLog,
  resDefs,
  threadDefs,
} from '../data';
import { useAdmin } from '../store';
import {
  Avatar,
  Bar,
  Btn,
  Card,
  ChipToggle,
  Field,
  Grid,
  Pill,
  Spacer,
  TableCard,
  TableHead,
  TableRow,
  initialOf,
} from '../ui';
import { t } from '@/i18n/lang';

/* ============================= A5 — residents ============================= */

export function Residents() {
  const { st, set } = useAdmin();
  const q = st.resQuery.trim();
  const rows = q ? resDefs.filter((r) => `${t(r.name)} ${t(r.unit)}`.includes(q)) : resDefs;

  return (
    <>
      <input
        value={st.resQuery}
        onChange={(e) => set({ resQuery: e.target.value })}
        placeholder={t('ابحث بالاسم أو رقم الوحدة…')}
        style={{
          width: 340,
          background: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: '12px 20px',
          fontSize: 13,
          color: color.navy,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: 14,
          fontFamily: font.sans,
        }}
      />
      <TableCard>
        <TableHead>
          <span style={{ width: 100 }}>{t('الوحدة')}</span>
          <span style={{ flex: 1 }}>{t('الساكن (المالك)')}</span>
          <span style={{ width: 110 }}>{t('أفراد العائلة')}</span>
          <span style={{ width: 130 }}>{t('الهاتف')}</span>
          <span style={{ width: 110 }}>{t('نموذج الدفع')}</span>
          <span style={{ width: 110 }}>{t('حالة السداد')}</span>
        </TableHead>
        {rows.map((r, i) => {
          const famOpen = st.openFamRow === i;
          const famCount = r.fam?.length ?? 0;
          return (
            <div key={t(r.unit)} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px' }}
              >
                <button
                  onClick={() => set({ sec: 'unit360', u360Unit: t(r.unit) })}
                  style={{
                    width: 100,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'start',
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: color.navy,
                    fontFamily: font.sans,
                    padding: 0,
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(31,59,87,0.25)',
                    textUnderlineOffset: 3,
                  }}
                >
                  {t(r.unit)}
                </button>
                <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Avatar name={t(r.name)} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                    {t(r.name)}
                  </span>
                </span>
                <span style={{ width: 110 }}>
                  <button
                    onClick={() => famCount && set({ openFamRow: famOpen ? null : i })}
                    style={{
                      border: 'none',
                      cursor: famCount ? 'pointer' : 'default',
                      background: famCount ? 'rgba(31,59,87,0.07)' : 'transparent',
                      color: famCount ? color.navy : color.slateLight,
                      borderRadius: 999,
                      padding: '4px 13px',
                      fontSize: 10.5,
                      fontWeight: 800,
                      fontFamily: font.sans,
                    }}
                  >
                    {famCount ? `${famCount} ${t('أفراد')} ${famOpen ? '▴' : '▾'}` : t('لا أحد')}
                  </button>
                </span>
                <span
                  dir="ltr"
                  style={{
                    width: 130,
                    ...numeric,
                    fontSize: 11.5,
                    color: color.slate,
                    textAlign: 'start',
                  }}
                >
                  {t(r.phone)}
                </span>
                <span style={{ width: 110, fontSize: 11.5, color: color.slateDark }}>{t(r.model)}</span>
                <span style={{ width: 110 }}>
                  <Pill
                    bg={r.ok ? 'rgba(63,166,107,0.13)' : 'rgba(228,103,90,0.13)'}
                    c={r.ok ? color.greenDeep : color.coralDeep}
                  >
                    {t(r.pay)}
                  </Pill>
                </span>
              </div>
              {famOpen && r.fam && (
                <div style={{ background: '#FAF8F3', padding: '6px 18px 12px' }}>
                  {r.fam.map((fm) => (
                    <div
                      key={t(fm.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 0',
                        marginRight: 112,
                        borderBottom: '1px dashed rgba(0,0,0,0.05)',
                      }}
                    >
                      <Avatar name={t(fm.name)} size={24} bg={fm.avBg} />
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: color.navy }}>
                        {t(fm.name)}
                      </span>
                      <span style={{ fontSize: 10.5, color: color.slate }}>{t(fm.rel)}</span>
                      <Spacer />
                      <Pill bg="rgba(31,59,87,0.07)" c={color.navy} style={{ fontSize: 9.5 }}>
                        {t(fm.perms)}
                      </Pill>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', fontSize: 12.5, color: color.slateLight }}>
            {t('لا سكان مطابقون للبحث.')}
          </div>
        )}
      </TableCard>
    </>
  );
}

/* ============================= A6 — broadcast ============================= */

export function Broadcast() {
  const { st, set, showToast } = useAdmin();

  const send = (scheduled: boolean) => {
    const title = st.bcTitle.trim();
    if (!title) {
      showToast(t('اكتب عنوان الإعلان أولًا'));
      return;
    }
    const target = broadcastTargets[st.bcTarget];
    const reach = broadcastReach[st.bcTarget];
    set((s) => ({
      bcSent: [
        { title, target, reach, time: scheduled ? 'مجدول — غدًا 9:00 ص' : 'الآن' },
        ...s.bcSent,
      ],
      bcTitle: '',
      bcBody: '',
    }));
    showToast(
      scheduled
        ? `جُدول الإعلان للإرسال غدًا — ${target}`
        : `أُرسل الإعلان إلى ${reach} ساكن — ${target}`,
    );
  };

  return (
    <Grid cols="1.4fr 1fr">
      <Card pad={22}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t('إعلان جديد')}</div>
        <div style={{ marginTop: 12 }}>
          <Field
            value={st.bcTitle}
            onChange={(v) => set({ bcTitle: v })}
            placeholder={t('عنوان الإعلان')}
            style={{ fontSize: 13.5, fontWeight: 700, padding: '13px 16px' }}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Field
            value={st.bcBody}
            onChange={(v) => set({ bcBody: v })}
            placeholder={t('نص الإعلان…')}
            rows={4}
            style={{ padding: '13px 16px' }}
          />
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: color.navy, margin: '14px 0 8px' }}>
          {t('الجمهور المستهدف')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {broadcastTargets.map((tg, i) => (
            <ChipToggle
              key={tg}
              label={t(tg)}
              on={st.bcTarget === i}
              onClick={() => set({ bcTarget: i })}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Btn tone="gold" size="lg" onClick={() => send(false)} style={{ flex: 1 }}>
            {t('إرسال الآن')}
          </Btn>
          <Btn
            tone="outline"
            size="lg"
            onClick={() => send(true)}
            style={{ flex: 1, border: `1.5px solid ${color.navy}` }}
          >
            {t('جدولة لاحقًا')}
          </Btn>
        </div>
      </Card>

      <Card pad={22}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t('المرسلة مؤخرًا')}</div>
        {st.bcSent.map((b, i) => (
          <div
            key={`${t(b.title)}-${i}`}
            style={{ padding: '11px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(b.title)}</span>
              <Spacer />
              <span style={{ fontSize: 10, color: color.slateLight }}>{t(b.time)}</span>
            </div>
            <div style={{ fontSize: 11, color: color.slate, marginTop: 2 }}>
              {b.target} {t('· وصل إلى')} {b.reach} ساكن
            </div>
          </div>
        ))}
      </Card>
    </Grid>
  );
}

/* =========================== A16 — resident messages =========================== */

export function MessagesInbox() {
  const { st, set, showToast } = useAdmin();
  const thread = threadDefs[st.threadIdx];
  const msgs = st.threadMsgs[st.threadIdx] ?? [];

  const push = (text: string) => {
    if (!text.trim()) return;
    set((s) => ({
      threadMsgs: {
        ...s.threadMsgs,
        [s.threadIdx]: [...(s.threadMsgs[s.threadIdx] ?? []), { me: true, text }],
      },
      inboxDraft: '',
    }));
  };

  return (
    <Grid cols="300px 1fr" style={{ height: 560 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflowY: 'auto',
          padding: 8,
        }}
      >
        {threadDefs.map((th, i) => {
          const list = st.threadMsgs[i] ?? [];
          const last = list[list.length - 1];
          return (
            <button
              key={t(th.name)}
              onClick={() => set({ threadIdx: i })}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'start',
                background: st.threadIdx === i ? color.tile : 'transparent',
                borderRadius: 14,
                padding: 12,
              }}
            >
              <Avatar name={t(th.name)} size={36} />
              <span
                style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(th.name)}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: color.slate,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {last?.text ?? t(th.unit)}
                </span>
              </span>
              {th.unread && st.threadIdx !== i && (
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 99,
                    background: color.gold,
                    flex: 'none',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(thread.name)}</span>
          <span style={{ fontSize: 11, color: color.slate }}>· {t(thread.unit)}</span>
          <Spacer />
          <Btn
            tone="outline"
            size="sm"
            onClick={() => showToast(t('أُسندت المحادثة إلى ماجد البقمي (مشرف صيانة)'))}
          >
            {t('تعيين لموظف')}
          </Btn>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.me ? 'flex-start' : 'flex-end' }}>
              <div
                style={{
                  maxWidth: '70%',
                  background: m.me ? color.navy : color.bg,
                  color: m.me ? '#fff' : color.slateDark,
                  borderRadius: m.me ? '16px 16px 16px 5px' : '16px 16px 5px 16px',
                  padding: '9px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  lineHeight: 1.7,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
              >
                {t(m.text)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {cannedReplies.map((c) => (
              <button
                key={c}
                onClick={() => push(c)}
                style={{
                  border: '1.5px solid rgba(31,59,87,0.15)',
                  background: color.bg,
                  color: color.navy,
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: font.sans,
                }}
              >
                {t(c)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Field
              value={st.inboxDraft}
              onChange={(v) => set({ inboxDraft: v })}
              placeholder={t('اكتب ردك…')}
              style={{ borderRadius: 999, padding: '11px 16px', fontSize: 12.5 }}
            />
            <Btn onClick={() => push(st.inboxDraft)} style={{ padding: '0 22px' }}>
              {t('إرسال')}
            </Btn>
          </div>
        </div>
      </div>
    </Grid>
  );
}

/* =========================== A11 — lost & found moderation =========================== */

export function LostModeration() {
  const { st, set, showToast } = useAdmin();

  const setState = (i: number, state: string, msg: string) => {
    set((s) => ({ lostMod: s.lostMod.map((l, j) => (j === i ? { ...l, state } : l)) }));
    showToast(msg);
  };

  return (
    <Grid cols="repeat(3,1fr)">
      {st.lostMod
        .filter((l) => l.state !== 'removed')
        .map((l, i) => (
          <Card key={t(l.title)} pad={18}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Pill
                bg={l.kind === 'found' ? 'rgba(63,166,107,0.13)' : 'rgba(228,103,90,0.13)'}
                c={l.kind === 'found' ? color.greenDeep : color.coralDeep}
              >
                {l.kind === 'found' ? t('عُثر عليه') : t('مفقود')}
              </Pill>
              <Spacer />
              <span style={{ fontSize: 10.5, color: color.slateLight }}>{t(l.date)}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: color.navy, marginTop: 10 }}>
              {t(l.title)}
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 3 }}>
              {t(l.loc)} {t('· أبلغ عنه')} {t(l.by)}
            </div>
            {l.state === 'pending' ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <Btn
                  tone="green"
                  onClick={() => setState(i, 'approved', `نُشر «${t(l.title)}» لكل السكان`)}
                  style={{ flex: 1, padding: 8, fontSize: 11.5 }}
                >
                  {t('اعتماد ونشر')}
                </Btn>
                <Btn
                  tone="ghost"
                  onClick={() => setState(i, 'removed', `أُزيل «${t(l.title)}» مع إخطار المُبلِّغ`)}
                  style={{
                    flex: 1,
                    padding: 8,
                    fontSize: 11.5,
                    color: color.coral,
                    border: `1.5px solid ${color.coral}`,
                  }}
                >
                  {t('إزالة')}
                </Btn>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 14,
                  background: 'rgba(63,166,107,0.1)',
                  borderRadius: 999,
                  padding: 8,
                  textAlign: 'center',
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: color.greenDeep,
                }}
              >
                {t('منشور للسكان ✓')}
              </div>
            )}
          </Card>
        ))}
    </Grid>
  );
}

/* ============================== A13 — gate log ============================== */

export function GateLog() {
  return (
    <TableCard>
      <TableHead>
        <span style={{ flex: 1 }}>{t('الزائر')}</span>
        <span style={{ width: 110 }}>{t('الوحدة المضيفة')}</span>
        <span style={{ width: 110 }}>{t('الدخول')}</span>
        <span style={{ width: 110 }}>{t('الخروج')}</span>
        <span style={{ width: 110 }}>{t('الحالة')}</span>
      </TableHead>
      {gateLog.map((g) => (
        <TableRow key={t(g.name)}>
          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
            {t(g.name)}
          </span>
          <span style={{ width: 110, fontSize: 12, color: color.slateDark }}>{t(g.unit)}</span>
          <span style={{ width: 110, fontSize: 11.5, color: color.slate }}>{t(g.in)}</span>
          <span style={{ width: 110, fontSize: 11.5, color: color.slate }}>{t(g.out)}</span>
          <span style={{ width: 110 }}>
            <Pill
              bg={g.inside ? 'rgba(63,166,107,0.13)' : 'rgba(107,114,128,0.12)'}
              c={g.inside ? color.greenDeep : color.slate}
            >
              {t(g.status)}
            </Pill>
          </span>
        </TableRow>
      ))}
    </TableCard>
  );
}

/* ============================== A8 — amenities ============================== */

export function Amenities() {
  const { st, set } = useAdmin();

  return (
    <Grid cols="1fr 1fr">
      {amenDefs.map((a) => {
        const cap = st.caps[a.key];
        const total = cap * 4;
        const pct = Math.min(100, Math.round((a.booked / total) * 100));
        const bump = (d: number) =>
          set((s) => ({ caps: { ...s.caps, [a.key]: Math.max(1, s.caps[a.key] + d) } }));
        return (
          <Card key={a.key} pad={20}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>{t(a.name)}</span>
              <Spacer />
              <span style={{ fontSize: 11, color: color.slate }}>{t('ساعات العمل:')} {a.hours}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <span style={{ fontSize: 12, color: color.slate }}>{t('السعة لكل ساعة')}</span>
              <Stepper label="−" onClick={() => bump(-1)} />
              <span
                style={{
                  ...numeric,
                  fontSize: 17,
                  fontWeight: 700,
                  color: color.navy,
                  width: 28,
                  textAlign: 'center',
                }}
              >
                {cap}
              </span>
              <Stepper label="+" onClick={() => bump(1)} />
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex' }}>
                <span style={{ fontSize: 11, color: color.slate }}>{t('حجوزات اليوم')}</span>
                <Spacer />
                <span style={{ ...numeric, fontSize: 11, fontWeight: 600, color: color.navy }}>
                  {a.booked} / {total}
                </span>
              </div>
              <div style={{ display: 'flex', marginTop: 6 }}>
                <Bar w={`${pct}%`} h={8} />
              </div>
            </div>
          </Card>
        );
      })}
    </Grid>
  );
}

function Stepper({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        border: '1.5px solid rgba(31,59,87,0.2)',
        background: '#fff',
        cursor: 'pointer',
        fontSize: 15,
        fontWeight: 800,
        color: color.navy,
      }}
    >
      {t(label)}
    </button>
  );
}

/** Re-exported so the collection table can build the same avatar initials. */
export { initialOf };
