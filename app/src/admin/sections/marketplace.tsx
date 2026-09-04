import { color, numeric } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  disputeDefs,
  disputeResolutions,
  revenueByCat,
  sourcingCats,
  vettingDefs,
} from '../data';
import { useAdmin, type DisputeState } from '../store';
import {
  Avatar,
  Bar,
  Btn,
  Card,
  CardTitle,
  ChipToggle,
  Grid,
  NavyCard,
  Note,
  Pill,
  Spacer,
  Stat,
  CHECK,
} from '../ui';
import { t } from '@/i18n/lang';

/* ==================== A27 — per-category sourcing model ==================== */

export function Sourcing() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Note>
        {t('لكل فئة خدمة، اختر إن كانت تُدار داخليًا بفريق المجمع أو متاحة عبر سوق مقدمي الخدمة الفوري — يمكن التوسع تدريجيًا فئة بفئة.')}
      </Note>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sourcingCats.map((cat) => {
          const mode = st.sourcing[cat];
          const pick = (m: 'in' | 'out') => {
            set((s) => ({ sourcing: { ...s.sourcing, [cat]: m } }));
            showToast(
              m === 'in'
                ? `${cat}: تُدار الآن داخليًا بفريق المجمع`
                : `${cat}: أصبحت متاحة عبر سوق مقدمي الخدمة`,
            );
          };
          return (
            <Card
              key={cat}
              pad="16px 18px"
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: color.navy }}>
                {t(cat)}
              </span>
              <ChipToggle label={t('تدار داخليًا')} on={mode === 'in'} onClick={() => pick('in')} />
              <ChipToggle
                label={t('سوق مقدمي الخدمة 🟩')}
                on={mode === 'out'}
                onClick={() => pick('out')}
                tone={color.green}
              />
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ======================= A25 — commission & revenue ======================= */

export function Revenue() {
  return (
    <>
      <Grid cols="repeat(3,1fr)">
        <NavyCard>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('إجمالي العمولة — يوليو')}</div>
          <div style={{ ...numeric, fontSize: 32, fontWeight: 700, color: '#fff', marginTop: 6 }}>
            18,420 <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{t('ر.س')}</span>
          </div>
          <div style={{ fontSize: 11, color: color.greenBright, marginTop: 6, fontWeight: 800 }}>
            ↑ 22% عن يونيو
          </div>
        </NavyCard>
        <Stat label={t('عدد المهام المكتملة')} value="312" sub={t('متوسط قيمة المهمة 162 ر.س')} />
        <Stat
          label={t('حصة الكمبوند من العمولة')}
          value="2,763"
          unit={t('ر.س')}
          sub={t('15% من عمولة رفادة — إيراد جديد للإدارة')}
        />
      </Grid>

      <Card style={{ marginTop: 14 }} pad={20}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          {t('العمولة حسب فئة الخدمة')}
        </div>
        {revenueByCat.map((r) => (
          <div
            key={t(r.cat)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: color.navy, width: 120 }}>
              {t(r.cat)}
            </span>
            <Bar w={r.w} />
            <span
              style={{ ...numeric, fontSize: 12, fontWeight: 700, color: color.navy, width: 80 }}
            >
              {t(r.val)} ر.س
            </span>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ==================== A24 — provider verification & vetting ==================== */

export function Verification() {
  const { st, set, showToast } = useAdmin();

  return (
    <Grid cols="repeat(2,1fr)">
      {vettingDefs.map((v, i) => {
        const active = st.vettingState[i] === 'active';
        const ready = v.id && v.cert;
        return (
          <Card key={t(v.name)} pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={t(v.name)} size={38} />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(v.name)}</span>
                <span style={{ fontSize: 11, color: color.slate }}>{t(v.cat)}</span>
              </span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CheckLine on={v.id} label={t('تحقق الهوية')} />
              <CheckLine on={v.cert} label={t('الشهادات والتراخيص')} />
              <CheckLine on={v.bg} label={t('الفحص الأمني (اختياري)')} />
            </div>
            <Btn
              tone={active ? 'green' : ready ? 'navy' : 'ghost'}
              onClick={() => {
                if (active || !ready) return;
                set((s) => ({ vettingState: { ...s.vettingState, [i]: 'active' } }));
                showToast(`${t('فُعّل حساب')} ${t(v.name)} ${t('— أُصدرت بيانات الدخول')}`);
              }}
              style={{
                width: '100%',
                marginTop: 14,
                padding: 11,
                fontSize: 12.5,
                cursor: active || !ready ? 'default' : 'pointer',
                opacity: ready ? 1 : 0.45,
                ...(ready ? null : { background: color.slateLight, color: '#fff' }),
              }}
            >
              {active
                ? 'مُعتمد ونشط ✓'
                : ready
                  ? 'اعتماد وتفعيل الحساب'
                  : 'بانتظار استكمال المستندات'}
            </Btn>
          </Card>
        );
      })}
    </Grid>
  );
}

function CheckLine({ on, label }: { on: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 5,
          background: on ? color.green : color.line,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon path={CHECK} size={10} stroke="#fff" width={3} />
      </span>
      <span style={{ fontSize: 11.5, color: color.slateDark }}>{t(label)}</span>
    </div>
  );
}

/* ====================== A26 — dispute resolution centre ====================== */

export function Disputes() {
  const { st, set, showToast } = useAdmin();

  const resolve = (i: number, how: DisputeState, msg: string) => {
    set((s) => ({ disputesState: { ...s.disputesState, [i]: how } }));
    showToast(msg);
  };

  return (
    <>
      <Note>
        {t('كل مبلغ محجوز في الإسكرو حتى يؤكد الساكن اكتمال الخدمة — عند الاعتراض يُجمَّد ويُحسم من هنا، وكل قرار يُسجَّل في سجل التدقيق.')}
      </Note>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {disputeDefs.map((d, i) => {
          const state = st.disputesState[i];
          const open = state === 'open';
          return (
            <Card key={t(d.title)} pad={18}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(d.title)}</span>
                <Spacer />
                <Pill bg="rgba(199,154,60,0.16)" c={color.goldDeep} style={{ fontSize: 10.5 }}>
                  {t('المبلغ محجوز:')} {t(d.amount)} {t('ر.س')}
                </Pill>
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
                {t(d.by)} · {t(d.reason)} · {t(d.date)}
              </div>
              {open ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Btn
                    tone="coral"
                    onClick={() =>
                      resolve(i, 'refund', `استُرد ${t(d.amount)} ر.س كاملًا للساكن`)
                    }
                    style={{ flex: 1, padding: 9, fontSize: 11.5 }}
                  >
                    {t('استرداد كامل للساكن')}
                  </Btn>
                  <Btn
                    tone="ghost"
                    onClick={() => resolve(i, 'partial', 'قُسّم المبلغ بين الطرفين — 50%')}
                    style={{
                      flex: 1,
                      padding: 9,
                      fontSize: 11.5,
                      color: color.goldDeep,
                      border: `1.5px solid ${color.gold}`,
                    }}
                  >
                    {t('دفع جزئي')}
                  </Btn>
                  <Btn
                    tone="ghost"
                    onClick={() =>
                      resolve(i, 'release', `حُرّر ${t(d.amount)} ر.س لمقدم الخدمة`)
                    }
                    style={{
                      flex: 1,
                      padding: 9,
                      fontSize: 11.5,
                      color: color.greenDeep,
                      border: `1.5px solid ${color.green}`,
                    }}
                  >
                    {t('دفع كامل للمقدم')}
                  </Btn>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 12,
                    background: 'rgba(63,166,107,0.1)',
                    borderRadius: 999,
                    padding: 8,
                    textAlign: 'center',
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: color.greenDeep,
                  }}
                >
                  {t('تم الحل:')} {t(disputeResolutions[state])}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Card style={{ marginTop: 14 }}>
        <CardTitle>{t('ملخّص الإسكرو')}</CardTitle>
        <div style={{ fontSize: 11.5, color: color.slate, marginTop: 6, lineHeight: 1.9 }}>
          {disputeDefs.length} {t('نزاع في السجل ·')}{' '}
          {Object.values(st.disputesState).filter((s) => s === 'open').length} {t('مفتوح الآن · القرارات')}
          {t('المالية كلها مقيّدة في سجل التدقيق ولا تُحذف.')}
        </div>
      </Card>
    </>
  );
}
