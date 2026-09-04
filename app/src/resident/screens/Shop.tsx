import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { icons } from '../data/icons';
import { UNIT, UNIT_NO } from '../data/seed';
import {
  FREE_DELIVERY_OVER,
  menuByStore,
  orderStepDefs,
  pastOrderDefs,
  shopCatDefs,
  storeDefs,
  storeIcon,
  trackEtas,
} from '../data/shop';
import { useResident } from '../store';
import { Avatar } from './parts';
import { t } from '@/i18n/lang';

const menuOf = (idx: number) => menuByStore[idx] ?? menuByStore[0];

/** R46 — Store browse. */
function Browse() {
  const { st, set, back, go, showToast } = useResident();
  const q = st.shopQuery.trim();

  const list = storeDefs
    .map((s, i) => ({ ...s, i }))
    .filter((s) => (st.fdTab === 'all' || s.kind === st.fdTab) && (!q || s.name.includes(q)));

  const catLabel = shopCatDefs.find((c) => c.key === st.fdTab)?.label ?? '';
  const header = q ? t('نتائج البحث') : st.fdTab === 'all' ? t('الأقرب لك') : catLabel;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t('المتجر')}</div>
        <button
          onClick={() => go('foodHistory')}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: radius.pill,
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 800,
            color: color.navy,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: font.sans,
            whiteSpace: 'nowrap',
          }}
        >
          {t('طلباتي')}
        </button>
      </div>

      {/* search + delivery address */}
      <div style={{ margin: '8px 18px 0', display: 'flex', gap: 8 }}>
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: radius.pill,
            padding: '10px 15px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }}>
            <circle cx="11" cy="11" r="7" stroke={color.slate} strokeWidth="1.5" />
            <path d="M20 20l-3.5-3.5" stroke={color.slate} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={st.shopQuery}
            onChange={(e) => set({ shopQuery: e.target.value })}
            placeholder={t('ابحث عن متجر…')}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 12,
              color: color.navy,
              outline: 'none',
              fontFamily: font.sans,
              minWidth: 0,
            }}
          />
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: radius.pill,
            padding: '10px 14px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flex: 'none',
          }}
        >
          <Icon path={icons.pin} size={13} stroke={color.gold} width={1.5} />
          <span style={{ fontSize: 10.5, fontWeight: 800, color: color.navy, whiteSpace: 'nowrap' }}>
            {t(UNIT_NO)}
          </span>
        </div>
      </div>

      {/* category circles — line icons only, no emoji */}
      <div style={{ padding: '14px 0 2px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 14, padding: '0 20px', width: 'max-content' }}>
          {shopCatDefs.map((c) => {
            const on = st.fdTab === c.key;
            return (
              <button
                key={c.key}
                onClick={() => set({ fdTab: c.key })}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: 0,
                }}
              >
                <span
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 99,
                    background: on ? color.navy : '#fff',
                    border: `1.5px solid ${on ? color.navy : 'rgba(31,59,87,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <Icon
                    path={c.key === 'all' ? icons.grid : storeIcon(c.key as never)}
                    size={21}
                    stroke={on ? '#fff' : color.navy}
                    width={1.5}
                  />
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: on ? color.navy : color.slate,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(c.label)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 2px' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t(header)}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10.5, color: color.slate }}>{list.length} {t('متجر')}</span>
        </div>

        {list.map((s) => (
          <button
            key={t(s.name)}
            onClick={() =>
              s.open
                ? go('foodMenu', { selStoreIdx: s.i, cart: {} })
                : showToast(`${t(s.name)} ${t('مغلق الآن — يفتح غدًا 10 صباحًا')}`)
            }
            style={{
              width: '100%',
              border: 'none',
              cursor: s.open ? 'pointer' : 'default',
              background: '#fff',
              borderRadius: 18,
              padding: '15px 16px',
              boxShadow: shadow.card,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'right',
              opacity: s.open ? 1 : 0.55,
            }}
          >
            <span
              style={{
                width: 50,
                height: 50,
                borderRadius: radius.tile,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={storeIcon(s.kind)} size={23} width={1.5} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: color.navy,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t(s.name)}
                </span>
                {s.promo && (
                  <StatusPill tone="gold" style={{ fontSize: 9, padding: '2px 10px', fontWeight: 800 }}>
                    {t(s.promo)}
                  </StatusPill>
                )}
              </span>
              <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                ★ {s.rating} · {t(s.eta)} {t('· توصيل')} {s.deliv === 0 ? t('مجاني') : `${s.deliv} ${t('ر.س')}`}
              </span>
            </span>
            <StatusPill
              tone={s.open ? 'green' : 'gray'}
              style={{ fontSize: 10, padding: '3px 12px', fontWeight: 800 }}
            >
              {s.open ? t('مفتوح') : t('مغلق الآن')}
            </StatusPill>
          </button>
        ))}

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 20px', fontSize: 12.5, color: color.slateLight }}>
            {t('لا توجد نتائج — جرّب بحثًا أو فئة أخرى')}
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared cart maths — used by the menu, cart and tracker. */
function useCartTotals() {
  const { st } = useResident();
  const menu = menuOf(st.selStoreIdx);
  const store = storeDefs[st.selStoreIdx] ?? storeDefs[0];
  const count = Object.values(st.cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(st.cart).reduce(
    (a, [i, q]) => a + (menu[Number(i)] ? menu[Number(i)].price * q : 0),
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : store.deliv;
  const grand = subtotal + (subtotal > 0 ? delivery : 0);
  const lines = Object.entries(st.cart).map(([i, q]) => ({
    name: menu[Number(i)].name,
    qty: q,
    total: menu[Number(i)].price * q,
  }));
  return { menu, store, count, subtotal, delivery, grand, lines };
}

/** R47 — Store menu with quantity steppers and a floating cart bar. */
function Menu() {
  const { st, set, back, go } = useResident();
  const { menu, store, count, subtotal } = useCartTotals();

  const setQty = (i: number, d: number) =>
    set((s) => {
      const q = Math.max(0, (s.cart[i] ?? 0) + d);
      const cart = { ...s.cart };
      if (q === 0) delete cart[i];
      else cart[i] = q;
      return { cart };
    });

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: color.tile,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon path={storeIcon(store.kind)} size={20} width={1.5} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              fontSize: 15.5,
              fontWeight: 900,
              color: color.navy,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t(store.name)}
          </span>
          <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
            ★ {store.rating} · {t(store.eta)} {t('· توصيل')} {store.deliv === 0 ? t('مجاني') : `${store.deliv} ${t('ر.س')}`}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 120px' }}>
        <div
          style={{
            margin: '4px 20px 0',
            background: 'rgba(199,154,60,0.1)',
            borderRadius: radius.tile,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon path={icons.scooter} size={14} stroke={color.goldDeep} width={1.5} />
          <span style={{ fontSize: 10.5, fontWeight: 800, color: color.goldDeep }}>
            {t('التوصيل مجاني للطلبات فوق')} {FREE_DELIVERY_OVER} {t('ر.س')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '14px 20px 8px' }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t('القائمة')}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10.5, color: color.slate }}>{menu.length} {t('صنف')}</span>
        </div>

        <div style={{ padding: '0 18px' }}>
          {menu.map((mi, i) => {
            const qty = st.cart[i] ?? 0;
            return (
              <Card
                key={t(mi.name)}
                pad="14px 16px"
                style={{ borderRadius: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: color.tile,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <Icon path={storeIcon(store.kind)} size={20} stroke={color.slate} width={1.5} />
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(mi.name)}</span>
                  <span style={{ ...numeric, fontSize: 12, fontWeight: 700, color: color.goldDeep }}>
                    {mi.price} {t('ر.س')}
                  </span>
                </span>
                {qty > 0 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 'none' }}>
                    <button
                      onClick={() => setQty(i, -1)}
                      aria-label="إنقاص"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 99,
                        border: '1.5px solid rgba(31,59,87,0.25)',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: 15,
                        fontWeight: 800,
                        color: color.navy,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        ...numeric,
                        fontSize: 14,
                        fontWeight: 700,
                        color: color.navy,
                        minWidth: 16,
                        textAlign: 'center',
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(i, 1)}
                      aria-label="زيادة"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 99,
                        border: 'none',
                        background: color.navy,
                        cursor: 'pointer',
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setQty(i, 1)}
                    style={{
                      cursor: 'pointer',
                      background: 'transparent',
                      color: color.navy,
                      border: `1.5px solid ${color.navy}`,
                      borderRadius: radius.pill,
                      padding: '7px 16px',
                      fontSize: 11.5,
                      fontWeight: 800,
                      fontFamily: font.sans,
                      flex: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('+ أضف')}
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {count > 0 && (
        <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
          <button
            onClick={() => go('foodCart')}
            style={{
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              background: color.navy,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 800,
              fontFamily: font.sans,
              boxShadow: '0 8px 24px rgba(31,59,87,0.35)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 99,
                padding: '2px 10px',
                ...numeric,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {count}
            </span>
            <span style={{ flex: 1, textAlign: 'center' }}>{t('عرض السلة')}</span>
            <span style={{ ...numeric, fontSize: 13, fontWeight: 700 }}>{subtotal} {t('ر.س')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** R48 — Cart & checkout, paid into the same escrow hold. */
function Cart() {
  const { st, set, back, showToast } = useResident();
  const { lines, delivery, grand, subtotal } = useCartTotals();

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('السلة والدفع')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 30px' }}>
        <Card pad="6px 16px" style={{ borderRadius: 18 }}>
          {lines.map((cl) => (
            <div
              key={t(cl.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                {t(cl.name)} × {cl.qty}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ ...numeric, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
                {cl.total} {t('ر.س')}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: color.navy, whiteSpace: 'nowrap' }}>
              {t('الإجمالي + التوصيل (')}{subtotal >= 200 ? t('مجاني 🎉') : `${delivery} ${t('ر.س')}`})
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 15, fontWeight: 700, color: color.navy, whiteSpace: 'nowrap' }}>
              {grand} {t('ر.س')}
            </span>
          </div>
        </Card>

        <Card
          pad="13px 16px"
          style={{ borderRadius: radius.inner, marginTop: 10, display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t('التوصيل إلى')}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: color.slate }}>{t(UNIT)}</span>
        </Card>

        <input
          value={st.foodNotes}
          onChange={(e) => set({ foodNotes: e.target.value })}
          placeholder={t('ملاحظات التوصيل (اختياري)')}
          style={{
            width: '100%',
            marginTop: 10,
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 12.5,
            color: color.navy,
            boxShadow: shadow.card,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />

        <Card
          pad="13px 16px"
          style={{ borderRadius: radius.inner, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Icon path={icons.pay} size={17} width={1.6} />
          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy }}>
            {t('بطاقة بنكية •••• 4821')}
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: color.gold }}>{t('تغيير')}</span>
        </Card>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            background: 'rgba(199,154,60,0.08)',
            borderRadius: radius.tile,
            padding: '11px 14px',
          }}
        >
          <Icon path="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z" size={14} stroke={color.goldDeep} width={1.6} />
          <span style={{ fontSize: 11, fontWeight: 700, color: color.goldDeep, lineHeight: 1.7 }}>
            {t('المبلغ محجوز حتى تأكيد الاستلام — نفس ضمان رفادة في كل الخدمات')}
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          size="lg"
          full
          onClick={() => {
            set({ orderStage: 0, screen: 'foodTrack' });
            showToast('تم تأكيد طلبك #2841 — المبلغ محجوز حتى الاستلام');
          }}
        >
          {t('تأكيد الطلب —')} {grand} {t('ر.س')}
        </PillButton>
      </div>
    </div>
  );
}

/** R49 — Order tracking. */
function Track() {
  const { st, set, go, showToast } = useResident();
  const { store, grand } = useCartTotals();
  const stage = st.orderStage;
  const notDone = stage < orderStepDefs.length - 1;
  const courierVisible = stage === 2;

  const advance = () => {
    const next = Math.min(stage + 1, orderStepDefs.length - 1);
    set({ orderStage: next });
    if (next === orderStepDefs.length - 1) {
      showToast('وصل طلبك ✓ — تم تحويل المبلغ للمتجر بعد خصم العمولة');
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('تتبع الطلب')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div
          style={{
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: 22,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
            {stage >= orderStepDefs.length - 1 ? t('اكتمل الطلب') : t('الوصول المتوقع خلال')}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginTop: 2 }}>
            {t(trackEtas[Math.max(0, stage)])}
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
            {orderStepDefs.map((_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 99,
                  background: i <= stage ? color.gold : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <span
              style={{
                background: stage >= orderStepDefs.length - 1 ? color.green : color.gold,
                color: '#fff',
                borderRadius: radius.pill,
                padding: '4px 15px',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {t(orderStepDefs[Math.max(0, stage)])}
            </span>
          </div>
        </div>

        {courierVisible && (
          <Card
            pad="14px 16px"
            style={{ borderRadius: 18, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <Avatar name={t('مشعل الرشيدي')} size={44} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>
                {t('مشعل الرشيدي — مندوب التوصيل')}
              </span>
              <span style={{ fontSize: 10.5, color: color.slate }}>★ 4.9 · دراجة نارية</span>
            </span>
            <button
              aria-label="اتصال"
              style={{
                width: 36,
                height: 36,
                borderRadius: 99,
                border: 'none',
                background: 'rgba(63,166,107,0.13)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.contacts} size={16} stroke={color.greenDeep} width={1.7} />
            </button>
            <button
              onClick={() => go('chat')}
              aria-label="محادثة"
              style={{
                width: 36,
                height: 36,
                borderRadius: 99,
                border: 'none',
                background: color.tile,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.chat} size={16} width={1.6} />
            </button>
          </Card>
        )}

        <Card
          pad="14px 16px"
          style={{ borderRadius: 18, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.tile,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={storeIcon(store.kind)} size={20} width={1.5} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(store.name)}</span>
            <span style={{ fontSize: 10.5, color: color.slate }}>
              {t('طلب #2841 ·')} {grand} {t('ر.س · الدفع محجوز بضمان رفادة')}
            </span>
          </span>
        </Card>

        {notDone ? (
          <PillButton full onClick={advance} style={{ marginTop: 12, padding: 13, fontSize: 13.5 }}>
            {t(orderStepDefs[stage + 1])} {t('(محاكاة)')}
          </PillButton>
        ) : (
          <div
            style={{
              background: 'rgba(63,166,107,0.12)',
              borderRadius: 18,
              padding: 16,
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 900, color: color.greenDeep }}>
              {t('وصل طلبك ✓ — تم تحويل المبلغ للمتجر')}
            </div>
            <PillButton
              tone="green"
              size="sm"
              onClick={() => go('home')}
              style={{ marginTop: 10, padding: '10px 26px', fontSize: 12.5 }}
            >
              {t('العودة للرئيسية')}
            </PillButton>
          </div>
        )}
      </div>
    </div>
  );
}

/** R50 — Past orders with one-tap reorder. */
function History() {
  const { set, back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('طلباتي السابقة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {pastOrderDefs.map((o) => (
          <Card key={o.store + o.date} pad="15px 16px" style={{ borderRadius: 18, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: color.tile,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={storeIcon(storeDefs[o.storeIdx].kind)} size={18} width={1.5} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(o.store)}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: color.slate,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t(o.items)} · {t(o.date)}
                </span>
              </span>
              <span style={{ ...numeric, fontSize: 12.5, fontWeight: 700, color: color.navy, whiteSpace: 'nowrap' }}>
                {o.total} {t('ر.س')}
              </span>
            </div>
            <button
              onClick={() => {
                set({ selStoreIdx: o.storeIdx, cart: { ...o.cart }, screen: 'foodCart' });
                showToast('تم تجهيز سلتك بنفس الطلب السابق');
              }}
              style={{
                width: '100%',
                marginTop: 12,
                cursor: 'pointer',
                background: 'rgba(199,154,60,0.1)',
                color: color.goldDeep,
                border: '1.5px solid rgba(199,154,60,0.4)',
                borderRadius: radius.pill,
                padding: 9,
                fontSize: 11.5,
                fontWeight: 800,
                fontFamily: font.sans,
              }}
            >
              {t('🔄 اطلب نفس الطلب مرة أخرى')}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const Shop = { Browse, Menu, Cart, Track, History };
