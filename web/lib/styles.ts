import type { CSSProperties } from 'react'
import { colors, radius } from './tokens'

// ── Buttons ────────────────────────────────────────────────────────────────

// Secondary ghost pill — search, add, cancel, footer links
export const pillBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  height: 30,
  padding: '0 12px',
  background: colors.surface,
  border: 'none',
  borderRadius: radius.pill,
  color: colors.fg,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.1s',
}

// Primary / submit — dark fill
export const primaryBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 30,
  padding: '0 10px',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: radius.pill,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}

// Cancel — ghost with subtle text
export const cancelBtn: CSSProperties = {
  height: 30,
  padding: '0 10px',
  background: colors.surface,
  border: 'none',
  borderRadius: radius.pill,
  color: colors.subtle,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}

// Danger — red fill
export const dangerBtn: CSSProperties = {
  height: 30,
  padding: '0 10px',
  background: colors.danger,
  border: 'none',
  borderRadius: radius.pill,
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}

// Small square icon button — solid muted background
export const iconBtn: CSSProperties = {
  width: 25,
  height: 25,
  borderRadius: radius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.06)',
  border: 'none',
  color: colors.subtle,
  cursor: 'pointer',
  padding: 0,
}

// Small square icon button — frosted glass (card hover overlay)
export const iconBtnGlass: CSSProperties = {
  ...iconBtn,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(0,0,0,0.05)',
}

// Floating bottom bar button (mobile nav)
export const mobileBarBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: radius.pill,
  background: 'rgba(161,161,161,0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
}

// ── Forms ──────────────────────────────────────────────────────────────────

// Text input / textarea base
export const formInput: CSSProperties = {
  width: '100%',
  background: colors.surface,
  border: 'none',
  borderRadius: radius.md,
  height: 30,
  padding: '0 12px',
  color: colors.fg,
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
}

// ── Tags ───────────────────────────────────────────────────────────────────

// Read-only badge — in cards, list rows, search results
export const tagBadge: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 500,
  padding: '2px 7px',
  background: colors.surfaceMuted,
  borderRadius: radius.sm,
  color: colors.subtle,
  whiteSpace: 'nowrap',
}

// Interactive chip with X — selected tags in form
export const tagChip: CSSProperties = {
  background: colors.surfaceMuted,
  padding: '0 10px',
  height: 24,
  borderRadius: radius.sm,
  fontSize: 13,
  color: colors.fg,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}

// Dashed "add tag" trigger button
export const tagTrigger: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  height: 26,
  padding: '0 10px',
  borderRadius: radius.md,
  border: '1.5px dashed #ddd',
  background: 'none',
  color: colors.subtle,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: 'inherit',
}

// ── Misc ───────────────────────────────────────────────────────────────────

// Keyboard shortcut badge — ESC, /
export const kbdBadge: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: colors.subtle,
  background: colors.surfaceHover,
  border: '1px solid rgba(0,0,0,0.05)',
  borderRadius: radius.xs,
  padding: '2px 6px',
  letterSpacing: '0.02em',
  fontFamily: 'inherit',
}
