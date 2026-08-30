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

/* ==================== A27 — per-category sourcing model ==================== */

export function Sourcing() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Note>
        لكل فئة خدمة، اختر إن كانت تُدار داخليًا بفريق المجمع أو متاحة عبر سوق مقدمي الخدمة الفوري —
        يمكن التوسع تدريجيًا فئة بفئة.
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
                {cat}
              </span>
              <ChipToggle label="تدار داخليًا" on={mode === 'in'} onClick={() => pick('in')} />
              <ChipToggle
                label="سوق مقدمي الخدمة 🟩"
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
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>إجمالي العمولة — يوليو</div>
          <div style={{ ...numeric, fontSize: 32, fontWeight: 700, color: '#fff', marginTop: 6 }}>
            18,420 <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>ر.س</span>
          </div>
          <div style={{ fontSize: 11, color: color.greenBright, marginTop: 6, fontWeight: 800 }}>
            ↑ 22% عن يونيو
          </div>
        </NavyCard>
        <Stat label="عدد المهام المكتملة" value="312" sub="متوسط قيمة المهمة 162 ر.س" />
        <Stat
          label="حصة الكمبوند من العمولة"
          value="2,763"
          unit="ر.س"
          sub="15% من عمولة رفادة — إيراد جديد للإدارة"
        />
      </Grid>

      <Card style={{ marginTop: 14 }} pad={20}>
        <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
          العمولة حسب فئة الخدمة
        </div>
        {revenueByCat.map((r) => (
          <div
            key={r.cat}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: color.navy, width: 120 }}>
              {r.cat}
            </span>
            <Bar w={r.w} />
            <span
              style={{ ...numeric, fontSize: 12, fontWeight: 700, color: color.navy, width: 80 }}
            >
              {r.val} ر.س
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
          <Card key={v.name} pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={v.name} size={38} />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{v.name}</span>
                <span style={{ fontSize: 11, color: color.slate }}>{v.cat}</span>
              </span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CheckLine on={v.id} label="تحقق الهوية" />
              <CheckLine on={v.cert} label="الشهادات والتراخيص" />
              <CheckLine on={v.bg} label="الفحص الأمني (اختياري)" />
            </div>
            <Btn
              tone={active ? 'green' : ready ? 'navy' : 'ghost'}
              onClick={() => {
                if (active || !ready) return;
                set((s) => ({ vettingState: { ...s.vettingState, [i]: 'active' } }));
                showToast(`فُعّل حساب ${v.name} — أُصدرت بيانات الدخول`);
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
      <span style={{ fontSize: 11.5, color: color.slateDark }}>{label}</span>
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
        كل مبلغ محجوز في الإسكرو حتى يؤكد الساكن اكتمال الخدمة — عند الاعتراض يُجمَّد ويُحسم من هنا،
        وكل قرار يُسجَّل في سجل التدقيق.
      </Note>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {disputeDefs.map((d, i) => {
          const state = st.disputesState[i];
          const open = state === 'open';
          return (
            <Card key={d.title} pad={18}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{d.title}</span>
                <Spacer />
                <Pill bg="rgba(199,154,60,0.16)" c={color.goldDeep} style={{ fontSize: 10.5 }}>
                  المبلغ محجوز: {d.amount} ر.س
                </Pill>
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
                {d.by} · {d.reason} · {d.date}
              </div>
              {open ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Btn
                    tone="coral"
                    onClick={() =>
                      resolve(i, 'refund', `استُرد ${d.amount} ر.س كاملًا للساكن`)
                    }
                    style={{ flex: 1, padding: 9, fontSize: 11.5 }}
                  >
                    استرداد كامل للساكن
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
                    دفع جزئي
                  </Btn>
                  <Btn
                    tone="ghost"
                    onClick={() =>
                      resolve(i, 'release', `حُرّر ${d.amount} ر.س لمقدم الخدمة`)
                    }
                    style={{
                      flex: 1,
                      padding: 9,
                      fontSize: 11.5,
                      color: color.greenDeep,
                      border: `1.5px solid ${color.green}`,
                    }}
                  >
                    دفع كامل للمقدم
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
                  تم الحل: {disputeResolutions[state]}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Card style={{ marginTop: 14 }}>
        <CardTitle>ملخّص الإسكرو</CardTitle>
        <div style={{ fontSize: 11.5, color: color.slate, marginTop: 6, lineHeight: 1.9 }}>
          {disputeDefs.length} نزاع في السجل ·{' '}
          {Object.values(st.disputesState).filter((s) => s === 'open').length} مفتوح الآن · القرارات
          المالية كلها مقيّدة في سجل التدقيق ولا تُحذف.
        </div>
      </Card>
    </>
  );
}
