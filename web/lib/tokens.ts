// ── Design tokens for Surfboard Web ────────────────────────────────────────

export const colors = {
  fg:           'rgba(0,0,0,0.70)',  // body text, labels, nav items
  subtle:       'rgba(0,0,0,0.45)',  // secondary text, metadata, placeholders
  muted:        'rgba(0,0,0,0.25)',  // index numbers, very faint text
  danger:       '#ff4444',
  dangerHover:  '#e03d3d',
  surface:      '#f5f5f5',           // button/input background
  surfaceHover: '#eeeeee',           // hover state
  surfaceMuted: '#f2f2f2',           // tag badges, subtle fills
  border:       'rgba(0,0,0,0.06)',
  borderStrong: 'rgba(0,0,0,0.10)',
} as const

export const radius = {
  xs:   4,
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  pill: 99,
} as const

export const shadows = {
  card:     '0 0 0 1px rgba(0,0,0,0.10)',
  cardHover:'0 6px 18px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.10)',
  modal:    '0 16px 48px 0 rgba(0,0,0,0.10)',
  dropdown: '0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
} as const
