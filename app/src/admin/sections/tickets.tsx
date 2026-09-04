import { color, font, numeric } from '@/theme/tokens';
import { techs, ticketFilterDefs, ticketMeta } from '../data';
import { useAdmin } from '../store';
import {
  Avatar,
  BackLink,
  Btn,
  Card,
  CardTitle,
  CheckBox,
  ChipToggle,
  Field,
  Grid,
  NavyCard,
  Pill,
  Spacer,
  TableCard,
  TableHead,
  TableRow,
} from '../ui';
import { t } from '@/i18n/lang';

const prMeta = {
  urgent: { label: 'عاجلة', c: color.coral },
  normal: { label: 'عادية', c: color.goldDeep },
} as const;

/* =========================== A3 — the ticket queue =========================== */

export function TicketsQueue() {
  const { st, set, showToast, patchTicket } = useAdmin();

  const rows = st.tickets.filter((t) => st.filter === 'all' || t.status === st.filter);
  const selected = rows.filter((t) => st.bulkTixSel[t.id]);
  const allOn = rows.length > 0 && selected.length === rows.length;

  const clear = () => set({ bulkTixSel: {} });
  const bulk = (msg: string, patch?: (id: number) => void) => {
    selected.forEach((t) => patch?.(t.id));
    showToast(msg);
    clear();
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {ticketFilterDefs.map((f) => (
          <ChipToggle
            key={f.key}
            label={t(f.label)}
            on={st.filter === f.key}
            onClick={() => set({ filter: f.key })}
          />
        ))}
      </div>

      {selected.length > 0 && (
        <NavyCard
          pad="14px 20px"
          style={{
            borderRadius: 16,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Pill bg={color.gold} c="#fff" style={{ fontSize: 11.5, padding: '4px 13px' }}>
            {selected.length} تذكرة محدّدة
          </Pill>
          <Spacer />
          <Btn
            tone="gold"
            onClick={() =>
              bulk(`أُسندت ${selected.length} تذكرة إلى ${t(techs[1].name)}`, (id) =>
                patchTicket(id, { tech: 1, status: 'inprogress' }),
              )
            }
            style={{ fontSize: 11.5, padding: '9px 18px' }}
          >
            {t('أسندها لفني واحد')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={() =>
              bulk('رُفعت الأولوية إلى «عاجلة»', (id) => patchTicket(id, { pr: 'urgent' }))
            }
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 11.5,
              padding: '9px 18px',
            }}
          >
            {t('ارفع الأولوية')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={() =>
              bulk(`أُغلقت ${selected.length} تذكرة كمحلولة`, (id) =>
                patchTicket(id, { status: 'resolved' }),
              )
            }
            style={{
              background: 'rgba(63,166,107,0.3)',
              color: '#CFF3DF',
              fontSize: 11.5,
              padding: '9px 18px',
            }}
          >
            {t('أغلقها كمحلولة')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={clear}
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5 }}
          >
            {t('إلغاء')}
          </Btn>
        </NavyCard>
      )}

      <TableCard>
        <TableHead>
          <CheckBox
            on={allOn}
            onClick={() =>
              set({
                bulkTixSel: allOn
                  ? {}
                  : Object.fromEntries(rows.map((t) => [t.id, true])),
              })
            }
          />
          <span style={{ width: 52 }}>{t('الرقم')}</span>
          <span style={{ flex: 1.6 }}>{t('البلاغ')}</span>
          <span style={{ width: 80 }}>{t('الفئة')}</span>
          <span style={{ width: 90 }}>{t('الوحدة')}</span>
          <span style={{ width: 70 }}>{t('الأولوية')}</span>
          <span style={{ width: 100 }}>{t('الفني')}</span>
          <span style={{ width: 100 }}>{t('الحالة')}</span>
        </TableHead>
        {rows.map((tk) => {
          const m = ticketMeta[tk.status];
          const pr = prMeta[tk.pr];
          return (
            <TableRow key={tk.id}>
              <CheckBox
                on={!!st.bulkTixSel[tk.id]}
                onClick={() =>
                  set((s) => ({ bulkTixSel: { ...s.bulkTixSel, [tk.id]: !s.bulkTixSel[tk.id] } }))
                }
              />
              <span
                style={{ width: 52, ...numeric, fontSize: 11.5, fontWeight: 600, color: color.slate }}
              >
                #{tk.id}
              </span>
              <button
                onClick={() => set({ sec: 'ticketDetail', selId: tk.id })}
                style={{
                  flex: 1.6,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: color.navy,
                  lineHeight: 1.5,
                  fontFamily: font.sans,
                  padding: 0,
                }}
              >
                {t(tk.title)}
              </button>
              <span style={{ width: 80, fontSize: 11.5, color: color.slate }}>{t(tk.cat)}</span>
              <span style={{ width: 90, fontSize: 11.5, color: color.slate }}>{t(tk.unit)}</span>
              <span style={{ width: 70 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 800,
                    color: pr.c,
                  }}
                >
                  <span
                    style={{ width: 8, height: 8, borderRadius: 99, background: pr.c }}
                  />
                  {t(pr.label)}
                </span>
              </span>
              <span style={{ width: 100, fontSize: 11.5, color: color.slateDark }}>
                {tk.tech === null ? t('غير مُسند') : t(techs[tk.tech].name)}
              </span>
              <span style={{ width: 100 }}>
                <Pill bg={m.bg} c={m.c}>
                  {t(m.label)}
                </Pill>
              </span>
            </TableRow>
          );
        })}
        {rows.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', fontSize: 12.5, color: color.slateLight }}>
            {t('لا تذاكر في هذه الحالة.')}
          </div>
        )}
      </TableCard>
    </>
  );
}

/* =========================== A4 — the ticket detail =========================== */

export function TicketDetail() {
  const { st, set, go, showToast, ticket, patchTicket, setStatus } = useAdmin();
  const m = ticketMeta[ticket.status];
  const pr = prMeta[ticket.pr];

  const statusButtons = [
    { key: 'received', label: 'تم الاستلام' },
    { key: 'inprogress', label: 'جاري التنفيذ' },
    { key: 'resolved', label: 'تم الحل' },
  ] as const;

  return (
    <>
      <BackLink label={t('العودة لطابور التذاكر')} onClick={() => go('tickets')} />
      <Grid cols="1.6fr 1fr">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card pad={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ ...numeric, fontSize: 12, fontWeight: 600, color: color.slate }}>
                #{ticket.id}
              </span>
              <Pill bg={m.bg} c={m.c} style={{ fontSize: 11, padding: '3px 13px' }}>
                {t(m.label)}
              </Pill>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: pr.c,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 99, background: pr.c }} />
                {t(pr.label)}
              </span>
              <Spacer />
              <span style={{ fontSize: 11.5, color: color.slateLight }}>{t(ticket.date)}</span>
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: color.navy,
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              {t(ticket.title)}
            </div>
            <div style={{ fontSize: 12.5, color: color.slate, marginTop: 4 }}>
              {t(ticket.cat)} · {t(ticket.unit)} · {ticket.resident}
            </div>
            <div
              style={{
                background: color.bg,
                borderRadius: 14,
                padding: '13px 16px',
                marginTop: 14,
                fontSize: 12.5,
                color: color.slateDark,
                lineHeight: 1.9,
              }}
            >
              {t(ticket.desc)}
            </div>
          </Card>

          <Card pad={20}>
            <CardTitle>{t('ملاحظات داخلية')}</CardTitle>
            {ticket.notes.map((n, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(199,154,60,0.08)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginTop: 8,
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 800, color: color.goldDeep }}>
                  {t(n.by)} · {t(n.time)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: color.slateDark,
                    marginTop: 2,
                    lineHeight: 1.8,
                  }}
                >
                  {t(n.text)}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Field
                value={st.noteDraft}
                onChange={(v) => set({ noteDraft: v })}
                placeholder={t('أضف ملاحظة للفريق…')}
                style={{ borderRadius: 12, padding: '11px 14px', fontSize: 12.5 }}
              />
              <Btn
                onClick={() => {
                  const text = st.noteDraft.trim();
                  if (!text) return;
                  patchTicket(ticket.id, {
                    notes: [...ticket.notes, { by: 'أنت (الإدارة)', time: 'الآن', text }],
                  });
                  set({ noteDraft: '' });
                  showToast(t('أُضيفت الملاحظة للسجل الداخلي'));
                }}
                style={{ borderRadius: 12, padding: '0 20px' }}
              >
                {t('إضافة')}
              </Btn>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card pad={20}>
            <CardTitle>{t('تعيين فني')}</CardTitle>
            {techs.map((tp, i) => {
              const on = ticket.tech === i;
              return (
                <button
                  key={t(tp.name)}
                  onClick={() => {
                    patchTicket(ticket.id, { tech: i });
                    showToast(`${t('أُسندت التذكرة #')}${ticket.id} ${t('إلى')} ${t(tp.name)}`);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    background: on ? 'rgba(199,154,60,0.1)' : '#fff',
                    border: `1.5px solid ${on ? color.gold : 'rgba(31,59,87,0.12)'}`,
                    borderRadius: 14,
                    padding: '11px 13px',
                    cursor: 'pointer',
                    marginTop: 8,
                    textAlign: 'start',
                  }}
                >
                  <Avatar name={t(tp.name)} size={34} />
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                      {t(tp.name)}
                    </span>
                    <span style={{ fontSize: 10.5, color: color.slate }}>
                      {t(tp.spec)} · {tp.load} تذاكر نشطة
                    </span>
                  </span>
                  <span
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: 99,
                      border: `2px solid ${on ? color.gold : t(color.line)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        background: on ? color.gold : 'transparent',
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </Card>

          <Card pad={20}>
            <CardTitle>{t('تحديث الحالة')}</CardTitle>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}
            >
              {statusButtons.map((b) => {
                const on = ticket.status === b.key;
                const tone = ticketMeta[b.key];
                return (
                  <button
                    key={b.key}
                    onClick={() => {
                      setStatus(ticket.id, b.key);
                      showToast(`${t('تحدّثت الحالة إلى «')}${t(tone.label)}${t('» — أُخطر الساكن')}`);
                    }}
                    style={{
                      borderRadius: 12,
                      padding: 10,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: font.sans,
                      background: on ? tone.bg : '#fff',
                      color: on ? tone.c : color.slate,
                      border: `1.5px solid ${on ? tone.c : 'rgba(31,59,87,0.12)'}`,
                    }}
                  >
                    {t(b.label)}
                  </button>
                );
              })}
            </div>
            <div
              style={{ fontSize: 10.5, color: color.slateLight, marginTop: 10, lineHeight: 1.7 }}
            >
              {t('يصل إشعار فوري للساكن مع كل تغيير في الحالة.')}
            </div>
          </Card>
        </div>
      </Grid>
    </>
  );
}
