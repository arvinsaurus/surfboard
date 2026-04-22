'use client'

import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { colors } from '@/lib/tokens'
import { cancelBtn, dangerBtn } from '@/lib/styles'

interface DeleteConfirmModalProps {
  toolName: string
  onClose: () => void
  onConfirm: () => void
  deleting: boolean
}

export function DeleteConfirmModal({ toolName, onClose, onConfirm, deleting }: DeleteConfirmModalProps) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.y > 100) onClose() }}
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 300 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
        style={{ maxWidth: 360, padding: '8px 20px 20px', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255, 0, 0, 0.05)',
            color: colors.danger,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </div>

        <h2 style={{ fontSize: 13, fontWeight: 500, color: '#000', marginBottom: 8 }}>
          Delete "{toolName}"?
        </h2>
        <p style={{ fontSize: 13, color: colors.subtle, lineHeight: 1.5, marginBottom: 24 }}>
          This action cannot be undone. This item will be permanently removed from Surfboard.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ ...cancelBtn, flex: 1 }}
            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = colors.surface}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{ ...dangerBtn, flex: 1, opacity: deleting ? 0.6 : 1 }}
            onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = colors.dangerHover }}
            onMouseLeave={e => { if (!deleting) e.currentTarget.style.background = colors.danger }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
