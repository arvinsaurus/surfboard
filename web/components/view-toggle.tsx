'use client'

import { motion } from 'motion/react'
import { LayoutGrid, List } from 'lucide-react'
import { colors } from '@/lib/tokens'

export interface ViewToggleProps {
  viewMode: 'grid' | 'list'
  onChange: (mode: 'grid' | 'list') => void
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  const toggle = () => onChange(viewMode === 'grid' ? 'list' : 'grid')

  return (
    <motion.button
      onClick={toggle}
      style={{
        width: 32,
        height: 32,
        borderRadius: 99,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.fg,
        padding: 0,
        fontFamily: 'inherit',
        background: 'transparent',
        border: '1px solid rgba(0,0,0,0.12)',
      }}
      whileTap={{ scale: 0.88 }}
      transition={{ duration: 0.12 }}
      title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
    >
      {viewMode === 'grid'
        ? <LayoutGrid size={13} strokeWidth={2} />
        : <List size={13} strokeWidth={2} />
      }
    </motion.button>
  )
}
