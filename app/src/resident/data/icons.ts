/**
 * Line-icon path data, lifted verbatim from the prototype.
 *
 * The design system mandates thin (1.5–1.7px) monochrome line icons — the user
 * explicitly had emoji replaced with these twice during the design chat, so
 * nothing here should become an emoji.
 */

export const icons = {
  maint:
    'M20.5 6.8a4.5 4.5 0 0 1-6 4.2l-7 7a2.1 2.1 0 0 1-3-3l7-7a4.5 4.5 0 0 1 5.7-5.6L14.6 5l2.4 2.4 2.6-2.6c.6.6.9 1.2.9 2z',
  amen:
    'M2 15.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M2 19.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M8 11V7a4 4 0 0 1 8 0',
  docs: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  events: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5',
  pay: 'M3 7h18v12H3zM3 11h18M6 15h4',
  contacts:
    'M5 4h4l1.5 4-2 1.5a12 12 0 0 0 5 5L15 12.5 19 14v4a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z',
  cars: 'M3 16l2-6h14l2 6v4h-3v-2H6v2H3zM7.5 13h.01M16.5 13h.01',
  links:
    'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
  pets:
    'M12 13c-3 0-5.2 2-5.2 4.4 0 1.6 1.1 2.6 2.6 2.6h5.2c1.5 0 2.6-1 2.6-2.6C17.2 15 15 13 12 13zM6.5 9.5h.01M12 7.5h.01M17.5 9.5h.01',
  lost: 'M15.5 15.5L21 21M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
  cart:
    'M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  neighbors:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M15 3.13A4 4 0 0 1 15 11',
  bill: 'M14 2H6v20h12V8zM14 2v6h6M13 11l-3 4h4l-3 4',
  realestate: 'M3 21h18M5 21V9l7-5 7 5v12M9 14h6M9 17h6',
  gem: 'M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z',
  bell: 'M12 3a6 6 0 0 1 6 6v4l2 3H4l2-3V9a6 6 0 0 1 6-6zM10 20a2 2 0 0 0 4 0',
  chevron: 'M9 5l7 7-7 7',
  chat: 'M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  home: 'M4 11l8-7 8 7v9h-5v-6h-6v6H4z',
  people:
    'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1a3.5 3.5 0 0 0-2.5-3.4M15 4.1a3.5 3.5 0 0 1 0 6.8M4 19v-1a3.5 3.5 0 0 1 2.5-3.4M9 4.1a3.5 3.5 0 0 0 0 6.8',
  shield: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  help: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.5 9a2.5 2.5 0 0 1 4 2c0 1.5-2 2-2 3M12 17h.01',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 17v3h-3',
  phone: 'M7 2h10v20H7zM10 19h4',
  camera: 'M4 8h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  clock: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5l3 2',
  pin: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  check: 'M4 12.5l5 5L20 6.5',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  heart: 'M12 20s-7-4.7-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7-2.5C19 15.3 12 20 12 20z',
  image: 'M4 5h16v14H4zM4 16l4.5-4.5L13 16M14 13l2.5-2.5L20 14M15.5 8.5h.01',
  file: 'M14 2H6v20h12V8zM14 2v6h6M9 13h6M9 17h4',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  star: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 19.6l1.1-6L3.4 9.4l6-.8z',
  bolt: 'M13 2L5 13h5l-1 9 8-11h-5z',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  wifi: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01',
  gas: 'M12 3s5 5 5 9.5a5 5 0 0 1-10 0C7 8 12 3 12 3zM12 21v-3',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  scooter:
    'M5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7.5 15.5h9M14 6h3l2 7M6 15l3-9h3',
  wallet: 'M3 7h18v12H3zM17 12h2M3 7l1-3h13l1 3',
  lock: 'M6 11h12v10H6zM9 11V8a3 3 0 0 1 6 0v3',
} as const;

/** Maintenance ticket categories (R5). */
export const catIcons = {
  plumbing: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  electric: 'M13 2L5 13h5l-1 9 8-11h-5z',
  ac: 'M12 3v18M5 6.5l14 11M19 6.5l-14 11',
  carpentry: 'M14.5 4.5l5 5-2 2-5-5zM12.5 6.5L4 15l-1 4 4-1 8.5-8.5',
  common: 'M12 3l5 7.5h-3.5L18 17H6l4.5-6.5H7zM12 17v4',
  other: 'M5 12h.01M12 12h.01M19 12h.01',
} as const;

/** رفادتنا — neighbor sharing categories (R67–R69). */
export const shareIcons = {
  space: 'M3 21h18M5 21V9l7-5 7 5v12M9 14h6M9 17h6',
  gear: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-2.6z',
  sport: 'M6.5 6.5l11 11M4 9l5 5M15 4l5 5M2 12l4-4M18 18l4-4',
  kids: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 22v-6l-2-2 2-4h8l2 4-2 2v6',
  park: 'M3 13l2-5h14l2 5M3 13v5h2M21 13v5h-2M6 18a1.5 1.5 0 1 0 0-3M18 18a1.5 1.5 0 1 0 0-3',
  skill: 'M12 3L2 8l10 5 10-5zM6 10v6c0 1.5 2.7 3 6 3s6-1.5 6-3v-6',
} as const;

/** المتجر — store categories (R46). */
export const shopIcons = {
  all: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  rest: 'M7 3v7a2 2 0 0 0 2 2v9M7 3v5M11 3v5M17 3c-2 0-3 3-3 6h3v12',
  pharm: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8',
  grocery:
    'M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  bakery: 'M4 21h16M5 21v-7h14v7M12 10v4M12 10a2.5 2.5 0 1 0-2.5-2.5',
  fruits: 'M12 8c-3.5 0-6 2.5-6 6 0 3.5 2.5 7 6 7s6-3.5 6-7c0-3.5-2.5-6-6-6zM12 8c0-2.5 1.5-4 3.5-5',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  laundry: 'M5 3h14v18H5zM12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 6h.01M11 6h2',
  flowers: 'M12 22v-8M12 14a5 5 0 0 0 5-5V6l-5 2-5-2v3a5 5 0 0 0 5 5z',
} as const;

/** فواتيرك — external bill categories (R51–R55). */
export const billIcons = {
  elec: 'M13 2L5 13h5l-1 9 8-11h-5z',
  gas: 'M12 3s5 5 5 9.5a5 5 0 0 1-10 0C7 8 12 3 12 3zM12 21v-3',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  inet: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01',
  other: 'M14 2H6v20h12V8zM14 2v6h6M9 13h6M9 17h6',
} as const;
