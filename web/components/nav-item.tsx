'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { colors } from '@/lib/tokens'

export interface NavItemProps {
  label: string
  count: number
  active: boolean
  hovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  isMobile?: boolean
}

export function NavItem({
  label,
  count,
  active,
  hovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isMobile = false,
}: NavItemProps) {
  const show = active || hovered
  const textColor = active ? colors.fg : colors.subtle

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: isMobile ? '2px 0' : '5px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: isMobile ? 20 : 13,
        lineHeight: 1.4,
        textAlign: 'left',
        width: '100%',
        color: textColor,
        fontWeight: active ? 600 : 400,
        transition: 'color 0.1s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <motion.span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          color: textColor,
        }}
        animate={{
          width: show ? (isMobile ? 26 : 20) : 0,
          opacity: show ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <ArrowRight size={isMobile ? 16 : 13} strokeWidth={2} style={{ flexShrink: 0 }} />
      </motion.span>
      <span>{label}</span>
      <span
        style={{
          fontSize: isMobile ? 16 : 13,
          color: colors.subtle,
          marginLeft: 6,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 400,
        }}
      >
        {count}
      </span>
    </button>
  )
}
