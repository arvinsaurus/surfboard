'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { Tool } from '@/lib/types'

const FG = 'rgba(0,0,0,0.70)'
const SUBTLE = 'rgba(0,0,0,0.50)'

interface SearchModalProps {
  tools: Tool[]
  search: string
  onSearchChange: (v: string) => void
  onClose: () => void
  onOpen: (tool: Tool) => void
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function SearchModal({ tools, search, onSearchChange, onClose, onOpen }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose()
        }}
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 300 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ maxWidth: 480, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 48,
            padding: '0 16px',
            background: 'none',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Search size={16} strokeWidth={2.4} color={SUBTLE} />
          <input
            ref={inputRef}
            type="text"
            placeholder="what do you need?"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: 14,
              color: FG,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <kbd
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: SUBTLE,
              background: '#EEEEEE',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 4,
              padding: '2px 6px',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: 'auto', paddingBottom: 10 }}>
          {tools.length === 0 ? (
            <p
              style={{
                padding: '20px 16px',
                color: SUBTLE,
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {search ? `No results for "${search}"` : 'No tools found'}
            </p>
          ) : (
            tools.slice(0, 8).map((tool) => {
              const domain = getDomain(tool.url)
              return (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 15px',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onClick={() => {
                    onOpen(tool)
                    onClose()
                  }}
                  onMouseEnter={(e) => {
                    ; (e.currentTarget as HTMLElement).style.background = '#EEEEEE'
                  }}
                  onMouseLeave={(e) => {
                    ; (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <img
                    src={
                      tool.favicon_url ||
                      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                    }
                    alt=""
                    style={{ width: 17, height: 17, borderRadius: 4 }}
                    onError={(e) => {
                      ; (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: FG }}>
                      {tool.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: SUBTLE,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {domain}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {tool.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 12,
                          color: SUBTLE,
                          background: '#f4f4f4',
                          borderRadius: 4,
                          padding: '2px 7px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {tool.tags && tool.tags.length > 2 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: SUBTLE,
                          background: '#f4f4f4',
                          borderRadius: 4,
                          padding: '2px 7px',
                        }}
                      >
                        +{tool.tags.length - 2}
                      </span>
                    )}
                  </div>
                </a>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
