import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { ACTIVE_NEIGHBOURS, cmFilterDefs, cmPostDefs, cmTagMeta, unitOf } from '../data/community';
import { icons } from '../data/icons';
import { avatarBg, UNIT_SHORT } from '../data/seed';
import { useResident } from '../store';
import type { Comment, CommunityPost, PostAttachment } from '../types';
import { ChipRow } from './parts';
import { t } from '@/i18n/lang';

const ME = 'عبدالله العتيبي';

type FullPost = CommunityPost & { comments: Comment[] };

/** User posts sit above the seeded ones, so index 0..n-1 are editable. */
function usePosts(): { posts: FullPost[]; mineCount: number } {
  const { st } = useResident();
  const mine = st.cmUserPosts.map((p) => ({ ...p, comments: [] as Comment[] }));
  return { posts: [...mine, ...cmPostDefs], mineCount: mine.length };
}

/** Attachment renderer, shared by posts, comments and replies. */
function Attachment({ att, onOpen }: { att: PostAttachment; onOpen: () => void }) {
  if (!att) return null;

  if (att.type === 'image') {
    return (
      <span style={{ display: 'block', marginTop: 12, borderRadius: 14, overflow: 'hidden', lineHeight: 0 }}>
        <span
          style={{
            display: 'block',
            width: '100%',
            height: 130,
            backgroundImage: `url(${att.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </span>
    );
  }

  if (att.type === 'file') {
    return (
      <button
        onClick={onOpen}
        style={{
          width: '100%',
          marginTop: 12,
          background: color.bg,
          border: '1.5px dashed rgba(31,59,87,0.18)',
          borderRadius: 14,
          padding: '12px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          textAlign: 'right',
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: 'rgba(228,103,90,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon path="M14 2H6v20h12V8zM14 2v6h6" size={18} stroke={color.coral} width={1.6} />
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: color.navy,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t(att.name)}
          </span>
          <span dir="ltr" style={{ ...numeric, fontSize: 10, color: color.slateLight, textAlign: 'right' }}>
            PDF · {att.size}
          </span>
        </span>
        <Icon path="M12 3v12M7 11l5 5 5-5M4 20h16" size={16} width={1.7} style={{ flex: 'none' }} />
      </button>
    );
  }

  return (
    <button
      onClick={onOpen}
      style={{
        width: '100%',
        marginTop: 12,
        background: 'rgba(31,59,87,0.04)',
        border: 'none',
        borderRadius: 14,
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        textAlign: 'right',
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: 'rgba(31,59,87,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon path={icons.link} size={18} width={1.7} />
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: color.navy,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t(att.title)}
        </span>
        <span
          dir="ltr"
          style={{
            ...numeric,
            fontSize: 10,
            color: color.goldDeep,
            textAlign: 'right',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t(att.url)}
        </span>
      </span>
    </button>
  );
}

/** Author line: name + gold unit, time underneath. */
function AuthorLine({
  who,
  unit,
  avBg,
  time,
  size = 38,
}: {
  who: string;
  unit: string;
  avBg: string;
  time: string;
  size?: number;
}) {
  return (
    <>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: 99,
          background: avBg,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.34,
          fontWeight: 800,
          flex: 'none',
        }}
      >
        {who[0]}
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
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
          {t(who)} <span style={{ color: color.goldDeep, fontWeight: 800 }}>— {unit}</span>
        </span>
        <span style={{ fontSize: 10, color: color.slateLight, whiteSpace: 'nowrap' }}>{t(time)}</span>
      </span>
    </>
  );
}

/** R75 — Feed. */
function Feed() {
  const { st, set, go, showToast } = useResident();
  const { posts, mineCount } = usePosts();

  const commentCount = (p: FullPost, i: number) => {
    const base = p.comments.reduce((a, c) => a + 1 + c.replies.length, 0);
    const extra = (st.cmExtraComments[i] ?? []).length;
    const extraReplies = Object.keys(st.cmExtraReplies)
      .filter((k) => k.startsWith(`${i}_`))
      .reduce((a, k) => a + st.cmExtraReplies[k].length, 0);
    return base + extra + extraReplies;
  };

  const shown = posts
    .map((p, i) => ({ ...p, i }))
    .filter((p) => st.cmFilter === 'all' || p.tag === st.cmFilter);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t('اسأل جيرانك')}</div>
        <StatusPill tone="green" style={{ fontSize: 10, padding: '5px 13px', fontWeight: 800 }}>
          {ACTIVE_NEIGHBOURS} {t('جارًا نشطًا')}
        </StatusPill>
      </div>

      <button
        onClick={() => go('communityNew', { cmEditIdx: null, cmDraft: '', cmNewAtt: null })}
        style={{
          margin: '6px 18px 0',
          background: '#fff',
          border: 'none',
          borderRadius: radius.pill,
          padding: '12px 16px',
          boxShadow: shadow.card,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textAlign: 'right',
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 99,
            background: avatarBg.me,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            flex: 'none',
          }}
        >
          {t('ع')}
        </span>
        <span style={{ flex: 1, fontSize: 12.5, color: color.slateLight }}>
          {t('عندك سؤال لجيرانك؟ اكتبه هنا…')}
        </span>
        <Icon
          path="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
          size={16}
          stroke={color.gold}
          width={1.7}
          style={{ flex: 'none' }}
        />
      </button>

      <div style={{ padding: '12px 18px 2px' }}>
        <ChipRow chips={cmFilterDefs} value={st.cmFilter} onPick={(k) => set({ cmFilter: k })} />
      </div>

      {/* 100px of tail room so the last post never clips under the bar, and a
          tighter left inset — both were explicit design-chat requests. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 100px 12px' }}>
        {shown.map((p) => {
          const liked = !!st.cmLiked[p.i];
          const tm = cmTagMeta[p.tag];
          const isMine = p.i < mineCount;
          const menuOpen = st.cmMenuOpen === p.i;
          return (
            <div
              key={`${t(p.who)}-${p.i}`}
              style={{
                background: '#fff',
                borderRadius: radius.card,
                padding: 18,
                boxShadow: '0 3px 16px rgba(31,59,87,0.07)',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AuthorLine who={t(p.who)} unit={t(p.unit)} avBg={p.avBg} time={t(p.time)} />
                <StatusPill
                  bg={tm.bg}
                  c={tm.c}
                  style={{ fontSize: 9.5, padding: '3px 12px', fontWeight: 800 }}
                >
                  {t(p.tag)}
                </StatusPill>
                {isMine && (
                  <button
                    onClick={() => set((s) => ({ cmMenuOpen: s.cmMenuOpen === p.i ? null : p.i }))}
                    aria-label="خيارات المنشور"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 99,
                      border: 'none',
                      background: menuOpen ? 'rgba(199,154,60,0.14)' : color.bg,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <Icon path="M12 6h.01M12 12h.01M12 18h.01" size={15} width={2.6} />
                  </button>
                )}
              </div>

              {menuOpen && (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 11,
                    background: color.bg,
                    borderRadius: 14,
                    padding: 8,
                  }}
                >
                  <button
                    onClick={() =>
                      go('communityNew', {
                        cmEditIdx: p.i,
                        cmDraft: p.text,
                        cmTag: p.tag,
                        cmNewAtt: p.att,
                        cmMenuOpen: null,
                        cmNewLinkOpen: false,
                      })
                    }
                    style={menuBtn(color.navy, '#fff')}
                  >
                    <Icon
                      path="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
                      size={13}
                      width={1.7}
                    />
                    {t('تعديل المنشور')}
                  </button>
                  <button
                    onClick={() => {
                      set((s) => ({
                        cmUserPosts: s.cmUserPosts.filter((_, k) => k !== p.i),
                        cmMenuOpen: null,
                        cmLiked: {},
                        cmComLiked: {},
                        cmExtraComments: {},
                        cmExtraReplies: {},
                      }));
                      showToast('حُذف منشورك نهائيًا');
                    }}
                    style={menuBtn(color.coralDeep, 'rgba(228,103,90,0.1)')}
                  >
                    <Icon
                      path="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"
                      size={13}
                      stroke={color.coralDeep}
                      width={1.7}
                    />
                    {t('حذف')}
                  </button>
                </div>
              )}

              <button
                onClick={() =>
                  go('communityPost', {
                    cmSelIdx: p.i,
                    cmComment: '',
                    cmReplyTo: null,
                    cmComAtt: null,
                    cmComLinkOpen: false,
                    cmMenuOpen: null,
                  })
                }
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'right',
                  padding: 0,
                  marginTop: 12,
                  fontFamily: font.sans,
                  fontSize: 13.5,
                  color: color.navy,
                  lineHeight: 1.95,
                }}
              >
                {t(p.text)}
              </button>

              <Attachment
                att={p.att}
                onOpen={() =>
                  showToast(
                    p.att?.type === 'file'
                      ? `${t('جارٍ تنزيل')} ${t(p.att.name)}…`
                      : `${t('فتح الرابط:')} ${p.att?.type === 'link' ? p.att.url : ''}`,
                  )
                }
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => set((s) => ({ cmLiked: { ...s.cmLiked, [p.i]: !liked } }))}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 15px',
                    borderRadius: radius.pill,
                    background: liked ? 'rgba(199,154,60,0.13)' : color.bg,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'rgba(199,154,60,0.25)' : 'none'}>
                    <path
                      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                      stroke={liked ? color.goldDeep : color.slate}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      ...numeric,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: liked ? color.goldDeep : color.slate,
                    }}
                  >
                    {p.likes + (liked ? 1 : 0)}
                  </span>
                </button>
                <button
                  onClick={() => go('communityPost', { cmSelIdx: p.i, cmComment: '', cmReplyTo: null })}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 15px',
                    borderRadius: radius.pill,
                    background: color.bg,
                  }}
                >
                  <Icon path={icons.chat} size={15} stroke={color.slate} width={1.6} />
                  <span style={{ ...numeric, fontSize: 11.5, fontWeight: 700, color: color.slate }}>
                    {commentCount(p, p.i)}
                  </span>
                </button>
                <span style={{ flex: 1 }} />
                <button
                  onClick={() => go('communityPost', { cmSelIdx: p.i, cmComment: '', cmReplyTo: null })}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: color.goldDeep,
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '4px 0',
                    fontFamily: font.sans,
                  }}
                >
                  {t('التعليقات ←')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** R76 — Post detail with comments and threaded replies. */
function Post() {
  const { st, set, back, showToast } = useResident();
  const { posts } = usePosts();
  const i = st.cmSelIdx;
  const p = posts[i] ?? posts[0];
  const tm = cmTagMeta[p.tag];
  const liked = !!st.cmLiked[i];

  const comments: Comment[] = [
    ...p.comments,
    ...(st.cmExtraComments[i] ?? []),
  ];

  const send = () => {
    const body = st.cmComment.trim();
    if (!body) {
      showToast(t('اكتب تعليقك أولًا'));
      return;
    }
    const entry = { who: ME, unit: UNIT_SHORT, avBg: avatarBg.me, time: t('الآن'), text: body, att: st.cmComAtt };
    if (st.cmReplyTo !== null) {
      const key = `${i}_${st.cmReplyTo}`;
      set((s) => ({
        cmExtraReplies: { ...s.cmExtraReplies, [key]: [...(s.cmExtraReplies[key] ?? []), entry] },
        cmComment: '',
        cmReplyTo: null,
        cmComAtt: null,
      }));
      showToast('نُشر ردك — وصل إشعار لصاحب التعليق');
    } else {
      set((s) => ({
        cmExtraComments: {
          ...s.cmExtraComments,
          [i]: [...(s.cmExtraComments[i] ?? []), { ...entry, likes: 0, replies: [] }],
        },
        cmComment: '',
        cmComAtt: null,
      }));
      showToast('نُشر تعليقك — وصل إشعار لصاحب المنشور');
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('المنشور')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 20px 12px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AuthorLine who={t(p.who)} unit={t(p.unit)} avBg={p.avBg} time={t(p.time)} />
            <StatusPill bg={tm.bg} c={tm.c} style={{ fontSize: 9.5, padding: '3px 12px', fontWeight: 800 }}>
              {t(p.tag)}
            </StatusPill>
          </div>
          <div style={{ marginTop: 12, fontSize: 13.5, color: color.navy, lineHeight: 1.95 }}>
            {t(p.text)}
          </div>
          <Attachment att={p.att} onOpen={() => showToast('فتح المرفق…')} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <button
              onClick={() => set((s) => ({ cmLiked: { ...s.cmLiked, [i]: !liked } }))}
              style={{
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 15px',
                borderRadius: radius.pill,
                background: liked ? 'rgba(199,154,60,0.13)' : color.bg,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'rgba(199,154,60,0.25)' : 'none'}>
                <path
                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                  stroke={liked ? color.goldDeep : color.slate}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  ...numeric,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: liked ? color.goldDeep : color.slate,
                }}
              >
                {p.likes + (liked ? 1 : 0)}
              </span>
            </button>
            <span style={{ fontSize: 11, color: color.slate, whiteSpace: 'nowrap' }}>
              · {comments.length} {t('تعليق')}
            </span>
          </div>
        </Card>

        {comments.map((c, ci) => {
          const key = `${i}_${ci}`;
          const cLiked = !!st.cmComLiked[key];
          const replies = [...c.replies, ...(st.cmExtraReplies[key] ?? [])];
          return (
            <div key={key} style={{ marginTop: 12 }}>
              <Card pad="14px 16px" style={{ borderRadius: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <AuthorLine
                    who={t(c.who)}
                    unit={c.unit || unitOf[c.who] || UNIT_SHORT}
                    avBg={c.avBg}
                    time={t(c.time)}
                    size={32}
                  />
                </div>
                <div style={{ fontSize: 12.5, color: color.slateDark, marginTop: 8, lineHeight: 1.9 }}>
                  {t(c.text)}
                </div>
                <Attachment att={c.att} onOpen={() => showToast('فتح المرفق…')} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                  <button
                    onClick={() => set((s) => ({ cmComLiked: { ...s.cmComLiked, [key]: !cLiked } }))}
                    style={inlineAction(cLiked ? color.goldDeep : color.slate)}
                  >
                    {t('إعجاب (')}{(c.likes ?? 0) + (cLiked ? 1 : 0)})
                  </button>
                  <button onClick={() => set({ cmReplyTo: ci })} style={inlineAction(color.slate)}>
                    {t('رد')}
                  </button>
                </div>
              </Card>

              {replies.map((r, ri) => (
                <Card
                  key={ri}
                  pad="12px 14px"
                  style={{ borderRadius: 16, marginTop: 8, marginRight: 26 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AuthorLine
                      who={t(r.who)}
                      unit={r.unit || unitOf[r.who] || UNIT_SHORT}
                      avBg={r.avBg}
                      time={t(r.time)}
                      size={28}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: color.slateDark, marginTop: 7, lineHeight: 1.85 }}>
                    {t(r.text)}
                  </div>
                  <Attachment att={r.att} onOpen={() => showToast('فتح المرفق…')} />
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      {/* composer */}
      <div style={{ padding: '0 14px 26px' }}>
        {st.cmReplyTo !== null && (
          <div
            style={{
              background: 'rgba(199,154,60,0.1)',
              borderRadius: radius.tile,
              padding: '7px 14px',
              marginBottom: 7,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 800, color: color.goldDeep, flex: 1 }}>
              {t('ترد على')} {comments[st.cmReplyTo]?.who}
            </span>
            <button
              onClick={() => set({ cmReplyTo: null })}
              aria-label="إلغاء الرد"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              <Icon path={icons.close} size={12} stroke={color.goldDeep} width={2} />
            </button>
          </div>
        )}

        {st.cmComAtt && (
          <div
            style={{
              background: '#fff',
              borderRadius: radius.tile,
              padding: '8px 14px',
              marginBottom: 7,
              boxShadow: shadow.card,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon
              path={st.cmComAtt.type === 'link' ? icons.link : icons.image}
              size={14}
              stroke={color.slate}
              width={1.6}
            />
            <span style={{ flex: 1, fontSize: 11, color: color.navy, fontWeight: 700 }}>
              {st.cmComAtt.type === 'link' ? t(st.cmComAtt.title) : st.cmComAtt.name}
            </span>
            <button
              onClick={() => set({ cmComAtt: null })}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              <Icon path={icons.close} size={12} stroke={color.coral} width={2} />
            </button>
          </div>
        )}

        <div
          style={{
            background: '#fff',
            borderRadius: radius.pill,
            padding: '9px 14px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={() =>
              set({ cmComAtt: { type: 'image', name: t('صورة من جوالك'), bg: avatarBg.tarek } })
            }
            aria-label="إرفاق صورة"
            style={iconBtn}
          >
            <Icon path={icons.image} size={16} stroke={color.slate} width={1.6} />
          </button>
          <button
            onClick={() =>
              set({
                cmComAtt: { type: 'link', title: t('رابط مرفق'), url: 'example-sa.com' },
              })
            }
            aria-label="إرفاق رابط"
            style={iconBtn}
          >
            <Icon path={icons.link} size={16} stroke={color.slate} width={1.6} />
          </button>
          <input
            value={st.cmComment}
            onChange={(e) => set({ cmComment: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={st.cmReplyTo !== null ? t('اكتب ردك…') : t('اكتب تعليقًا…')}
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
      </div>
    </div>
  );
}

/** R77 — Compose or edit a post. */
function New() {
  const { st, set, back, showToast } = useResident();
  const isEdit = st.cmEditIdx !== null;

  const publish = () => {
    const body = st.cmDraft.trim();
    if (!body) {
      showToast(t('اكتب منشورك أولًا'));
      return;
    }
    if (isEdit) {
      set((s) => ({
        cmUserPosts: s.cmUserPosts.map((p, k) =>
          k === s.cmEditIdx ? { ...p, text: body, tag: s.cmTag, att: s.cmNewAtt, time: t('عُدّل الآن') } : p,
        ),
        cmDraft: '',
        cmNewAtt: null,
        cmEditIdx: null,
        screen: 'community',
      }));
      showToast('حُفظت تعديلاتك على المنشور');
      return;
    }
    set((s) => ({
      cmUserPosts: [
        {
          who: ME,
          unit: UNIT_SHORT,
          avBg: avatarBg.me,
          time: t('الآن'),
          tag: s.cmTag,
          text: body,
          att: s.cmNewAtt,
          likes: 0,
          mine: true,
        },
        ...s.cmUserPosts,
      ],
      cmDraft: '',
      cmNewAtt: null,
      cmFilter: 'all',
      screen: 'community',
      cmLiked: {},
      cmComLiked: {},
      cmExtraComments: {},
      cmExtraReplies: {},
    }));
    showToast('نُشر منشورك — سيصلك إشعار مع كل تعليق');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={isEdit ? t('تعديل المنشور') : t('منشور جديد')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 30px' }}>
        <Card pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                background: avatarBg.me,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                flex: 'none',
              }}
            >
              {t('ع')}
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                {t(ME)} <span style={{ color: color.goldDeep }}>— {t(UNIT_SHORT)}</span>
              </span>
              <span style={{ fontSize: 10, color: color.greenDeep, fontWeight: 800 }}>
                {t('حساب موثّق ✓')}
              </span>
            </span>
          </div>

          <textarea
            value={st.cmDraft}
            onChange={(e) => set({ cmDraft: e.target.value })}
            rows={5}
            placeholder={t('عندك سؤال أو توصية لجيرانك؟ اكتبها هنا…')}
            style={{
              width: '100%',
              marginTop: 12,
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: 14,
              color: color.navy,
              resize: 'none',
              lineHeight: 1.95,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: font.sans,
            }}
          />

          {st.cmNewAtt && (
            <div style={{ marginTop: 4 }}>
              <Attachment att={st.cmNewAtt} onOpen={() => {}} />
              <button
                onClick={() => set({ cmNewAtt: null, cmNewLinkOpen: false })}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: color.coral,
                  fontSize: 11,
                  fontWeight: 800,
                  marginTop: 8,
                  fontFamily: font.sans,
                }}
              >
                {t('إزالة المرفق ✕')}
              </button>
            </div>
          )}

          {st.cmNewLinkOpen && (
            <input
              dir="ltr"
              value={st.cmNewLinkUrl}
              onChange={(e) => set({ cmNewLinkUrl: e.target.value })}
              onBlur={() =>
                st.cmNewLinkUrl.trim() &&
                set({
                  cmNewAtt: { type: 'link', title: t('رابط مرفق'), url: st.cmNewLinkUrl.trim() },
                  cmNewLinkOpen: false,
                })
              }
              placeholder="https://…"
              style={{
                width: '100%',
                marginTop: 10,
                background: color.bg,
                border: 'none',
                borderRadius: radius.tile,
                padding: '11px 14px',
                ...numeric,
                fontSize: 12,
                color: color.navy,
                boxSizing: 'border-box',
              }}
            />
          )}

          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <AttachBtn
              icon={icons.image}
              label={t('صورة')}
              onClick={() =>
                set({
                  cmNewAtt: { type: 'image', name: t('صورة من جوالك'), bg: avatarBg.karim },
                  cmNewLinkOpen: false,
                })
              }
            />
            <AttachBtn
              icon={icons.file}
              label={t('ملف')}
              onClick={() =>
                set({
                  cmNewAtt: { type: 'file', name: t('مرفق.pdf'), size: '0.8 MB' },
                  cmNewLinkOpen: false,
                })
              }
            />
            <AttachBtn
              icon={icons.link}
              label={t('رابط')}
              onClick={() => set({ cmNewLinkOpen: true, cmNewAtt: null })}
            />
          </div>
        </Card>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, margin: '16px 0 8px' }}>
          {t('تصنيف المنشور')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* The tag values are the state's own type (PostTag), so they stay
              Arabic — only the label is translated. */}
          {(['سؤال', 'توصية', 'عام'] as const).map((tag) => {
            const on = st.cmTag === tag;
            return (
              <button
                key={tag}
                onClick={() => set({ cmTag: tag })}
                style={{
                  flex: 1,
                  borderRadius: radius.pill,
                  padding: 11,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: on ? color.navy : '#fff',
                  color: on ? '#fff' : color.slate,
                  border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
                  fontFamily: font.sans,
                }}
              >
                {t(tag)}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={publish}>
          {isEdit ? t('احفظ التعديلات') : t('انشر لجيرانك')}
        </PillButton>
      </div>
    </div>
  );
}

function AttachBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: 'none',
        background: color.bg,
        borderRadius: radius.tile,
        padding: '10px 6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontSize: 11.5,
        fontWeight: 800,
        color: color.navy,
        fontFamily: font.sans,
      }}
    >
      <Icon path={icon} size={15} width={1.6} />
      {t(label)}
    </button>
  );
}

const menuBtn = (c: string, bg: string): React.CSSProperties => ({
  flex: 1,
  border: 'none',
  cursor: 'pointer',
  background: bg,
  borderRadius: radius.pill,
  padding: 9,
  fontSize: 11.5,
  fontWeight: 800,
  color: c,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  fontFamily: font.sans,
});

const inlineAction = (c: string): React.CSSProperties => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: c,
  fontSize: 10.5,
  fontWeight: 800,
  padding: 0,
  fontFamily: font.sans,
});

const iconBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 99,
  border: 'none',
  background: color.bg,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
};

export const Community = { Feed, Post, New };
