/**
 * Rifada (رفادة) design tokens.
 *
 * Lifted verbatim from the Claude Design prototypes so the port stays
 * pixel-faithful. Frequency-ranked from the three prototype files:
 * navy/slate/gold carry the whole system, everything else is a tint of them.
 */

export const color = {
  /** Primary — brand, headers, body copy. */
  navy: '#1F3B57',
  /** Lighter navy used as the top stop of every navy gradient. */
  navyLight: '#27496F',
  navyLift: '#2B4E76',
  /** Navy hover / pressed. */
  navyDark: '#17304A',
  navyDeep: '#152A3F',

  /** Accent — CTAs, highlights, active states. */
  gold: '#C79A3C',
  /** Gold text on light tints (passes contrast where plain gold would not). */
  goldDeep: '#A87F2C',
  goldHover: '#B78A30',
  goldSoft: '#E8C989',

  /** Success / paid / positive sentiment. */
  green: '#3FA66B',
  greenDeep: '#2E7D51',
  greenDark: '#3E7A5E',
  greenDarker: '#2A5741',
  greenSoft: '#8FE0B0',
  greenBright: '#7BD8A5',

  /** Warning / overdue / negative sentiment. */
  coral: '#E4675A',
  coralDeep: '#B24439',

  /** Rewards gradient end stop (navy → deep purple). */
  purple: '#3D2A5C',
  purpleMid: '#8A5A83',
  purpleDeep: '#5C3A57',

  /** Text. */
  slate: '#6B7280',
  slateDark: '#4B5563',
  slateLight: '#9AA1AC',
  placeholder: '#A8AEB8',

  /** Surfaces. */
  bg: '#F7F4EE',
  card: '#FFFFFF',
  /** Icon tiles and inset wells. */
  tile: '#F1EDE4',
  tileAlt: '#EFEBE2',
  tileWarm: '#E7E3DA',
  /** Page ground behind the device. */
  page: '#E9E4D9',
  pageLift: '#F3EFE6',

  /** Hairlines and dividers. */
  line: '#C6CBD3',
  lineSoft: '#D8DCE2',

  /** Misc accents used by a single feature. */
  brown: '#8A6D3B',
  brownDeep: '#5C4A2A',
  orange: '#D97036',
} as const;

/** Alpha tints of the brand colors, as used throughout the prototype. */
export const tint = {
  goldWell: 'rgba(199,154,60,0.12)',
  goldWellStrong: 'rgba(199,154,60,0.18)',
  goldIcon: 'rgba(199,154,60,0.14)',
  goldBorder: 'rgba(199,154,60,0.4)',
  navyWell: 'rgba(31,59,87,0.06)',
  navyBorder: 'rgba(31,59,87,0.3)',
  greenWell: 'rgba(63,166,107,0.1)',
  greenWellStrong: 'rgba(63,166,107,0.16)',
  coralWell: 'rgba(228,103,90,0.1)',
  coralWellStrong: 'rgba(228,103,90,0.16)',
} as const;

export const font = {
  /** Arabic display + body. */
  sans: "'Cairo', sans-serif",
  /** Latin, and all tabular figures (balances, points, dates, IDs). */
  mono: "'IBM Plex Sans', sans-serif",
} as const;

export const radius = {
  /** Cards. */
  card: 20,
  /** Inner cards, inputs, tiles. */
  inner: 16,
  /** Small chips and icon tiles. */
  tile: 14,
  /** Full pill — every primary button. */
  pill: 999,
} as const;

export const shadow = {
  /** The single card shadow used system-wide. */
  card: '0 2px 12px rgba(0,0,0,0.06)',
  cardLift: '0 2px 12px rgba(0,0,0,0.08)',
  cardStrong: '0 2px 12px rgba(0,0,0,0.09)',
  /** Floating CTA / toast. */
  float: '0 8px 24px rgba(31,59,87,0.35)',
  button: '0 4px 14px rgba(0,0,0,0.25)',
} as const;

/** Device frame geometry — matches ios-frame.jsx. */
export const device = { width: 402, height: 874 } as const;

/** Tabular figures, for every number the user reads as a quantity. */
export const numeric = {
  fontFamily: font.mono,
  fontVariantNumeric: 'tabular-nums',
} as const;
