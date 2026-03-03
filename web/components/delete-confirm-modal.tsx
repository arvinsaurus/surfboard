'use client'

import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'

const FG = 'rgba(0,0,0,0.85)'
const SUBTLE = 'rgba(0,0,0,0.45)'

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
            transition={{ duration: 0.15 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1100,
            }}
            onClick={onClose}
        >
            <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    background: 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    borderRadius: 12,
                    width: '100%',
                    maxWidth: 360,
                    boxShadow: '0 16px 48px 0 rgba(0, 0, 0, 0.10)',
                    position: 'relative',
                    padding: '8px 20px 20px',
                    textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-handle" />
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255, 0, 0, 0.05)',
                        color: '#ff4444',
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
                <p style={{ fontSize: 13, color: SUBTLE, lineHeight: 1.5, marginBottom: 24 }}>
                    This action cannot be undone. This item will be permanently removed from Surfboard.
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            height: 30,
                            padding: '0 10px',
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: 99,
                            color: SUBTLE,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#EEEEEE'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        style={{
                            flex: 1,
                            height: 30,
                            padding: '0 10px',
                            background: '#ff4444',
                            border: 'none',
                            borderRadius: 99,
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            opacity: deleting ? 0.6 : 1,
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e03d3d'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ff4444'}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}
