import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import {
  attendeeFaces,
  clubDefs,
  evFilterDefs,
  evIcons,
  evKindDefs,
  evPlaceDefs,
  evTagMeta,
  eventDefs,
  gcFreqDefs,
  gcKindDefs,
  groupAbouts,
  groupIcon,
  groupMemberDefs,
  groupNextDefs,
  groupOrganizers,
  groupPostDefs,
  memberAvatars,
  pastEventDefs,
  DM_AUTO_REPLY,
  DM_REPLY_DELAY,
} from '../data/events';
import { icons } from '../data/icons';
import { avatarBg, ME_UNIT, UNIT } from '../data/seed';
import { useResident } from '../store';
import type { Group } from '../types';
import { ChipRow, Note, Stars } from './parts';
import { t } from '@/i18n/lang';

const HERO_IMG = `${import.meta.env.BASE_URL}img/hero-compound.webp`;

/** Seats taken, counting the user's own RSVP. */
function seatState(idx: number, going: boolean) {
  const e = eventDefs[idx];
  const taken = e.taken + (going ? 1 : 0);
  const pct = Math.min(100, Math.round((taken / e.seats) * 100));
  const full = taken >= e.seats;
  return {
    taken,
    pct,
    full,
    label: full ? t('مكتملة') : `${e.seats - taken} ${t('مكان متاح')}`,
    fillC: full ? color.coral : pct > 75 ? color.gold : color.green,
  };
}

/** R70 — Events & community, three tabs. */
function Feed() {
  const { st, set, go, cfg, showToast } = useResident();

  const allGroups: Group[] = [
    ...clubDefs.map((c) => ({
      ...c,
      about: '',
      organizer: t('ساكن'),
    })),
    ...st.myGroups,
  ];

  const filtered = eventDefs
    .map((e, i) => ({ ...e, i }))
    .filter((e) =>
      st.evFilter === 'all'
        ? true
        : st.evFilter === 'free'
          ? e.price === 0
          : e.kind === st.evFilter,
    );

  const hero = eventDefs[0];
  const heroGoing = !!st.evRsvp[0];
  const heroSeats = seatState(0, heroGoing);

  const isGroupsTab = st.evTab === 'groups';
  const isMineTab = st.evTab === 'mine';
  /** The groups you organise or have joined — the clubs half of «سجل». */
  const myClubs = allGroups
    .map((c, i) => ({ ...c, i }))
    .filter((c) => c.mine || st.clubJoined[c.i]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      {/* «فعالياتي» is no longer a tab — it is a history icon in the header,
          and opening it turns the screen into a log of whichever of the two
          you were looking at. The back arrow returns you to that tab. */}
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton
          onClick={() =>
            isMineTab ? set({ evTab: st.evMineKind === 'clubs' ? 'groups' : 'up' }) : go('home')
          }
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: color.navy }}>
            {isMineTab
              ? st.evMineKind === 'clubs'
                ? t('سجل مجموعاتك')
                : t('سجل فعالياتك')
              : t('الفعاليات والمجتمع')}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t('ما يحدث في')} {t(cfg.compoundName)}
          </span>
        </div>
        {!isMineTab && (
          <>
            <HeaderIcon
              label={st.evTab === 'groups' ? t('سجل مجموعاتك') : t('سجل فعالياتك')}
              path={icons.clock}
              onClick={() =>
                set({ evTab: 'mine', evMineKind: isGroupsTab ? 'clubs' : 'events' })
              }
            />
            <HeaderIcon
              label={isGroupsTab ? t('أنشئ مجموعة') : t('نظّم فعالية')}
              path={icons.plus}
              tone="gold"
              onClick={() => go(isGroupsTab ? 'groupCreate' : 'eventCreate')}
            />
          </>
        )}
      </div>

      {!isMineTab && (
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            margin: '6px 18px 0',
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {[
            { k: 'up' as const, l: 'الفعاليات' },
            { k: 'groups' as const, l: 'المجموعات' },
          ].map((item) => {
            const on = st.evTab === item.k;
            return (
              <button
                key={item.k}
                onClick={() => set({ evTab: item.k })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {t(item.l)}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 40px' }}>
        {st.evTab === 'up' && (
          <>
            {/* hero — the next event, over the compound photo */}
            <button
              onClick={() => go('eventDetail', { evSelIdx: 0 })}
              style={{
                display: 'block',
                width: '100%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'start',
                position: 'relative',
                borderRadius: 22,
                overflow: 'hidden',
                marginBottom: 12,
                boxShadow: '0 10px 26px rgba(31,59,87,0.22)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${HERO_IMG})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(200deg,rgba(31,59,87,0.35) 0%,rgba(31,59,87,0.88) 62%,#1F3B57 100%)',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '74px 18px 16px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: color.gold,
                      color: '#fff',
                      borderRadius: radius.pill,
                      padding: '3px 12px',
                      fontSize: 9.5,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('بعد 3 أيام')}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.75)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {hero.day} {t(hero.month)} · {t(hero.time)}
                  </span>
                </span>
                <span style={{ fontSize: 19, fontWeight: 900, color: '#fff', marginTop: 9, lineHeight: 1.4 }}>
                  {t(hero.title)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.65)',
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t(hero.place)} · {t(hero.host)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14 }}>
                  <span style={{ display: 'flex' }}>
                    {attendeeFaces.map((f) => (
                      <span
                        key={f.i}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 99,
                          background: f.bg,
                          border: `2px solid ${color.navy}`,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9.5,
                          fontWeight: 800,
                          marginLeft: -8,
                        }}
                      >
                        {t(f.i)}
                      </span>
                    ))}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {heroSeats.taken} {t('من جيرانك ذاهبون')}
                  </span>
                  <span
                    style={{
                      background: heroGoing ? color.green : color.gold,
                      color: '#fff',
                      borderRadius: radius.pill,
                      padding: '9px 20px',
                      fontSize: 11.5,
                      fontWeight: 800,
                      flex: 'none',
                    }}
                  >
                    {heroGoing ? t('أنت مسجّل ✓') : t('احجز مكانك')}
                  </span>
                </span>
              </span>
            </button>

            <div style={{ margin: '0 -18px 12px', padding: '0 18px' }}>
              <ChipRow chips={evFilterDefs} value={st.evFilter} onPick={(k) => set({ evFilter: k })} />
            </div>

            {/* The hero event isn't repeated in the list below it. */}
            {filtered
              .filter((e) => e.i !== 0)
              .map((e) => {
                const going = !!st.evRsvp[e.i];
                const seats = seatState(e.i, going);
                const tm = evTagMeta[e.kind];
                return (
                  <button
                    key={t(e.title)}
                    onClick={() => go('eventDetail', { evSelIdx: e.i })}
                    style={{
                      width: '100%',
                      textAlign: 'start',
                      background: '#fff',
                      border: 'none',
                      borderRadius: radius.card,
                      padding: 0,
                      overflow: 'hidden',
                      boxShadow: shadow.card,
                      marginBottom: 12,
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'stretch' }}>
                      <span
                        style={{
                          width: 66,
                          background: going ? 'rgba(63,166,107,0.14)' : color.tile,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                          padding: '14px 0',
                        }}
                      >
                        <span
                          style={{
                            ...numeric,
                            fontSize: 22,
                            fontWeight: 700,
                            color: going ? color.greenDeep : color.navy,
                          }}
                        >
                          {t(e.day)}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: going ? color.greenDeep : color.navy,
                          }}
                        >
                          {t(e.month)}
                        </span>
                      </span>
                      <span
                        style={{
                          flex: 1,
                          padding: '13px 15px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          minWidth: 0,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <StatusPill bg={tm.bg} c={tm.c} style={{ fontSize: 9, padding: '2px 10px', fontWeight: 800 }}>
                            {t(tm.label)}
                          </StatusPill>
                          <span style={{ fontSize: 9.5, color: color.slateLight, whiteSpace: 'nowrap' }}>
                            {t(e.time)}
                          </span>
                        </span>
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
                          {t(e.title)}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            color: color.slate,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {t(e.place)} · {t(e.host)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                          <span
                            style={{
                              flex: 1,
                              height: 5,
                              borderRadius: 99,
                              background: color.tileAlt,
                              overflow: 'hidden',
                              display: 'block',
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                height: '100%',
                                width: `${seats.pct}%`,
                                background: seats.fillC,
                                borderRadius: 99,
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 800,
                              color: seats.fillC,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t(seats.label)}
                          </span>
                          <span
                            style={{
                              ...numeric,
                              fontSize: 11.5,
                              fontWeight: 700,
                              color: color.goldDeep,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {e.price === 0 ? t('مجانًا') : `${e.price} ${t('ر.س')}`}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
          </>
        )}

        {/* The log splits by what you opened it from: your events, or
            the groups you belong to. */}
        {isMineTab && st.evMineKind === 'clubs' && (
          <>
            {myClubs.map((c) => (
              <Card
                key={t(c.name)}
                pad="14px 16px"
                onClick={() => go('groupDetail', { gdIdx: c.i })}
                style={{ borderRadius: 18, marginBottom: 9 }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                    <Icon path={t(groupIcon[c.kind])} size={20} width={1.6} />
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>
                      {t(c.name)}
                    </span>
                    <span style={{ fontSize: 10.5, color: color.slate }}>
                      {c.members} {t('عضو ·')} {t(c.meets)}
                    </span>
                  </span>
                  <StatusPill
                    tone={c.mine ? 'gold' : 'green'}
                    style={{ fontSize: 9.5, padding: '3px 11px', fontWeight: 800, flex: 'none' }}
                  >
                    {c.mine ? t('منظّم المجموعة') : t('عضو ✓')}
                  </StatusPill>
                </span>
              </Card>
            ))}
            {myClubs.length === 0 && (
              <Note>{t('لم تنضم لأي مجموعة بعد — تصفّح المجموعات وانضم لما يناسبك.')}</Note>
            )}
          </>
        )}

        {isMineTab && st.evMineKind !== 'clubs' && (
          <>
            <div
              style={{
                background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                borderRadius: radius.card,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>{t('حضورك هذا الشهر')}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <MiniStat
                  value={String(Object.values(st.evRsvp).filter(Boolean).length)}
                  label={t('فعالية مسجّل بها')}
                />
                <MiniStat
                  value={String(Object.values(st.evRsvp).filter(Boolean).length * 50)}
                  label={t('نقطة مجتمع مكتسبة')}
                  tone={color.greenBright}
                />
              </div>
            </div>

            {eventDefs
              .map((e, i) => ({ ...e, i }))
              .filter((e) => st.evRsvp[e.i])
              .map((e) => (
                <Card
                  key={t(e.title)}
                  pad="14px 16px"
                  style={{ borderRadius: 18, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: color.tile,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <span style={{ ...numeric, fontSize: 15, fontWeight: 700, color: color.navy }}>
                      {t(e.day)}
                    </span>
                    <span style={{ fontSize: 8, fontWeight: 800, color: color.slate }}>{t(e.month)}</span>
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: color.navy,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t(e.title)}
                    </span>
                    <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                      {t(e.time)} · {t(e.place)}
                    </span>
                  </span>
                  <span
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: 'none' }}
                  >
                    <StatusPill tone="green" style={{ fontSize: 9, padding: '2px 10px', fontWeight: 800 }}>
                      {t('مؤكد ✓')}
                    </StatusPill>
                    <button
                      onClick={() => {
                        set((s) => ({ evRsvp: { ...s.evRsvp, [e.i]: false } }));
                        showToast(`${t('أُلغي تسجيلك في')} ${t(e.title)}`);
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: color.coral,
                        fontSize: 9.5,
                        fontWeight: 800,
                        padding: 0,
                        fontFamily: font.sans,
                      }}
                    >
                      {t('إلغاء')}
                    </button>
                  </span>
                </Card>
              ))}

            {Object.values(st.evRsvp).every((v) => !v) && (
              <Card
                pad="26px 20px"
                style={{
                  borderRadius: 18,
                  textAlign: 'center',
                  fontSize: 12,
                  color: color.slate,
                  lineHeight: 1.9,
                }}
              >
                {t('لم تسجّل في أي فعالية بعد — تصفّح «قادمة» واحجز مكانك.')}
              </Card>
            )}

            <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, margin: '18px 2px 8px' }}>
              {t('فعاليات حضرتها')}
            </div>
            {pastEventDefs.map((p, i) => {
              const rated = st.pastRating[i] ?? 0;
              return (
                <Card key={t(p.title)} pad="14px 16px" style={{ borderRadius: 18, marginBottom: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: color.tile,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      <Icon path={t(evIcons[p.kind])} size={19} width={1.6} />
                    </span>
                    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: color.navy,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t(p.title)}
                      </span>
                      <span style={{ fontSize: 10, color: color.slate, whiteSpace: 'nowrap' }}>
                        {t(p.when)} · {p.photos} صورة في الألبوم
                      </span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11 }}>
                    <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                      {rated ? `${t('تقييمك:')} ${rated} ${t('من 5')}` : t('قيّم الفعالية')}
                    </span>
                    <span style={{ flex: 1 }} />
                    <Stars
                      value={rated}
                      size={17}
                      onPick={(n) => {
                        set((s) => ({ pastRating: { ...s.pastRating, [i]: n } }));
                        showToast(t('شكرًا — وصل تقييمك لمنظّم الفعالية'));
                      }}
                    />
                    <button
                      onClick={() => showToast(`${t('ألبوم')} ${t(p.title)} — ${p.photos} ${t('صورة شاركها الحضور')}`)}
                      style={{
                        border: '1.5px solid rgba(31,59,87,0.2)',
                        background: 'transparent',
                        color: color.navy,
                        borderRadius: radius.pill,
                        padding: '5px 13px',
                        fontSize: 10,
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginRight: 6,
                        flex: 'none',
                        fontFamily: font.sans,
                      }}
                    >
                      {t('الألبوم')}
                    </button>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {isGroupsTab && (
          <>
            <div style={{ fontSize: 12, color: color.slate, margin: '0 2px 10px', lineHeight: 1.8 }}>
              {t('مجموعات اهتمام دائمة يديرها السكان — تلتقي بشكل دوري ولها محادثتها الخاصة.')}
            </div>
            {allGroups.map((c, i) => {
              const joined = !!st.clubJoined[i];
              const mine = !!c.mine;
              return (
                // A div, not a Card button: the row opens the group but holds
                // its own join button, and a button cannot nest.
                <div
                  key={t(c.name)}
                  onClick={() => go('groupDetail', { gdIdx: i })}
                  style={{
                    background: color.card,
                    boxShadow: shadow.card,
                    padding: '14px 16px',
                    borderRadius: 18,
                    marginBottom: 9,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: color.tile,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <Icon path={t(groupIcon[c.kind])} size={20} width={1.6} />
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: color.navy,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t(c.name)}
                    </span>
                    <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                      {c.members + (joined || mine ? 1 : 0)} {t('عضوًا ·')} {t(c.meets)}
                    </span>
                  </span>
                  <span
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: 'none' }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mine) return;
                        set((s) => ({ clubJoined: { ...s.clubJoined, [i]: !joined } }));
                        showToast(
                          joined
                            ? `${t('غادرت')} ${t(c.name)}`
                            : `${t('انضممت إلى')} ${t(c.name)} ${t('— ستصلك مواعيد اللقاءات')}`,
                        );
                      }}
                      style={{
                        border: `1.5px solid ${mine ? color.gold : joined ? color.green : 'rgba(31,59,87,0.2)'}`,
                        background: mine
                          ? 'rgba(199,154,60,0.14)'
                          : joined
                            ? 'rgba(63,166,107,0.12)'
                            : 'transparent',
                        color: mine ? color.goldDeep : joined ? color.greenDeep : color.navy,
                        borderRadius: radius.pill,
                        padding: '6px 15px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: font.sans,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mine ? t('منظّم') : joined ? t('عضو ✓') : t('انضم')}
                    </button>
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

/** R71 — Event detail; RSVP turns the card into a real QR entry pass. */
function Detail() {
  const { st, set, back, showToast } = useResident();
  const i = st.evSelIdx;
  const e = eventDefs[i] ?? eventDefs[0];
  const going = !!st.evRsvp[i];
  const seats = seatState(i, going);
  const tm = evTagMeta[e.kind];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تفاصيل الفعالية')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusPill bg={tm.bg} c={tm.c} style={{ fontSize: 10, padding: '3px 12px', fontWeight: 800 }}>
              {t(tm.label)}
            </StatusPill>
            <span style={{ fontSize: 10.5, color: color.slateLight, whiteSpace: 'nowrap' }}>
              {e.day} {t(e.month)} · {t(e.time)}
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: color.navy, marginTop: 10, lineHeight: 1.5 }}>
            {t(e.title)}
          </div>
          <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 8, lineHeight: 1.9 }}>
            {t(e.desc)}
          </div>
        </Card>

        <Card
          pad={16}
          style={{ borderRadius: 18, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <InfoRow icon={icons.pin} text={t(e.place)} />
          <InfoRow icon={icons.people} text={`${t('ينظّمها')} ${t(e.host)}`} />
          <InfoRow
            icon="M3 7h18v13H3zM3 11h18M8 3v4M16 3v4"
            text={`${t(seats.label)} · ${e.price === 0 ? t('مجانًا') : `${e.price} ${t('ر.س')}`}`}
          />
        </Card>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t('جيرانك المسجّلون')}</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            {attendeeFaces.map((at) => (
              <span
                key={at.i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 99,
                  background: at.bg,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  marginLeft: -8,
                  border: '2px solid #fff',
                }}
              >
                {t(at.i)}
              </span>
            ))}
            <span style={{ fontSize: 11, color: color.slate, marginRight: 14 }}>
              {/* The design prints the event's own figure here, so the line
                  stays put when you register; the seat counter above it is
                  what moves. */}
              و{e.taken} {t('من جيرانك مسجّلون')}
            </span>
          </div>
        </Card>

        {going ? (
          <div
            style={{
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              borderRadius: radius.card,
              padding: 18,
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span
              style={{
                width: 96,
                height: 96,
                background: '#fff',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                boxSizing: 'border-box',
                flex: 'none',
              }}
            >
              <Icon path={icons.qr} size={80} width={1.2} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 900, color: '#fff' }}>
                {t('تصريح دخولك للفعالية')}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                {t('اعرض الكود عند باب المرفق — بلا كشوف ورقية')}
              </span>
              <span
                dir="ltr"
                style={{ ...numeric, fontSize: 11, fontWeight: 700, color: color.goldSoft, textAlign: 'start' }}
              >
                EVT-2026-0{st.evSelIdx + 4}-214
              </span>
              <button
                onClick={() => showToast(t('أُضيفت الفعالية لتقويم جوالك'))}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  borderRadius: radius.pill,
                  padding: '6px 14px',
                  fontSize: 10,
                  fontWeight: 800,
                  alignSelf: 'flex-start',
                  marginTop: 2,
                  fontFamily: font.sans,
                }}
              >
                {t('أضف للتقويم')}
              </button>
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <Note tone="green">
              {t('تصريح دخولك للفعالية يصلك فورًا بعد التسجيل — بلا كشوف ورقية عند الباب')}
            </Note>
          </div>
        )}
      </div>

      <div style={{ padding: '0 20px 34px', display: 'flex', gap: 10 }}>
        <button
          onClick={() => showToast(t('نُسخ رابط الفعالية — شاركه مع جيرانك'))}
          aria-label="مشاركة"
          style={{
            width: 52,
            border: '1.5px solid rgba(31,59,87,0.2)',
            background: 'transparent',
            borderRadius: radius.pill,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon path="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3M8 7l4-4 4 4" size={18} width={1.7} />
        </button>
        <PillButton
          tone={going ? 'green' : 'navy'}
          size="lg"
          onClick={() => {
            const now = !going;
            set((s) => ({ evRsvp: { ...s.evRsvp, [i]: now } }));
            showToast(
              now ? t('تم حجز مكانك — تصريح الدخول في مستنداتك') : t('أُلغي تسجيلك في هذه الفعالية'),
            );
          }}
          style={{ flex: 1, fontSize: 14.5 }}
        >
          {going
            ? t('أنت مسجّل ✓ — إلغاء التسجيل')
            : seats.full
              ? t('قائمة الانتظار')
              : e.price === 0
                ? t('احجز مكانك — مجانًا')
                : `${t('احجز وادفع')} ${e.price} ${t('ر.س')}`}
        </PillButton>
      </div>
    </div>
  );
}

/** R72 — Propose an event; goes to the admin for approval. */
function Create() {
  const { st, set, back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('اقترح فعالية')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Label>{t('نوع الفعالية')}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {evKindDefs.map((k) => {
            const on = st.evKind === k.key;
            return (
              <KindTile
                key={k.key}
                label={t(k.label)}
                icon={t(evIcons[k.key])}
                on={on}
                onClick={() => set({ evKind: k.key })}
              />
            );
          })}
        </div>

        <input
          value={st.evTitle}
          onChange={(e) => set({ evTitle: e.target.value })}
          placeholder={t('اسم الفعالية — مثال: ماراثون صباحي لسكان الأندلس')}
          style={{ ...inputStyle, marginTop: 16, fontSize: 13 }}
        />
        <textarea
          value={st.evDesc}
          onChange={(e) => set({ evDesc: e.target.value })}
          rows={3}
          placeholder={t('وصف مختصر لما سيحدث')}
          style={{ ...inputStyle, marginTop: 8, fontSize: 12.5, resize: 'none', lineHeight: 1.7 }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={st.evWhen}
            onChange={(e) => set({ evWhen: e.target.value })}
            placeholder={t('اليوم والوقت')}
            style={{ ...inputStyle, marginTop: 0, flex: 1, fontSize: 12.5 }}
          />
          <input
            value={st.evSeats}
            onChange={(e) => set({ evSeats: e.target.value })}
            dir="ltr"
            placeholder={t('عدد الأماكن')}
            style={{ ...inputStyle, marginTop: 0, width: 120, flex: 'none', ...numeric, fontSize: 13 }}
          />
        </div>

        <Label style={{ marginTop: 16 }}>{t('المكان')}</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {evPlaceDefs.map((p) => (
            <Chip key={p} label={p} on={st.evPlace === p} onClick={() => set({ evPlace: p })} />
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Note tone="navy">
            {t('تُرسل فعاليتك لمكتب الإدارة للاعتماد وحجز المرفق — يصلك الرد خلال 24 ساعة، ثم تُنشر لكل السكان.')}
          </Note>
        </div>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => {
            set({ screen: 'feed', evTab: 'up', evTitle: '', evDesc: '', evWhen: '', evSeats: '' });
            showToast(t('أُرسلت فعاليتك لمكتب الإدارة — يصلك الرد خلال 24 ساعة'));
          }}
        >
          {t('أرسل للاعتماد')}
        </PillButton>
      </div>
    </div>
  );
}

/** R73 — Group detail: board, next meet-up, and the organizer's controls. */
function GroupDetail() {
  const { st, set, back, go, showToast } = useResident();
  const allGroups: Group[] = [
    ...clubDefs.map((c) => ({ ...c, about: '', organizer: 'ساكن' })),
    ...st.myGroups,
  ];
  const i = st.gdIdx;
  const g = allGroups[i] ?? allGroups[0];
  const isMine = !!g.mine;
  const about = g.about || groupAbouts[i] || t('مجموعة يديرها سكان الكمبوند.');
  const next = groupNextDefs[i] ?? { when: st.gdMeetWhen || '—', place: st.gdMeetPlace || '—' };
  const posts = [...(groupPostDefs[i] ?? []), ...(st.gdExtraPosts[i] ?? [])];
  const joinedMeet = !!st.gdMeetJoined[i];

  // A group is now a room you have to be let into: the board, the meeting
  // and the composer are all behind membership, and joining goes through the
  // organiser rather than toggling instantly.
  const isMember = isMine || !!st.clubJoined[i];
  const isPending = !isMine && !isMember && !!st.clubPending[i];
  const organizer = isMine ? t('أنت') : groupOrganizers[i] ?? groupOrganizers[0];
  const roster = groupMembers(isMine, isMember);

  const send = () => {
    const body = st.gdDraft.trim();
    if (!body) {
      showToast(t('اكتب رسالتك أولًا'));
      return;
    }
    set((s) => ({
      gdExtraPosts: {
        ...s.gdExtraPosts,
        [i]: [...(s.gdExtraPosts[i] ?? []), { who: t('عبدالله العتيبي'), text: body, time: t('الآن') }],
      },
      gdDraft: '',
    }));
    showToast(t('نُشرت رسالتك لأعضاء المجموعة'));
  };

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
          <Icon path={t(groupIcon[g.kind])} size={20} width={1.6} />
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
            {t(g.name)}
          </span>
          <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
            {g.members + (st.clubJoined[st.gdIdx] ? 1 : 0)} {t('عضوًا ·')} {t(g.meets)}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: 18, fontSize: 12.5, color: color.slateDark, lineHeight: 1.9 }}>
          {t(about)}
        </Card>

        {/* The organiser, and — for a stranger — the way in. */}
        <Card
          pad="14px 16px"
          style={{ borderRadius: 18, marginTop: 10, display: 'flex', alignItems: 'center', gap: 11 }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 99,
              background: avatarBg.tarek,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              flex: 'none',
            }}
          >
            {t(organizer)[0]}
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(organizer)}</span>
            <span style={{ fontSize: 10.5, color: color.slate }}>{t('منظّم المجموعة')}</span>
          </span>
          {!isMember &&
            (isPending ? (
              <StatusPill tone="gold" style={{ fontSize: 9.5, padding: '4px 12px', fontWeight: 800 }}>
                {t('طلبك قيد موافقة المنظّم')}
              </StatusPill>
            ) : (
              <PillButton
                onClick={() => {
                  set((s) => ({ clubPending: { ...s.clubPending, [i]: true } }));
                  showToast(t('أُرسل طلب الانضمام للمنظّم مع نبذة من ملفك'));
                }}
                style={{ padding: '8px 16px', fontSize: 11.5, flex: 'none' }}
              >
                {t('اطلب الانضمام')}
              </PillButton>
            ))}
        </Card>

        {/* Not a member and not waiting: the board stays shut. */}
        {!isMember && !isPending && (
          <Card
            pad="30px 22px"
            style={{
              borderRadius: 18,
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Icon path="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" size={30} stroke={color.slateLight} width={1.6} />
            <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy, marginTop: 14 }}>
              {t('انضم لترى لوحة المجموعة')}
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 8, lineHeight: 1.9 }}>
              {t('محادثات الأعضاء واللقاءات تظهر لأعضاء المجموعة فقط — مثل واتساب، سترى الرسائل الجديدة بعد انضمامك.')}
            </div>
          </Card>
        )}

        {/* Waiting: show what the organiser was sent about you. */}
        {isPending && (
          <Card
            pad="24px 20px"
            style={{ borderRadius: 18, marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <Icon path={icons.clock} size={30} stroke={color.gold} width={1.6} />
            <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy, marginTop: 14 }}>
              {t('أُرسل طلبك للمنظّم')}
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 8, lineHeight: 1.9 }}>
              {t('وصل طلبك مع نبذة من ملفك — يفتح لك كل شيء فور موافقته.')}
            </div>
            <div
              style={{
                width: '100%',
                background: color.bg,
                borderRadius: radius.tile,
                padding: 14,
                marginTop: 16,
                textAlign: 'start',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: color.slateLight }}>
                {t('النبذة التي وصلت للمنظّم')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 99,
                    background: avatarBg.me,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12.5,
                    fontWeight: 800,
                    flex: 'none',
                  }}
                >
                  {t('عبدالله المطيري')[0]}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: color.navy }}>
                    {t('عبدالله المطيري')}
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate }}>{t(UNIT)}</span>
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: color.goldDeep, fontWeight: 800, marginTop: 10 }}>
                {t('نقاط الثقة: 850 · مستوى ذهبي')}
              </div>
              <div style={{ fontSize: 10.5, color: color.slate, marginTop: 3 }}>
                {t('ساكن منذ 2024 · سداد منتظم')}
              </div>
            </div>
            <PillButton
              tone="gold"
              full
              onClick={() => {
                set((s) => ({
                  clubJoined: { ...s.clubJoined, [i]: true },
                  clubPending: { ...s.clubPending, [i]: false },
                }));
                showToast(t('وافق المنظّم على انضمامك — أهلًا بك في المجموعة 🎉'));
              }}
              style={{ marginTop: 14, padding: 12, fontSize: 12.5 }}
            >
              {t('وافق المنظّم (محاكاة)')}
            </PillButton>
          </Card>
        )}

        {isMember && (
          <>
            {!isMine && (
              <Card pad={16} style={{ borderRadius: 18, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                    {t('اللقاء القادم')}
                  </span>
                  <span style={{ flex: 1 }} />
                  <StatusPill tone="gold" style={{ fontSize: 9.5, padding: '3px 11px', fontWeight: 800 }}>
                    {t(next.when)}
                  </StatusPill>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: color.slateDark,
                    marginTop: 9,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t(next.place)}
                </div>
                <PillButton
                  tone={joinedMeet ? 'green' : 'navy'}
                  full
                  onClick={() => {
                    set((s) => ({ gdMeetJoined: { ...s.gdMeetJoined, [i]: !joinedMeet } }));
                    showToast(joinedMeet ? t('ألغيت حضورك') : t('سجّلنا حضورك — يصلك تذكير قبل اللقاء'));
                  }}
                  style={{ marginTop: 12, padding: 12, fontSize: 13 }}
                >
                  {joinedMeet ? t('سأحضر ✓') : t('سأحضر اللقاء القادم')}
                </PillButton>
              </Card>
            )}

            <Card
              pad="13px 16px"
              onClick={() => go('groupMembers')}
              style={{ borderRadius: 18, marginTop: 10 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ display: 'flex', flex: 'none' }}>
                  {roster.slice(0, 3).map((m, k) => (
                    <span
                      key={m.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 99,
                        background: memberAvatars[k % memberAvatars.length],
                        border: '2px solid #fff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 800,
                        marginInlineStart: k === 0 ? 0 : -9,
                      }}
                    >
                      {t(m.name)[0]}
                    </span>
                  ))}
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                    {t('أعضاء المجموعة')}
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate }}>
                    {g.members + (st.clubJoined[i] ? 1 : 0)} {t('عضوًا')}
                  </span>
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: color.gold, flex: 'none' }}>
                  {t('عرض الكل')} ←
                </span>
              </span>
            </Card>

            <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, margin: '16px 2px 8px' }}>
              {t('لوحة المجموعة')}
            </div>
          </>
        )}
        {isMember && posts.map((gp, k) => (
          <Card key={`${t(gp.who)}-${k}`} pad="14px 16px" style={{ borderRadius: 18, marginBottom: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  background: 'bg' in gp ? gp.bg : avatarBg.me,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  flex: 'none',
                }}
              >
                {gp.who[0]}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: color.navy, whiteSpace: 'nowrap' }}>
                {t(gp.who)}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 9.5, color: color.slateLight, whiteSpace: 'nowrap' }}>
                {'when' in gp ? gp.when : t(gp.time)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: color.slateDark, marginTop: 8, lineHeight: 1.9 }}>
              {t(gp.text)}
            </div>
          </Card>
        ))}

        {isMine && (
          <div
            style={{
              background: 'rgba(199,154,60,0.08)',
              border: '1.5px solid rgba(199,154,60,0.35)',
              borderRadius: 18,
              padding: '15px 16px',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'rgba(199,154,60,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={icons.megaphone} size={16} stroke={color.goldDeep} width={1.6} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                  {t('أدوات المنظّم')}
                </span>
                <span style={{ fontSize: 10, color: color.goldDeep, fontWeight: 700 }}>
                  {t('أعلن لقاءً جديدًا — يصل إشعار لكل الأعضاء')}
                </span>
              </span>
            </div>
            <input
              value={st.gdMeetWhen}
              onChange={(e) => set({ gdMeetWhen: e.target.value })}
              placeholder={t('الموعد — مثال: السبت 6 ص')}
              style={{ ...plainInput, marginTop: 10 }}
            />
            <input
              value={st.gdMeetPlace}
              onChange={(e) => set({ gdMeetPlace: e.target.value })}
              placeholder={t('المكان')}
              style={{ ...plainInput, marginTop: 7 }}
            />
            <PillButton
              tone="gold"
              full
              onClick={() => {
                set((s) => ({
                  gdExtraPosts: {
                    ...s.gdExtraPosts,
                    [i]: [
                      ...(s.gdExtraPosts[i] ?? []),
                      {
                        who: t('عبدالله العتيبي'),
                        text: `${t('اللقاء القادم:')} ${s.gdMeetWhen || t('قريبًا')} — ${s.gdMeetPlace || t('يُحدد لاحقًا')}`,
                        time: t('الآن'),
                      },
                    ],
                  },
                }));
                showToast(t('أُعلن اللقاء ووصل إشعار لكل الأعضاء'));
              }}
              style={{ marginTop: 9, padding: 11, fontSize: 12 }}
            >
              {t('أعلن اللقاء')}
            </PillButton>
          </div>
        )}

        {/* The composer, like the board, is members-only. */}
        {isMember && (
        <div
          style={{
            background: '#fff',
            borderRadius: radius.pill,
            padding: '11px 16px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginTop: 4,
          }}
        >
          <input
            value={st.gdDraft}
            onChange={(e) => set({ gdDraft: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t('اكتب لأعضاء المجموعة…')}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 12.5,
              color: color.navy,
              outline: 'none',
              fontFamily: font.sans,
              minWidth: 0,
            }}
          />
          <button
            onClick={send}
            aria-label="إرسال"
            style={{
              width: 34,
              height: 34,
              borderRadius: 99,
              border: 'none',
              background: color.navy,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path="M21 3L3 10l7 3 3 7z" size={15} stroke="#fff" width={1.7} />
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

/**
 * The roster for a group. You sit first when you organise it, second once
 * you join, and are absent while you are only looking in.
 */
function groupMembers(isMine: boolean, isMember: boolean) {
  const others = groupMemberDefs;
  const me = { name: ME_UNIT, org: isMine, me: true };
  if (isMine) return [me, ...others.slice(1)];
  if (isMember) return [others[0], me, ...others.slice(1, 4)];
  return others.map((o) => ({ ...o, me: false }));
}

/** R73b — the full member list, each row a way into a private chat. */
function GroupMembers() {
  const { st, back, go } = useResident();
  const allGroups: Group[] = [
    ...clubDefs.map((c) => ({ ...c, about: '', organizer: 'ساكن' })),
    ...st.myGroups,
  ];
  const g = allGroups[st.gdIdx] ?? allGroups[0];
  const isMine = !!g.mine;
  const roster = groupMembers(isMine, isMine || !!st.clubJoined[st.gdIdx]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: color.navy }}>
            {t('أعضاء المجموعة')}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t(g.name)} · {g.members + (st.clubJoined[st.gdIdx] ? 1 : 0)} {t('عضوًا')}
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {roster.map((m, k) => (
          <Card
            key={m.name}
            pad="13px 15px"
            style={{ borderRadius: 18, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 11 }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                background: memberAvatars[k % memberAvatars.length],
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                flex: 'none',
              }}
            >
              {t(m.name)[0]}
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(m.name)}</span>
              <span style={{ fontSize: 10.5, color: color.slate }}>
                {m.org ? t('المنظّم') : 'me' in m && m.me ? t('أنت') : t('عضو')}
              </span>
            </span>
            {!('me' in m && m.me) && (
              <PillButton
                tone="ghost"
                onClick={() =>
                  go('dmChat', { dmWith: m.name, dmAv: memberAvatars[k % memberAvatars.length] })
                }
                style={{ padding: '7px 15px', fontSize: 11, flex: 'none' }}
              >
                {t('رسالة')}
              </PillButton>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * R73c — a private thread between two neighbours. Unlike the group board,
 * nothing here is visible to anyone else; the other side replies after a beat.
 */
function DmChat() {
  const { st, set, back, showToast } = useResident();
  const who = st.dmWith ?? '';
  const thread = st.dmThreads[who] ?? [];
  const allGroups: Group[] = [
    ...clubDefs.map((c) => ({ ...c, about: '', organizer: 'ساكن' })),
    ...st.myGroups,
  ];
  const g = allGroups[st.gdIdx] ?? allGroups[0];

  const send = () => {
    const body = st.dmDraft.trim();
    if (!body) {
      showToast(t('اكتب رسالتك أولًا'));
      return;
    }
    set((s) => ({
      dmThreads: {
        ...s.dmThreads,
        [who]: [...(s.dmThreads[who] ?? []), { me: true, text: body, time: t('الآن') }],
      },
      dmDraft: '',
    }));
    window.setTimeout(
      () =>
        set((s) => ({
          dmThreads: {
            ...s.dmThreads,
            [who]: [...(s.dmThreads[who] ?? []), { me: false, text: t(DM_AUTO_REPLY), time: t('الآن') }],
          },
        })),
      DM_REPLY_DELAY,
    );
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 18px 8px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <BackButton onClick={back} />
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            background: st.dmAv ?? avatarBg.tarek,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13.5,
            fontWeight: 800,
            flex: 'none',
          }}
        >
          {t(who)[0] ?? '؟'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 14.5, fontWeight: 900, color: color.navy }}>{t(who)}</span>
          <span
            style={{
              fontSize: 10,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t('محادثة خاصة · عضو في')} {t(g.name)}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 16px' }}>
        {thread.length === 0 && (
          <div
            style={{
              fontSize: 11.5,
              color: color.slateLight,
              textAlign: 'center',
              lineHeight: 1.9,
              padding: '40px 20px',
            }}
          >
            {t('ابدأ محادثة خاصة مع')} {t(who.split(' — ')[0])} {t('— الرسائل بينكما فقط ولا يراها أحد.')}
          </div>
        )}
        {thread.map((m, k) => (
          <div
            key={k}
            style={{ display: 'flex', justifyContent: m.me ? 'flex-start' : 'flex-end', marginBottom: 9 }}
          >
            <div
              style={{
                maxWidth: '78%',
                background: m.me ? color.navy : '#fff',
                color: m.me ? '#fff' : color.navy,
                borderRadius: m.me ? '16px 16px 16px 5px' : '16px 16px 5px 16px',
                padding: '10px 14px',
                boxShadow: m.me ? 'none' : shadow.card,
              }}
            >
              <div style={{ fontSize: 12.5, lineHeight: 1.8 }}>{m.text}</div>
              <div
                style={{
                  fontSize: 9,
                  marginTop: 4,
                  color: m.me ? 'rgba(255,255,255,0.55)' : color.slateLight,
                }}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px 30px' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: radius.pill,
            padding: '11px 16px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <input
            value={st.dmDraft}
            onChange={(e) => set({ dmDraft: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t('اكتب رسالتك…')}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 12.5,
              color: color.navy,
              outline: 'none',
              fontFamily: font.sans,
              minWidth: 0,
            }}
          />
          <button
            onClick={send}
            aria-label={t('إرسال')}
            style={{
              width: 34,
              height: 34,
              borderRadius: 99,
              border: 'none',
              background: color.navy,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path="M21 3L3 10l7 3 3 7z" size={15} stroke="#fff" width={1.7} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** R74 — Create a group; you become its organizer immediately. */
function GroupCreate() {
  const { st, set, back, showToast, cfg } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('أنشئ مجموعة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Label>{t('نوع المجموعة')}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {gcKindDefs.map((k) => (
            <KindTile
              key={k.key}
              label={t(k.label)}
              icon={t(groupIcon[k.key])}
              on={st.gcKind === k.key}
              onClick={() => set({ gcKind: k.key })}
            />
          ))}
        </div>

        <input
          value={st.gcName}
          onChange={(e) => set({ gcName: e.target.value })}
          placeholder={t('اسم المجموعة — مثال: نادي دراجات الأندلس')}
          style={{ ...inputStyle, marginTop: 16, fontSize: 13 }}
        />
        <textarea
          value={st.gcAbout}
          onChange={(e) => set({ gcAbout: e.target.value })}
          rows={3}
          placeholder={t('نبذة عن المجموعة وما تفعلونه معًا')}
          style={{ ...inputStyle, marginTop: 8, fontSize: 12.5, resize: 'none', lineHeight: 1.7 }}
        />

        <Label style={{ marginTop: 16 }}>{t('دورية اللقاء')}</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          {gcFreqDefs.map((f) => (
            <Chip
              key={f}
              label={f}
              on={st.gcFreq === f}
              onClick={() => set({ gcFreq: f })}
              style={{ flex: 1, borderRadius: radius.tile, padding: '11px 4px' }}
            />
          ))}
        </div>

        {/* The «من يمكنه الانضمام» chips are gone: every group is open now,
            and the organiser approves each request from the group screen. */}

        <div style={{ marginTop: 14 }}>
          <Note tone="navy">
            {t('تُنشأ المجموعة فورًا وتصبح أنت منظّمها — تنشر اللقاءات وتُشعر الأعضاء بنفسك. حجز المرافق فقط يحتاج اعتماد الإدارة.')}
          </Note>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => {
            const name = st.gcName.trim() || t('مجموعة جديدة');
            set((s) => ({
              myGroups: [
                ...s.myGroups,
                {
                  kind: s.gcKind,
                  name,
                  members: 1,
                  meets: s.gcFreq,
                  mine: true,
                  organizer: t('عبدالله العتيبي'),
                  about: s.gcAbout.trim() || `${t('مجموعة أنشأها ساكن في')} ${t(cfg.compoundName)}.`,
                },
              ],
              screen: 'feed',
              evTab: 'groups',
              gcName: '',
              gcAbout: '',
            }));
            showToast(`${t('أُنشئت «')}${name}${t('» — أنت منظّمها، انشر أول لقاء')}`);
          }}
        >
          {t('أنشئ المجموعة')}
        </PillButton>
      </div>
    </div>
  );
}

/** A round icon button in the feed header. */
function HeaderIcon({
  label,
  path,
  tone = 'plain',
  onClick,
}: {
  label: string;
  path: string;
  tone?: 'plain' | 'gold';
  onClick: () => void;
}) {
  const gold = tone === 'gold';
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        width: 38,
        height: 38,
        borderRadius: 99,
        border: 'none',
        cursor: 'pointer',
        background: gold ? color.gold : '#fff',
        boxShadow: gold ? '0 4px 14px rgba(199,154,60,0.35)' : shadow.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon path={path} size={gold ? 15 : 17} stroke={gold ? '#fff' : color.navy} width={gold ? 2.4 : 1.6} />
    </button>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon path={icon} size={16} stroke={color.gold} width={1.6} style={{ flex: 'none' }} />
      <span
        style={{
          fontSize: 12,
          color: color.slateDark,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        }}
      >
        {t(text)}
      </span>
    </div>
  );
}

function KindTile({
  label,
  icon,
  on,
  onClick,
}: {
  label: string;
  icon: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: radius.inner,
        padding: '12px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        background: on ? 'rgba(199,154,60,0.14)' : '#fff',
        border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <Icon path={icon} size={20} stroke={on ? color.goldDeep : color.navy} width={1.6} />
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 800,
          color: on ? color.goldDeep : color.navy,
          textAlign: 'center',
          fontFamily: font.sans,
        }}
      >
        {t(label)}
      </span>
    </button>
  );
}

function Chip({
  label,
  on,
  onClick,
  style,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: radius.pill,
        padding: '8px 15px',
        fontSize: 11.5,
        fontWeight: 800,
        cursor: 'pointer',
        background: on ? color.navy : '#fff',
        color: on ? '#fff' : color.slate,
        border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
        fontFamily: font.sans,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {t(label)}
    </button>
  );
}

function MiniStat({ value, label, tone = '#fff' }: { value: string; label: string; tone?: string }) {
  return (
    <span
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: radius.tile,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: tone }}>{t(value)}</span>
      <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)' }}>{t(label)}</span>
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: 'none',
  borderRadius: radius.inner,
  padding: '13px 16px',
  fontSize: 13.5,
  color: color.navy,
  boxShadow: shadow.card,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

const plainInput: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: 'none',
  borderRadius: radius.tile,
  padding: '11px 14px',
  fontSize: 12,
  color: color.navy,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

export const Events = {
  Feed, Detail, Create, GroupDetail, GroupCreate, GroupMembers, DmChat,
};
