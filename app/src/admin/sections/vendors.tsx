import { color, numeric } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  billAggDefs,
  maintVendors,
  marketVendors,
  navIcons,
  onboardCats,
  providerDirDefs,
  reModDefs,
  reModMeta,
  storesTableDefs,
} from '../data';
import { useAdmin, type VendorTab } from '../store';
import {
  Avatar,
  BackLink,
  Btn,
  Card,
  ChipToggle,
  Field,
  Grid,
  IconChip,
  NavyCard,
  Note,
  Pill,
  Spacer,
  Stat,
  TableCard,
  TableHead,
  TableRow,
  initialOf,
} from '../ui';
import { t } from '@/i18n/lang';

/* ===================== A7 / A12 / A21 — vendors & providers ===================== */

const vendorTabs: { key: VendorTab; label: string }[] = [
  { key: 'maint', label: 'موردو الصيانة' },
  { key: 'market', label: 'موردو السوق الداخلي' },
  { key: 'providers', label: 'مقدمو الخدمة الفورية 🟩' },
];

export function Vendors() {
  const { st, set, go } = useAdmin();
  const cards = st.vendorTab === 'market' ? marketVendors : maintVendors;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {vendorTabs.map((tab) => (
          <ChipToggle
            key={tab.key}
            label={t(tab.label)}
            on={st.vendorTab === tab.key}
            onClick={() => set({ vendorTab: tab.key })}
          />
        ))}
      </div>

      {st.vendorTab === 'providers' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: color.slate }}>
              {t('مطابقة فورية على غرار أوبر — كل مقدم لديه تطبيقه الخاص (P1–P4)')}
            </div>
            <Spacer />
            <Btn onClick={() => go('onboard')}>{t('+ تعيين مقدم خدمة جديد')}</Btn>
          </div>
          <TableCard>
            <TableHead>
              <span style={{ flex: 1 }}>{t('المقدم')}</span>
              <span style={{ width: 120 }}>{t('الفئة')}</span>
              <span style={{ width: 100 }}>{t('المنطقة')}</span>
              <span style={{ width: 90 }}>{t('التقييم')}</span>
              <span style={{ width: 90 }}>{t('مهام منجزة')}</span>
              <span style={{ width: 100 }}>{t('الحالة')}</span>
            </TableHead>
            {providerDirDefs.map((p) => (
              <TableRow key={t(p.name)}>
                <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Avatar name={t(p.name)} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                    {t(p.name)}
                  </span>
                </span>
                <span style={{ width: 120, fontSize: 11.5, color: color.slateDark }}>{t(p.cat)}</span>
                <span style={{ width: 100, fontSize: 11.5, color: color.slate }}>{t(p.zone)}</span>
                <span style={{ width: 90, ...numeric, fontSize: 12, fontWeight: 700, color: color.navy }}>
                  ★ {p.rating}
                </span>
                <span style={{ width: 90, ...numeric, fontSize: 12, color: color.slateDark }}>
                  {p.jobs}
                </span>
                <span style={{ width: 100 }}>
                  <Pill
                    bg={p.ok ? 'rgba(63,166,107,0.13)' : 'rgba(199,154,60,0.16)'}
                    c={p.ok ? color.greenDeep : color.goldDeep}
                  >
                    {p.ok ? t('نشط') : t('قيد الاعتماد')}
                  </Pill>
                </span>
              </TableRow>
            ))}
          </TableCard>
        </>
      ) : (
        <Grid cols="repeat(3,1fr)">
          {cards.map((v) => (
            <Card key={t(v.name)} pad={18}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: color.tile,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: color.navy,
                  }}
                >
                  {initialOf(v.name)}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>
                    {t(v.name)}
                  </span>
                  <span style={{ fontSize: 11, color: color.slate }}>{t(v.spec)}</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                <VendorStat value={`★ ${v.rating}`} label={t('التقييم')} />
                <VendorStat value={v.jobs} label={v.jobsLabel} />
                <VendorStat value={v.commission} label={t('العمولة')} c={color.goldDeep} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
                <Pill
                  bg={v.ok ? 'rgba(63,166,107,0.13)' : 'rgba(199,154,60,0.16)'}
                  c={v.ok ? color.greenDeep : color.goldDeep}
                >
                  {v.ok ? t('نشط') : t('قيد المراجعة')}
                </Pill>
                <Spacer />
                <span dir="ltr" style={{ ...numeric, fontSize: 11, color: color.slate }}>
                  {t(v.phone)}
                </span>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </>
  );
}

function VendorStat({ value, label, c = color.navy }: { value: string; label: string; c?: string }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ ...numeric, fontSize: 15, fontWeight: 700, color: c }}>{t(value)}</span>
      <span style={{ fontSize: 9.5, color: color.slateLight }}>{t(label)}</span>
    </span>
  );
}

/* ======================== A20 — provider onboarding ======================== */

export function Onboarding() {
  const { st, set, go, showToast } = useAdmin();

  return (
    <>
      <BackLink label={t('العودة لدليل الموردين')} onClick={() => go('vendors')} />
      <Grid cols="1.3fr 1fr">
        <Card pad={22}>
          <div style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>
            {t('بيانات مقدم الخدمة الجديد')}
          </div>
          <div style={{ marginTop: 12 }}>
            <Field
              value={st.obName}
              onChange={(v) => set({ obName: v })}
              placeholder={t('الاسم الكامل')}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Field
              value={st.obPhone}
              onChange={(v) => set({ obPhone: v })}
              placeholder={t('رقم الهاتف')}
              dir="ltr"
              style={{ fontSize: 12.5 }}
            />
            <Field
              value={st.obCommission}
              onChange={(v) => set({ obCommission: v })}
              placeholder={t('نسبة العمولة %')}
              style={{ fontSize: 12.5 }}
            />
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: color.navy, margin: '14px 0 8px' }}>
            {t('فئة الخدمة')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {onboardCats.map((c, i) => (
              <ChipToggle
                key={c}
                label={c}
                on={st.obCat === i}
                onClick={() => set({ obCat: i })}
              />
            ))}
          </div>
          <button
            onClick={() => showToast(t('اختر ملفات الهوية والشهادات (محاكاة)'))}
            style={{
              width: '100%',
              marginTop: 16,
              border: '1.5px dashed rgba(31,59,87,0.3)',
              background: 'transparent',
              borderRadius: 14,
              padding: 12,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              color: color.slate,
            }}
          >
            {t('رفع الوثائق والشهادات')}
          </button>
          <Btn
            tone="gold"
            size="lg"
            onClick={() => {
              if (!st.obName.trim() || !st.obPhone.trim()) {
                showToast(t('أدخل الاسم ورقم الهاتف أولًا'));
                return;
              }
              set({ obDone: true });
              showToast(`${t('أُصدرت بيانات دخول')} ${st.obName} ${t('— أُرسلت عبر SMS')}`);
            }}
            style={{ width: '100%', marginTop: 14 }}
          >
            {t('حفظ وإصدار بيانات الدخول')}
          </Btn>
        </Card>

        {st.obDone ? (
          <NavyCard
            pad={22}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <Icon path={navIcons.gate} size={86} stroke="#fff" width={1.4} linecap="butt" />
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', marginTop: 12 }}>
              شارك رمز QR أو رابط SMS مع {st.obName} لتثبيت تطبيق مقدم الخدمة
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
              {t('تم إصدار بيانات الدخول تلقائيًا — الهاتف')} {st.obPhone}
            </div>
          </NavyCard>
        ) : (
          <Card pad={22}>
            <div style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>
              {t('كيف تعمل المطابقة الفورية')}
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 8, lineHeight: 2 }}>
              {t('بعد الحفظ، يظهر المقدم في قائمة السكان عند طلب خدمة من فئته — يصله إشعار فوري (على غرار أوبر) مع مهلة للرد.')}
            </div>
          </Card>
        )}
      </Grid>
    </>
  );
}

/* ========================= A31 — bill aggregator ========================= */

export function BillAggregator() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Grid cols="repeat(3,1fr)" style={{ marginBottom: 14 }}>
        <NavyCard>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            {t('رسوم خدمة الفواتير — يوليو')}
          </div>
          <div style={{ ...numeric, fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 6 }}>
            4,215 <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{t('ر.س')}</span>
          </div>
          <div
            style={{ fontSize: 11, color: color.greenBright, marginTop: 6, fontWeight: 800 }}
          >
            1,405 عملية سداد × 3 ر.س
          </div>
        </NavyCard>
        <Stat label={t('فواتير مربوطة')} value="612" sub={t('عبر 238 وحدة — 71% من السكان')} />
        <Card pad={20}>
          <div style={{ fontSize: 12, color: color.slate }}>{t('شريك التجميع')}</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: color.navy, marginTop: 8 }}>
            {t('مدفوعات مدى')}
          </div>
          <div style={{ fontSize: 11, color: color.slate, marginTop: 6 }}>
            {t('السعودية — تسوية يومية T+1')}
          </div>
        </Card>
      </Grid>

      <TableCard>
        <TableHead>
          <span style={{ flex: 1 }}>{t('الفئة')}</span>
          <span style={{ flex: 1.6 }}>{t('المزودون المتاحون للسكان')}</span>
          <span style={{ width: 110 }}>{t('عمليات يوليو')}</span>
          <span style={{ width: 100 }}>{t('الحالة')}</span>
        </TableHead>
        {billAggDefs.map((ba, i) => {
          const on = st.billAggOn[i];
          return (
            <TableRow key={t(ba.cat)}>
              <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9 }}>
                <IconChip path={ba.icon} />
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(ba.cat)}</span>
              </span>
              <span style={{ flex: 1.6, fontSize: 11.5, color: color.slateDark }}>
                {t(ba.providers)}
              </span>
              <span style={{ width: 110, ...numeric, fontSize: 12, color: color.slateDark }}>
                {ba.txns}
              </span>
              <span style={{ width: 100 }}>
                <button
                  onClick={() => {
                    set((s) => ({ billAggOn: { ...s.billAggOn, [i]: !on } }));
                    showToast(on ? `أُوقفت فئة ${t(ba.cat)} مؤقتًا` : `فُعّلت فئة ${t(ba.cat)} للسكان`);
                  }}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    background: on ? 'rgba(63,166,107,0.13)' : 'rgba(107,114,128,0.12)',
                    color: on ? color.greenDeep : color.slate,
                    borderRadius: 999,
                    padding: '4px 14px',
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {on ? t('مفعّلة') : t('موقوفة')}
                </button>
              </span>
            </TableRow>
          );
        })}
      </TableCard>
    </>
  );
}

/* ==================== A28 — real-estate listing moderation ==================== */

export function RealEstateModeration() {
  const { st, set, showToast } = useAdmin();

  return (
    <>
      <Note>
        {t('كل إعلان يتحقق تلقائيًا من أن المعلن ساكن موثّق في الوحدة نفسها — الإدارة تراجع المحتوى فقط. لا معاملات دفع داخل التطبيق.')}
      </Note>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reModDefs.map((r, i) => {
          const state = st.reModState[i];
          const m = reModMeta[state];
          return (
            <Card key={t(r.title)} pad={18}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(r.title)}</span>
                <Pill bg="rgba(31,59,87,0.08)" c={color.navy} style={{ marginRight: 10 }}>
                  {r.type === 'rent' ? t('للإيجار') : t('للبيع')}
                </Pill>
                <Spacer />
                <Pill bg={m.bg} c={m.c} style={{ fontSize: 10.5 }}>
                  {t(m.label)}
                </Pill>
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
                {r.owner} · {r.price} {t('· وحدة موثّقة ✓ ·')} {t(r.date)}
              </div>
              {state === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Btn
                    tone="green"
                    onClick={() => {
                      set((s) => ({ reModState: { ...s.reModState, [i]: 'approved' } }));
                      showToast(t('نُشر الإعلان في سوق العقارات — وصل إشعار للمعلن'));
                    }}
                    style={{ flex: 1, padding: 9, fontSize: 11.5 }}
                  >
                    {t('اعتماد ونشر')}
                  </Btn>
                  <Btn
                    tone="ghost"
                    onClick={() => {
                      set((s) => ({ reModState: { ...s.reModState, [i]: 'rejected' } }));
                      showToast(t('رُفض الإعلان مع إخطار المعلن بالسبب'));
                    }}
                    style={{
                      flex: 1,
                      padding: 9,
                      fontSize: 11.5,
                      color: color.coral,
                      border: `1.5px solid ${color.coral}`,
                    }}
                  >
                    {t('رفض مع إخطار المعلن')}
                  </Btn>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ====================== A29 / A30 — stores directory ====================== */

export function StoresDirectory() {
  const { st, set } = useAdmin();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: color.slate }}>
          {t('متاجر معتمدة داخل الكمبوند وحوله — كل متجر لديه واجهة «متجر» في تطبيق مقدم الخدمة (P9–P11)')}
        </div>
        <Spacer />
        <Btn onClick={() => set({ storeAddedShown: !st.storeAddedShown })}>{t('+ تعيين متجر جديد')}</Btn>
      </div>

      {st.storeAddedShown && (
        <NavyCard
          pad="16px 20px"
          style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <Icon path={navIcons.gate} size={34} stroke="#fff" width={1.4} linecap="butt" />
          <span
            style={{ flex: 1, fontSize: 12.5, fontWeight: 800, color: '#fff', lineHeight: 1.8 }}
          >
            {t('تدفق التعيين مطابق لمقدمي الخدمة: بيانات المتجر + «نوع مقدم الخدمة» (فئة مفتوحة — مطعم،')}
            {t('صيدلية، بقالة، ورد، أو أي فئة جديدة دون تعديل برمجي) + السجل التجاري + نسبة العمولة (12%)')}
            ← إصدار بيانات دخول واجهة المتجر عبر QR / SMS
          </span>
        </NavyCard>
      )}

      <TableCard>
        <TableHead>
          <span style={{ flex: 1 }}>{t('المتجر')}</span>
          <span style={{ width: 100 }}>{t('النوع')}</span>
          <span style={{ width: 90 }}>{t('التقييم')}</span>
          <span style={{ width: 110 }}>{t('طلبات هذا الشهر')}</span>
          <span style={{ width: 110 }}>{t('عمولة محصّلة')}</span>
          <span style={{ width: 90 }}>{t('الحالة')}</span>
        </TableHead>
        {storesTableDefs.map((s) => (
          <TableRow key={t(s.name)}>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: s.logoBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flex: 'none',
                }}
              >
                {t(s.emoji)}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t(s.name)}</span>
            </span>
            <span style={{ width: 100, fontSize: 11.5, color: color.slateDark }}>{t(s.kind)}</span>
            <span style={{ width: 90, ...numeric, fontSize: 12, fontWeight: 700, color: color.navy }}>
              ★ {s.rating}
            </span>
            <span style={{ width: 110, ...numeric, fontSize: 12, color: color.slateDark }}>
              {s.orders}
            </span>
            <span
              style={{ width: 110, ...numeric, fontSize: 12, fontWeight: 700, color: color.goldDeep }}
            >
              {s.commission} ر.س
            </span>
            <span style={{ width: 90 }}>
              <Pill
                bg={s.ok ? 'rgba(63,166,107,0.13)' : 'rgba(199,154,60,0.16)'}
                c={s.ok ? color.greenDeep : color.goldDeep}
              >
                {s.ok ? t('نشط') : t('قيد الاعتماد')}
              </Pill>
            </span>
          </TableRow>
        ))}
      </TableCard>
    </>
  );
}
