import { color, font, numeric } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  AUTOMATED_ACTIONS,
  COMPOUNDS,
  HOURS_SAVED,
  IOT_CONNECTED,
  IOT_TOTAL,
  SLA_MAX_HOURS,
  assetDefs,
  auditRows,
  iotZones,
  overdueDefs,
  permLabels,
  portfolioBars,
  portfolioDefs,
  reportDefs,
  reportPeriods,
  roleDefs,
  roleMatrix,
  ruleDefs,
  scoreDist,
  sentimentDefs,
  slaDefs,
  staffDefs,
} from '../data';
import { useAdmin } from '../store';
import {
  Avatar,
  Bar,
  Btn,
  CHECK,
  Card,
  CardTitle,
  CheckBox,
  ChipToggle,
  Grid,
  IconChip,
  NavyCard,
  Pill,
  Spacer,
  Stat,
  Switch,
  TableCard,
  TableHead,
  TableRow,
} from '../ui';
import { t } from '@/i18n/lang';

/* ============================== A9 — collection ============================== */

export function Collection() {
  const { st, set, showToast } = useAdmin();
  const selected = overdueDefs.filter((_, i) => st.bulkSel[i]);
  const allOn = selected.length === overdueDefs.length;
  const total = selected.reduce((a, o) => a + Number(o.amount.replace(/,/g, '')), 0);

  const bulk = (msg: string) => {
    showToast(msg);
    set({ bulkSel: {} });
  };

  return (
    <>
      <Grid cols="1fr 1fr 1fr">
        <NavyCard>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('معدل التحصيل — يوليو')}</div>
          <div style={{ ...numeric, fontSize: 38, fontWeight: 700, color: '#fff', marginTop: 6 }}>
            87%
          </div>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <Bar w="87%" h={9} track="rgba(255,255,255,0.15)" />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            {t('↑ 4% عن يونيو · المستهدف 92%')}
          </div>
        </NavyCard>
        <Stat
          label={t('إجمالي المحصّل')}
          value="2.86M"
          unit={t('ر.س')}
          sub={t('618 وحدة سدّدت من 712')}
          subC={color.greenDeep}
        />
        <Stat
          label={t('حسابات متأخرة')}
          value="14"
          valueC={color.coral}
          sub={t('متوسط التأخير: 9 أيام')}
        />
      </Grid>

      {selected.length > 0 && (
        <NavyCard
          pad="14px 20px"
          style={{
            borderRadius: 16,
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Pill bg={color.gold} c="#fff" style={{ fontSize: 11.5, padding: '4px 13px' }}>
            {selected.length} محدّد
          </Pill>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
            إجمالي {total.toLocaleString('en-US')} ر.س مستحقة
          </span>
          <Spacer />
          <Btn
            tone="gold"
            onClick={() => bulk(`أُرسل تذكير سداد إلى ${selected.length} ساكن`)}
            style={{ fontSize: 11.5, padding: '9px 18px' }}
          >
            {t('أرسل تذكيرًا للكل')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={() => bulk('عُرضت خطة تقسيط على المحدّدين — بانتظار موافقتهم')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 11.5,
              padding: '9px 18px',
            }}
          >
            {t('اعرض خطة تقسيط')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={() => bulk('صُعّدت الحسابات للإدارة القانونية')}
            style={{
              background: 'rgba(228,103,90,0.25)',
              color: '#FFD3CE',
              fontSize: 11.5,
              padding: '9px 18px',
            }}
          >
            {t('صعّد قانونيًا')}
          </Btn>
          <Btn
            tone="ghost"
            onClick={() => set({ bulkSel: {} })}
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5 }}
          >
            {t('إلغاء')}
          </Btn>
        </NavyCard>
      )}

      <div style={{ marginTop: 14 }}>
        <TableCard>
          <TableHead>
            <CheckBox
              on={allOn}
              onClick={() =>
                set({
                  bulkSel: allOn
                    ? {}
                    : Object.fromEntries(overdueDefs.map((_, i) => [i, true])),
                })
              }
            />
            <span style={{ width: 96 }}>{t('الوحدة')}</span>
            <span style={{ flex: 1 }}>{t('الساكن')}</span>
            <span style={{ width: 110 }}>{t('المبلغ')}</span>
            <span style={{ width: 100 }}>{t('أيام التأخير')}</span>
            <span style={{ width: 120 }}>{t('الإجراء')}</span>
          </TableHead>
          {overdueDefs.map((o, i) => (
            <TableRow key={t(o.unit)}>
              <CheckBox
                on={!!st.bulkSel[i]}
                onClick={() => set((s) => ({ bulkSel: { ...s.bulkSel, [i]: !s.bulkSel[i] } }))}
              />
              <button
                onClick={() => set({ sec: 'unit360', u360Unit: t(o.unit) })}
                style={{
                  width: 96,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'right',
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
                {t(o.unit)}
              </button>
              <span style={{ flex: 1, fontSize: 12.5, color: color.slateDark }}>{t(o.name)}</span>
              <span
                style={{ width: 110, ...numeric, fontSize: 12.5, fontWeight: 600, color: color.navy }}
              >
                {t(o.amount)} ر.س
              </span>
              <span style={{ width: 100 }}>
                <Pill
                  bg={o.days > 10 ? 'rgba(228,103,90,0.13)' : 'rgba(199,154,60,0.16)'}
                  c={o.days > 10 ? color.coralDeep : color.goldDeep}
                  style={{ fontSize: 10.5 }}
                >
                  {o.days} {t('يوم')}
                </Pill>
              </span>
              <span style={{ width: 120 }}>
                <Btn
                  tone="outline"
                  size="sm"
                  onClick={() => showToast(`أُرسل تذكير سداد إلى ${t(o.name)}`)}
                  style={{ border: `1.5px solid ${color.navy}` }}
                >
                  {t('إرسال تذكير')}
                </Btn>
              </span>
            </TableRow>
          ))}
        </TableCard>
      </div>
    </>
  );
}

/* ================================= A10 — SLA ================================= */

export function Sla() {
  return (
    <Card pad={22}>
      <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
        {t('وقت الحل الفعلي مقابل مستهدف SLA — بالساعات')}
      </div>
      {slaDefs.map((s) => {
        const breach = s.actual > s.target;
        return (
          <div key={t(s.cat)} style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, width: 110 }}>
                {t(s.cat)}
              </span>
              <span style={{ fontSize: 11, color: color.slate }}>
                فعلي {s.actual} {t('س · مستهدف')} {s.target} س
              </span>
              <Spacer />
              <Pill
                bg={breach ? 'rgba(228,103,90,0.13)' : 'rgba(63,166,107,0.13)'}
                c={breach ? color.coral : color.greenDeep}
              >
                {breach ? t('تجاوز SLA') : t('ضمن الهدف')}
              </Pill>
            </div>
            <div
              style={{
                position: 'relative',
                height: 12,
                borderRadius: 999,
                background: color.tileAlt,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: `${Math.round((s.actual / SLA_MAX_HOURS) * 100)}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: breach ? color.coral : color.green,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: `${Math.round((s.target / SLA_MAX_HOURS) * 100)}%`,
                  width: 2.5,
                  height: 20,
                  background: color.navy,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
        <span style={{ width: 14, height: 2.5, background: color.navy, borderRadius: 2 }} />
        <span style={{ fontSize: 10.5, color: color.slate }}>الخط الداكن = مستهدف SLA</span>
      </div>
    </Card>
  );
}

/* ============================== A14 — sentiment ============================== */

export function Sentiment() {
  return (
    <Grid cols="1fr 2fr">
      <div
        style={{
          background: `linear-gradient(140deg,${color.navy} 0%,${color.purple} 100%)`,
          borderRadius: 18,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>{t('رضا السكان العام')}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <span style={{ ...numeric, fontSize: 52, fontWeight: 700, color: '#fff' }}>4.2</span>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>/ 5</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
          {t('من الاستبيان العام — يوليو 2026 · 214 ردًا')}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(63,166,107,0.2)',
            borderRadius: 999,
            padding: '5px 14px',
            marginTop: 14,
            alignSelf: 'flex-start',
          }}
        >
          <Icon path="M12 19V5M6 11l6-6 6 6" size={13} stroke={color.greenBright} width={2} />
          <span style={{ fontSize: 11.5, fontWeight: 800, color: color.greenBright }}>
            {t('0.3 عن الشهر الماضي')}
          </span>
        </div>
        <Spacer />
        <div
          style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginTop: 18 }}
        >
          {t('يُجمع تلقائيًا من استبيانات ما بعد البلاغات والاستبيان الشهري داخل التطبيق.')}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          alignContent: 'start',
        }}
      >
        {sentimentDefs.map((s) => (
          <Card key={t(s.cat)} pad="16px 18px" style={{ borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(s.cat)}</span>
              <Spacer />
              <Pill
                bg={s.pos ? 'rgba(63,166,107,0.13)' : 'rgba(228,103,90,0.13)'}
                c={s.pos ? color.greenDeep : color.coralDeep}
                style={{ fontSize: 10.5, padding: '3px 13px' }}
              >
                {s.pos ? t('إيجابي') : t('سلبي')}
              </Pill>
            </div>
            <div style={{ fontSize: 11, color: color.slate, marginTop: 6 }}>
              {s.count} {t('ردًا ·')} {t(s.note)}
            </div>
            <div style={{ display: 'flex', marginTop: 10 }}>
              <Bar w={`${s.pct}%`} h={7} c={s.pos ? color.green : color.coral} />
            </div>
          </Card>
        ))}
      </div>
    </Grid>
  );
}

/* =============================== A15 — scoring =============================== */

export function Scoring() {
  const { st, set } = useAdmin();

  const bump = (i: number, d: number) =>
    set((s) => ({
      scoreRules: s.scoreRules.map((r, j) => (j === i ? { ...r, val: r.val + d } : r)),
    }));

  return (
    <Grid cols="1.2fr 1fr">
      <Card pad={22}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          {t('قواعد احتساب نقاط الثقة')}
        </div>
        {st.scoreRules.map((sr, i) => (
          <div
            key={t(sr.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 0',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <span style={{ flex: 1, fontSize: 12.5, color: color.slateDark }}>{t(sr.label)}</span>
            <MiniStep label="−" onClick={() => bump(i, -5)} />
            <span
              style={{
                ...numeric,
                fontSize: 14,
                fontWeight: 700,
                color: sr.val < 0 ? color.coralDeep : color.greenDeep,
                width: 46,
                textAlign: 'center',
              }}
            >
              {sr.val > 0 ? `+${sr.val}` : sr.val}
            </span>
            <MiniStep label="+" onClick={() => bump(i, 5)} />
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: color.slateLight, marginTop: 12 }}>
          {t('تسري التغييرات على دورة الاحتساب القادمة (أول الشهر).')}
        </div>
      </Card>

      <Card pad={22}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          {t('توزيع السكان حسب المستوى')}
        </div>
        {scoreDist.map((sd) => (
          <div key={t(sd.label)} style={{ marginTop: 16 }}>
            <div style={{ display: 'flex' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: color.navy }}>{t(sd.label)}</span>
              <Spacer />
              <span style={{ ...numeric, fontSize: 11.5, fontWeight: 600, color: color.slate }}>
                {sd.count} ساكن
              </span>
            </div>
            <div style={{ display: 'flex', marginTop: 6 }}>
              <Bar w={sd.w} h={10} c={sd.c} />
            </div>
          </div>
        ))}
      </Card>
    </Grid>
  );
}

function MiniStep({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        borderRadius: 9,
        border: '1.5px solid rgba(31,59,87,0.2)',
        background: '#fff',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 800,
        color: color.navy,
      }}
    >
      {t(label)}
    </button>
  );
}

/* ============================= A37 — automation ============================= */

export function Automation() {
  const { st, set, showToast } = useAdmin();
  const onCount = ruleDefs.filter((_, i) => st.autoRules[i]).length;

  return (
    <>
      <Grid cols="repeat(3,1fr)" style={{ marginBottom: 14 }}>
        <NavyCard>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            {t('إجراءات نفّذتها القواعد — يوليو')}
          </div>
          <div style={{ ...numeric, fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 5 }}>
            {AUTOMATED_ACTIONS}
          </div>
          <div style={{ fontSize: 11, color: color.greenBright, marginTop: 5, fontWeight: 800 }}>
            {t('بلا تدخل بشري')}
          </div>
        </NavyCard>
        <Stat label={t('ساعات عمل مُوفَّرة')} value={HOURS_SAVED} unit={t('ساعة')} sub={t('≈ موظف بدوام جزئي')} size={30} />
        <Card pad={20}>
          <div style={{ fontSize: 12, color: color.slate }}>{t('قواعد مفعّلة')}</div>
          <div
            style={{ ...numeric, fontSize: 30, fontWeight: 700, color: color.greenDeep, marginTop: 5 }}
          >
            {onCount} <span style={{ fontSize: 12, color: color.slate }}>{t('من')} {ruleDefs.length}</span>
          </div>
          <div style={{ fontSize: 11, color: color.slate, marginTop: 5 }}>{t('تعمل على مدار الساعة')}</div>
        </Card>
      </Grid>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ruleDefs.map((r, i) => {
          const on = st.autoRules[i];
          return (
            <Card key={t(r.when)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Switch
                on={on}
                onClick={() => {
                  set((s) => ({ autoRules: { ...s.autoRules, [i]: !on } }));
                  showToast(on ? `أُوقفت القاعدة: ${t(r.then)}` : `فُعّلت القاعدة: ${t(r.then)}`);
                }}
              />
              <span
                style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}
                >
                  <span
                    style={{
                      background: 'rgba(31,59,87,0.07)',
                      color: color.navy,
                      borderRadius: 8,
                      padding: '3px 11px',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {t('إذا')} {t(r.when)}
                  </span>
                  <Icon path="M15 5l-7 7 7 7" size={15} stroke={color.gold} width={2.2} />
                  <span
                    style={{
                      background: 'rgba(199,154,60,0.14)',
                      color: color.goldDeep,
                      borderRadius: 8,
                      padding: '3px 11px',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {t(r.then)}
                  </span>
                </span>
                <span style={{ fontSize: 10.5, color: color.slate }}>{t(r.stat)}</span>
              </span>
              <Pill
                bg={on ? 'rgba(63,166,107,0.13)' : 'rgba(107,114,128,0.12)'}
                c={on ? color.greenDeep : color.slate}
                style={{ fontSize: 10.5, padding: '4px 14px', flex: 'none' }}
              >
                {on ? t('مفعّلة') : t('معطّلة')}
              </Pill>
            </Card>
          );
        })}
        <button
          onClick={() => showToast('محرّر القواعد «إذا … فـ …» — قيد البناء في هذا النموذج')}
          style={{
            border: `1.5px dashed ${color.gold}`,
            background: 'rgba(199,154,60,0.06)',
            borderRadius: 18,
            padding: 16,
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 800,
            color: color.goldDeep,
            fontFamily: font.sans,
          }}
        >
          {t('+ أضف قاعدة جديدة — «إذا … فـ …»')}
        </button>
      </div>
    </>
  );
}

/* =========================== A38 — team & audit log =========================== */

export function Team() {
  const { st, set, showToast } = useAdmin();
  const perms = roleMatrix[st.teamRole];

  return (
    <>
      <Grid cols="1.15fr 1fr">
        <TableCard>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              background: color.tile,
            }}
          >
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: color.navy }}>
              {t('فريق العمل')}
            </span>
            <Btn
              size="sm"
              onClick={() => showToast('أُرسلت دعوة انضمام بالبريد — تنتهي خلال 48 ساعة')}
              style={{ padding: '7px 16px', fontSize: 11 }}
            >
              {t('+ دعوة موظف')}
            </Btn>
          </div>
          {staffDefs.map((s) => (
            <div
              key={t(s.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 18px',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <Avatar name={t(s.name)} size={34} />
              <span
                style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(s.name)}</span>
                <span style={{ fontSize: 10.5, color: color.slate }}>
                  {t(s.role)} {t('· آخر دخول')} {t(s.last)}
                </span>
              </span>
              <Pill
                bg={s.ok ? 'rgba(63,166,107,0.13)' : 'rgba(107,114,128,0.12)'}
                c={s.ok ? color.greenDeep : color.slate}
                style={{ flex: 'none' }}
              >
                {s.ok ? t('نشط') : t('غير متصل')}
              </Pill>
            </div>
          ))}
        </TableCard>

        <Card>
          <CardTitle>{t('صلاحيات الأدوار')}</CardTitle>
          <div style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
            {roleDefs.map((r, i) => (
              <ChipToggle
                key={r}
                label={r}
                on={st.teamRole === i}
                onClick={() => set({ teamRole: i })}
              />
            ))}
          </div>
          {permLabels.map((p, i) => {
            const on = perms[i] === 1;
            return (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    background: on ? color.green : color.line,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <Icon path={on ? CHECK : 'M7 7l10 10M17 7L7 17'} size={11} stroke="#fff" width={3} />
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: on ? color.slateDark : color.slateLight,
                    fontWeight: 700,
                  }}
                >
                  {t(p)}
                </span>
              </div>
            );
          })}
        </Card>
      </Grid>

      <div style={{ marginTop: 14 }}>
        <TableCard>
          <div
            style={{ padding: '14px 18px', background: color.tile, display: 'flex', alignItems: 'center' }}
          >
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: color.navy }}>
              {t('سجل التدقيق — من فعل ماذا')}
            </span>
            <span style={{ fontSize: 10.5, color: color.slate }}>
              {t('كل إجراء مالي أو حسّاس مسجّل ولا يُحذف')}
            </span>
          </div>
          {auditRows.map((a, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <span style={{ width: 70, ...numeric, fontSize: 11, color: color.slateLight, flex: 'none' }}>
                {t(a.time)}
              </span>
              <span
                style={{ width: 120, fontSize: 12, fontWeight: 800, color: color.navy, flex: 'none' }}
              >
                {t(a.who)}
              </span>
              <span style={{ flex: 1, fontSize: 11.5, color: color.slateDark, lineHeight: 1.6 }}>
                {t(a.what)}
              </span>
              <Pill bg={a.tagBg} c={a.tagC} style={{ fontSize: 9.5, flex: 'none' }}>
                {t(a.tag)}
              </Pill>
            </div>
          ))}
        </TableCard>
      </div>
    </>
  );
}

/* =============================== A39 — reports =============================== */

export function Reports() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Card
        pad="16px 20px"
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, whiteSpace: 'nowrap' }}>
          {t('الفترة')}
        </span>
        {reportPeriods.map((p) => (
          <ChipToggle
            key={p}
            label={t(p)}
            on={st.repPeriod === p}
            onClick={() => set({ repPeriod: p })}
          />
        ))}
        <Spacer />
        <Btn
          tone="gold"
          onClick={() => showToast(`صُدّر تقرير مجلس الملاك — ${st.repPeriod} (PDF، 9 صفحات)`)}
          style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Icon path="M12 3v12M7 11l5 5 5-5M4 20h16" size={15} stroke="#fff" width={1.8} />
          {t('صدّر تقرير مجلس الملاك')}
        </Btn>
      </Card>

      <Grid cols="repeat(3,1fr)">
        {reportDefs.map((rc) => (
          <Card key={t(rc.title)} pad={20} style={{ display: 'flex', flexDirection: 'column' }}>
            <IconChip path={rc.icon} bg={rc.iconBg} c={rc.iconC} size={40} icon={19} radius={12} />
            <div style={{ fontSize: 14, fontWeight: 800, color: color.navy, marginTop: 14 }}>
              {t(rc.title)}
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 5, lineHeight: 1.7 }}>
              {t(rc.desc)}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 12 }}>
              <span style={{ ...numeric, fontSize: 22, fontWeight: 700, color: color.navy }}>
                {t(rc.headline)}
              </span>
              <span style={{ fontSize: 11, color: color.slate }}>{t(rc.unit)}</span>
            </div>
            <Spacer />
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <Btn
                onClick={() => showToast(`جارٍ تجهيز ${t(rc.title)} بصيغة PDF — ${st.repPeriod}`)}
                style={{ flex: 1, padding: 9, fontSize: 11 }}
              >
                PDF
              </Btn>
              <Btn
                tone="outline"
                onClick={() => showToast(`صُدّر ${t(rc.title)} بصيغة Excel`)}
                style={{ flex: 1, padding: 9, fontSize: 11 }}
              >
                Excel
              </Btn>
              <Btn
                tone="ghost"
                onClick={() => showToast(`جُدولت ${t(rc.title)} — يُرسل تلقائيًا أول كل شهر`)}
                style={{
                  flex: 1,
                  padding: 9,
                  fontSize: 11,
                  background: 'rgba(199,154,60,0.12)',
                  color: color.goldDeep,
                }}
              >
                {t('جدولة')}
              </Btn>
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}

/* ============================== A17 — portfolio ============================== */

export function Portfolio() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Grid cols="repeat(3,1fr)">
        {portfolioDefs.map((p, i) => {
          const active = st.compoundIdx === i;
          const titleC = active ? '#fff' : color.navy;
          const subC = active ? 'rgba(255,255,255,0.65)' : color.slate;
          return (
            <div
              key={t(p.name)}
              style={{
                background: active
                  ? `linear-gradient(160deg,${color.navyLight},${color.navy})`
                  : '#fff',
                borderRadius: 18,
                padding: 20,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: `2px solid ${active ? color.gold : 'transparent'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: titleC }}>{t(p.name)}</span>
                <Spacer />
                {active && (
                  <Pill bg={color.gold} c="#fff">
                    {t('الحالي')}
                  </Pill>
                )}
              </div>
              <div style={{ fontSize: 11, color: subC, marginTop: 2 }}>
                {p.units} {t('وحدة ·')} {p.city}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <PortStat value={p.collection} label={t('التحصيل')} c={titleC} subC={subC} />
                <PortStat value={p.open} label={t('تذاكر مفتوحة')} c={titleC} subC={subC} />
                <PortStat value={p.csat} label={t('الرضا')} c={titleC} subC={subC} />
              </div>
              <button
                onClick={() => {
                  if (active) return;
                  // Only the first two compounds have a live dataset behind them.
                  set({ compoundIdx: Math.min(i, COMPOUNDS.length - 1) });
                  showToast(`تم التبديل إلى ${t(p.name)}`);
                }}
                style={{
                  width: '100%',
                  marginTop: 16,
                  border: 'none',
                  cursor: active ? 'default' : 'pointer',
                  background: active ? 'rgba(255,255,255,0.14)' : color.navy,
                  color: '#fff',
                  borderRadius: 999,
                  padding: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: font.sans,
                }}
              >
                {active ? t('أنت تديره الآن') : t('التبديل إليه')}
              </button>
            </div>
          );
        })}
      </Grid>

      <Card pad={20} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          {t('مقارنة المحفظة — معدل التحصيل')}
        </div>
        {portfolioBars.map((pb) => (
          <div key={t(pb.name)} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: color.navy, width: 130 }}>
              {t(pb.name)}
            </span>
            <Bar w={pb.w} c={pb.c} />
            <span style={{ ...numeric, fontSize: 12, fontWeight: 700, color: color.navy, width: 44 }}>
              {t(pb.val)}
            </span>
          </div>
        ))}
      </Card>
    </>
  );
}

function PortStat({
  value,
  label,
  c,
  subC,
}: {
  value: string;
  label: string;
  c: string;
  subC: string;
}) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: c }}>{t(value)}</span>
      <span style={{ fontSize: 9.5, color: subC }}>{t(label)}</span>
    </span>
  );
}

/* =========================== A18 — predictive upkeep =========================== */

const riskTone = {
  high: { bg: 'rgba(228,103,90,0.13)', c: color.coralDeep },
  mid: { bg: 'rgba(199,154,60,0.16)', c: color.goldDeep },
  low: { bg: 'rgba(63,166,107,0.13)', c: color.greenDeep },
} as const;

export function Predictive() {
  const { showToast } = useAdmin();

  return (
    <>
      <div
        style={{
          background: 'rgba(199,154,60,0.1)',
          border: '1px solid rgba(199,154,60,0.35)',
          borderRadius: 16,
          padding: '13px 18px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Icon
          path={['M12 3l10 18H2z', 'M12 10v5', 'M12 18h.01']}
          size={18}
          stroke={color.goldDeep}
        />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: color.goldDeep }}>
          {t('حلّل النظام 4,120 تذكرة تاريخية — 3 أصول مرشحة للتعطل خلال 60 يومًا')}
        </span>
      </div>

      <TableCard>
        <TableHead>
          <span style={{ flex: 1 }}>{t('الأصل')}</span>
          <span style={{ width: 130 }}>{t('الموقع')}</span>
          <span style={{ width: 130 }}>{t('آخر صيانة')}</span>
          <span style={{ width: 120 }}>{t('احتمال العطل')}</span>
          <span style={{ width: 130 }}>{t('الإجراء')}</span>
        </TableHead>
        {assetDefs.map((a) => {
          const tone = riskTone[a.level as keyof typeof riskTone];
          return (
            <TableRow key={t(a.name)} style={{ padding: '14px 18px' }}>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                {t(a.name)}
              </span>
              <span style={{ width: 130, fontSize: 11.5, color: color.slate }}>{t(a.loc)}</span>
              <span style={{ width: 130, fontSize: 11.5, color: color.slate }}>{t(a.last)}</span>
              <span style={{ width: 120 }}>
                <Pill bg={tone.bg} c={tone.c} style={{ fontSize: 10.5, padding: '3px 13px' }}>
                  {t(a.risk)}
                </Pill>
              </span>
              <span style={{ width: 130 }}>
                <Btn
                  tone="outline"
                  size="sm"
                  onClick={() => showToast(`جُدولت صيانة وقائية لـ${t(a.name)}`)}
                  style={{ border: `1.5px solid ${color.navy}` }}
                >
                  {t('جدولة صيانة')}
                </Btn>
              </span>
            </TableRow>
          );
        })}
      </TableCard>
    </>
  );
}

/* ============================== A19 — smart meters ============================== */

export function Iot() {
  return (
    <>
      <Grid cols="repeat(3,1fr)">
        <Stat
          label={t('استهلاك الكهرباء — يوليو')}
          value="214.6"
          unit={t('م.و.س')}
          sub={t('↓ 6% عن يونيو')}
          subC={color.greenDeep}
          size={26}
        />
        <Stat
          label={t('استهلاك المياه — يوليو')}
          value="12,840"
          unit={t('م³')}
          sub={t('↑ 3% عن يونيو')}
          subC={color.coral}
          size={26}
        />
        <Stat
          label={t('عدادات متصلة')}
          value={`${IOT_CONNECTED}`}
          unit={`/ ${IOT_TOTAL}`}
          sub={`${IOT_TOTAL - IOT_CONNECTED} عدادًا غير متصل`}
          size={26}
        />
      </Grid>

      <Card pad={20} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          {t('الاستهلاك حسب الحي — كهرباء')}
        </div>
        {iotZones.map((z) => (
          <div key={t(z.name)} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: color.navy, width: 110 }}>
              {t(z.name)}
            </span>
            <Bar w={z.w} c={z.c} />
            <span style={{ ...numeric, fontSize: 11.5, fontWeight: 600, color: color.slate, width: 80 }}>
              {t(z.val)}
            </span>
            {z.anomaly && (
              <Pill bg="rgba(228,103,90,0.13)" c={color.coral}>
                {t('استهلاك شاذ')}
              </Pill>
            )}
          </div>
        ))}
      </Card>
    </>
  );
}
