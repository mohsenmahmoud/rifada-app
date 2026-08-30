import { color, numeric } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  activityDefs,
  cmdIcons,
  inboxDefs,
  kpiDefs,
  navIcons,
  opsAlertDefs,
  payColors,
  payHeights,
  providerDirDefs,
  quickActionDefs,
  resDefs,
  storesTableDefs,
  ticketMeta,
  u360,
  u360Assets,
  u360Stats,
  u360Timeline,
  u360Usage,
} from '../data';
import { useAdmin } from '../store';
import {
  Avatar,
  Bar,
  BackLink,
  Btn,
  Card,
  CardTitle,
  Grid,
  IconChip,
  NavyCard,
  Pill,
  Spacer,
} from '../ui';

/* ============================ A2 — command centre ============================ */

const SEARCH_PATHS = ['M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z', 'M20 20l-3.5-3.5'];

export function Home() {
  const { st, set, go, showToast, openCount } = useAdmin();

  return (
    <>
      <CommandBar />
      <Grid cols="repeat(4,1fr)">
        {kpiDefs.map((k) => (
          <button
            key={k.label}
            onClick={() => go(k.to)}
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'right',
              background: color.card,
              borderRadius: 18,
              padding: 18,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'block',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconChip path={k.icon} bg={k.iconBg} c={k.iconC} icon={16} radius={10} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: color.slate }}>{k.label}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span style={{ ...numeric, fontSize: 28, fontWeight: 700, color: color.navy }}>
                {k.value ?? String(openCount)}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: color.green }}>{k.trend}</span>
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
                height: 30,
                marginTop: 10,
              }}
            >
              {k.spark.map((h, i) => (
                <span
                  key={i}
                  style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: k.sparkC }}
                />
              ))}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: color.slateLight }}>{k.target}</span>
              <Spacer />
              <span style={{ fontSize: 10.5, color: color.goldDeep, fontWeight: 800 }}>
                {k.cta} ←
              </span>
            </span>
          </button>
        ))}
      </Grid>

      <Grid cols="1.5fr 1fr" style={{ marginTop: 14 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>تحتاج قرارك الآن</span>
            <Pill bg={color.coral} c="#fff" style={{ marginRight: 9 }}>
              {inboxDefs.filter((d) => !st.inboxDone[d.key]).length}
            </Pill>
            <Spacer />
            <span style={{ fontSize: 10.5, color: color.slateLight }}>
              قرار واحد بضغطة — بلا فتح شاشات
            </span>
          </div>
          {inboxDefs.map((d) => {
            const done = st.inboxDone[d.key];
            return (
              <div
                key={d.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <IconChip path={d.icon} bg={d.iconBg} c={d.iconC} size={34} icon={16} />
                <span
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                    {d.title}
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate }}>{d.meta}</span>
                </span>
                {done ? (
                  <Pill
                    bg="rgba(63,166,107,0.13)"
                    c={color.greenDeep}
                    style={{ fontSize: 10.5, padding: '5px 14px', flex: 'none' }}
                  >
                    {done === 'ok' ? d.approveLabel : d.rejectLabel} ✓
                  </Pill>
                ) : (
                  <span style={{ display: 'flex', gap: 7, flex: 'none' }}>
                    <Btn
                      tone="ghost"
                      size="sm"
                      onClick={() => {
                        set((s) => ({ inboxDone: { ...s.inboxDone, [d.key]: 'no' } }));
                        showToast(d.noMsg);
                      }}
                      style={{
                        color: color.coral,
                        border: '1.5px solid rgba(228,103,90,0.4)',
                        padding: '6px 14px',
                        fontSize: 11,
                      }}
                    >
                      {d.rejectLabel}
                    </Btn>
                    <Btn
                      size="sm"
                      onClick={() => {
                        set((s) => ({ inboxDone: { ...s.inboxDone, [d.key]: 'ok' } }));
                        showToast(d.okMsg);
                      }}
                      style={{ padding: '6px 16px', fontSize: 11 }}
                    >
                      {d.approveLabel}
                    </Btn>
                  </span>
                )}
              </div>
            );
          })}
          {inboxDefs.every((d) => st.inboxDone[d.key]) && (
            <div
              style={{
                padding: 26,
                textAlign: 'center',
                fontSize: 12.5,
                color: color.greenDeep,
                fontWeight: 800,
              }}
            >
              لا قرارات معلّقة — كل شيء مغلق ✓
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <NavyCard>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>تنبيهات تشغيلية</span>
              <Spacer />
              <Pill bg="rgba(228,103,90,0.25)" c="#FFB4AB">
                {opsAlertDefs.length}
              </Pill>
            </div>
            {opsAlertDefs.map((al) => (
              <button
                key={al.text}
                onClick={() => go(al.to)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none',
                  borderRadius: 13,
                  padding: '11px 13px',
                  cursor: 'pointer',
                  textAlign: 'right',
                  marginTop: 9,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: al.dot,
                    flex: 'none',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.6,
                  }}
                >
                  {al.text}
                </span>
                <Icon path="M15 5l-7 7 7 7" size={13} stroke="rgba(255,255,255,0.5)" width={2} />
              </button>
            ))}
          </NavyCard>

          <Card>
            <CardTitle>النشاط الأخير</CardTitle>
            {activityDefs.map((a) => (
              <div
                key={a.text}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '9px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: color.gold,
                    marginTop: 6,
                    flex: 'none',
                  }}
                />
                <span style={{ flex: 1, fontSize: 11.5, color: color.slateDark, lineHeight: 1.7 }}>
                  {a.text}
                </span>
                <span style={{ fontSize: 10, color: color.slateLight, whiteSpace: 'nowrap' }}>
                  {a.time}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </Grid>
    </>
  );
}

/** Search + quick actions, and the live result list underneath. */
function CommandBar() {
  const { st, set, go, showToast } = useAdmin();

  const index = [
    ...resDefs.map((r) => ({
      kind: 'ساكن',
      icon: cmdIcons.unit,
      title: r.name,
      meta: `${r.unit} · ${r.pay}`,
      act: () => set({ sec: 'residents', resQuery: r.unit, cmdQuery: '' }),
    })),
    ...st.tickets.slice(0, 8).map((t) => ({
      kind: 'تذكرة',
      icon: cmdIcons.ticket,
      title: `#${t.id} — ${t.title}`,
      meta: t.unit,
      act: () => set({ sec: 'ticketDetail', selId: t.id, cmdQuery: '' }),
    })),
    ...providerDirDefs.map((p) => ({
      kind: 'مقدم خدمة',
      icon: cmdIcons.vendor,
      title: p.name,
      meta: `${p.cat} · ★ ${p.rating}`,
      act: () => set({ sec: 'vendors', vendorTab: 'providers', cmdQuery: '' }),
    })),
    ...storesTableDefs.map((x) => ({
      kind: 'متجر',
      icon: cmdIcons.store,
      title: x.name,
      meta: `${x.kind} · ${x.orders} طلب`,
      act: () => set({ sec: 'storesDir', cmdQuery: '' }),
    })),
  ];

  const q = st.cmdQuery.trim();
  const results = q
    ? index.filter((x) => `${x.title} ${x.meta}`.includes(q)).slice(0, 6)
    : [];

  return (
    <>
      <Card pad="14px 18px" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: color.bg,
            borderRadius: 999,
            padding: '10px 16px',
            minWidth: 0,
          }}
        >
          <Icon path={SEARCH_PATHS} size={15} stroke={color.slate} width={1.6} />
          <input
            value={st.cmdQuery}
            onChange={(e) => set({ cmdQuery: e.target.value })}
            placeholder="ابحث عن وحدة، ساكن، تذكرة، أو مورد…"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 12.5,
              color: color.navy,
              outline: 'none',
              minWidth: 0,
            }}
          />
          <span style={{ fontSize: 10, color: color.slateLight, whiteSpace: 'nowrap' }}>
            اكتب للبحث الفوري
          </span>
        </div>
        {quickActionDefs.map((qa) => (
          <button
            key={qa.label}
            onClick={() => (qa.to ? go(qa.to) : showToast(qa.toast ?? ''))}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: qa.bg,
              color: qa.c,
              borderRadius: 999,
              padding: '10px 16px',
              fontSize: 11.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            <Icon path={qa.icon} size={14} stroke={qa.c} />
            {qa.label}
          </button>
        ))}
      </Card>

      {q && (
        <div
          style={{
            background: color.card,
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              padding: '11px 18px',
              background: color.tile,
              fontSize: 11,
              fontWeight: 800,
              color: color.slate,
            }}
          >
            {results.length} نتيجة
          </div>
          {results.map((r, i) => (
            <button
              key={i}
              onClick={r.act}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'right',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <IconChip path={r.icon} size={30} icon={15} radius={9} />
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                {r.title}
              </span>
              <span style={{ fontSize: 11, color: color.slate }}>{r.meta}</span>
              <Pill bg="rgba(31,59,87,0.07)" c={color.navy}>
                {r.kind}
              </Pill>
            </button>
          ))}
          {results.length === 0 && (
            <div style={{ padding: 26, textAlign: 'center', fontSize: 12, color: color.slateLight }}>
              لا نتائج مطابقة
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ============================== A36 — unit 360 ============================== */

export function Unit360() {
  const { st, set, go, showToast } = useAdmin();
  const owner = resDefs.find((r) => r.unit === st.u360Unit) ?? resDefs[0];
  const tickets = st.tickets.slice(0, 4);

  const actions = [
    {
      label: 'أرسل تذكير سداد',
      bg: color.gold,
      c: '#fff',
      act: () => showToast(`أُرسل تذكير سداد لـ${owner.name} — إشعار + رسالة`),
    },
    { label: 'افتح محادثة', bg: 'rgba(255,255,255,0.12)', c: '#fff', act: () => go('inbox') },
    { label: 'أنشئ تذكرة', bg: 'rgba(255,255,255,0.12)', c: '#fff', act: () => go('tickets') },
  ];

  return (
    <>
      <BackLink label="العودة لدليل السكان" onClick={() => go('residents')} />
      <NavyCard
        pad="22px 26px"
        style={{ borderRadius: 20, display: 'flex', alignItems: 'center', gap: 18 }}
      >
        <IconChip
          path={cmdIcons.unit}
          bg="rgba(199,154,60,0.22)"
          c={color.gold}
          size={56}
          icon={26}
          radius={16}
        />
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
            {owner.unit} — {owner.name}
          </span>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
            {owner.model} · {owner.pay} · نقاط الثقة {u360.score} ({u360.tier})
          </span>
        </span>
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.act}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: a.bg,
              color: a.c,
              borderRadius: 999,
              padding: '9px 16px',
              fontSize: 11.5,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            {a.label}
          </button>
        ))}
      </NavyCard>

      <Grid cols="repeat(4,1fr)" gap={12} style={{ marginTop: 14 }}>
        {u360Stats.map((s) => (
          <Card key={s.label} pad={16} style={{ borderRadius: 16 }}>
            <div style={{ fontSize: 11, color: color.slate }}>{s.label}</div>
            <div style={{ ...numeric, fontSize: 24, fontWeight: 700, color: s.c, marginTop: 5 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10.5, color: color.slateLight, marginTop: 3 }}>{s.sub}</div>
          </Card>
        ))}
      </Grid>

      <Grid cols="1.35fr 1fr" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <CardTitle>سجل السداد — 6 أشهر</CardTitle>
            {/* The columns stretch to the row's 96px so each bar's percentage
                height has a definite parent to resolve against. */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 10,
                height: 96,
                marginTop: 16,
              }}
            >
              {u360.pay.map(([m, k]) => (
                <span
                  key={m}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: '100%',
                      height: payHeights[k],
                      borderRadius: '8px 8px 3px 3px',
                      background: payColors[k],
                    }}
                  />
                  <span style={{ fontSize: 9.5, color: color.slateLight }}>{m}</span>
                </span>
              ))}
            </div>
            <div
              style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 10.5, color: color.slate }}
            >
              {(
                [
                  ['سُدّد في الموعد', color.green],
                  ['سُدّد متأخرًا', color.gold],
                  ['غير مسدّد', color.coral],
                ] as const
              ).map(([l, c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />
                  {l}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CardTitle>تذاكر الوحدة</CardTitle>
              <Spacer />
              <span style={{ fontSize: 10.5, color: color.slate }}>
                {tickets.length + 6} تذكرة إجمالًا
              </span>
            </div>
            {tickets.map((t) => {
              const m = ticketMeta[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => set({ sec: 'ticketDetail', selId: t.id })}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'right',
                    padding: '11px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <span style={{ ...numeric, fontSize: 11, color: color.slateLight, flex: 'none' }}>
                    #{t.id}
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                    {t.title}
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                    {t.date}
                  </span>
                  <Pill bg={m.bg} c={m.c} style={{ flex: 'none' }}>
                    {m.label}
                  </Pill>
                </button>
              );
            })}
          </Card>

          <Card>
            <CardTitle>آخر النشاط على الوحدة</CardTitle>
            {u360Timeline.map((tl) => (
              <div
                key={tl.text}
                style={{
                  display: 'flex',
                  gap: 11,
                  padding: '9px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: tl.dot,
                    marginTop: 6,
                    flex: 'none',
                  }}
                />
                <span style={{ flex: 1, fontSize: 11.5, color: color.slateDark, lineHeight: 1.7 }}>
                  {tl.text}
                </span>
                <span style={{ fontSize: 10, color: color.slateLight, whiteSpace: 'nowrap' }}>
                  {tl.time}
                </span>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <CardTitle>أفراد العائلة والصلاحيات</CardTitle>
            {(owner.fam ?? []).map((f) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <Avatar name={f.name} bg={f.avBg} />
                <span
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: color.navy }}>{f.name}</span>
                  <span style={{ fontSize: 10, color: color.slate }}>{f.rel}</span>
                </span>
                <Pill bg="rgba(31,59,87,0.07)" c={color.navy} style={{ fontSize: 9.5, flex: 'none' }}>
                  {f.perms}
                </Pill>
              </div>
            ))}
            {!owner.fam && (
              <div style={{ fontSize: 11.5, color: color.slateLight, padding: '14px 0' }}>
                لا أفراد عائلة مسجّلين على هذه الوحدة.
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>المركبات والتصاريح</CardTitle>
            {u360Assets.map((a) => (
              <div
                key={a.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <IconChip path={a.icon} size={30} icon={15} radius={9} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: color.navy }}>
                  {a.label}
                </span>
                <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                  {a.meta}
                </span>
              </div>
            ))}
          </Card>

          <Card>
            <CardTitle>استخدام الخدمات — 30 يومًا</CardTitle>
            {u360Usage.map((u) => (
              <div
                key={u.label}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}
              >
                <span style={{ fontSize: 11.5, color: color.slateDark, width: 96 }}>{u.label}</span>
                <Bar w={u.w} h={9} />
                <span
                  style={{
                    ...numeric,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: color.navy,
                    width: 38,
                    textAlign: 'left',
                  }}
                >
                  {u.n}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </Grid>
    </>
  );
}

/** Shared by the residents table and the collection table. */
export const UNIT_ICON = navIcons.residents;
