'use client'

import { useRef, useEffect, useState, useMemo, memo } from 'react'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { Tool } from '@/lib/types'
import { colors } from '@/lib/tokens'
import { tagBadge, kbdBadge } from '@/lib/styles'

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

export const SearchModal = memo(function SearchModal({ tools, search, onSearchChange, onClose, onOpen }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60)
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    setIsMobile(window.innerWidth < 768)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Filter locally for instant results (only need top 8)
  const results = useMemo(() => {
    const q = search.toLowerCase().trim()
    const terms = q.split(/\s+/).filter(Boolean)
    if (terms.length === 0) return tools.slice(0, 8)
    const matched: Tool[] = []
    for (const t of tools) {
      if (matched.length >= 8) break
      const hit = terms.every(term =>
        t.name?.toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(term))
      )
      if (hit) matched.push(t)
    }
    return matched
  }, [tools, search])

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
        className="modal-content search-modal-content"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.y > 100) onClose() }}
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 300 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
        style={{ maxWidth: 640, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
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
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Search size={16} strokeWidth={2.4} color={colors.subtle} />
          <input
            ref={inputRef}
            type="text"
            placeholder="What are you looking for?"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && search) onClose() }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: 14,
              color: colors.fg,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          {!isMobile && <kbd style={kbdBadge}>ESC</kbd>}
        </div>

        {/* Results */}
        <div
          className="no-scrollbar"
          style={{ flex: isMobile ? 1 : undefined, maxHeight: isMobile ? undefined : 320, overflowY: 'auto', paddingBottom: 10 }}
        >
          {results.length === 0 ? (
            <p style={{ padding: '20px 16px', color: colors.subtle, fontSize: 13, textAlign: 'center' }}>
              {search ? `No results for "${search}"` : 'No tools found'}
            </p>
          ) : (
            results.map((tool) => {
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
                  onClick={() => { onOpen(tool); onClose() }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = colors.surfaceHover }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <img
                    src={tool.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                    alt=""
                    style={{ width: 17, height: 17, borderRadius: 4 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: colors.fg }}>{tool.name}</div>
                    <div style={{ fontSize: 13, color: colors.subtle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {domain}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {tool.tags?.slice(0, isMobile ? 1 : 2).map((tag) => (
                      <span key={tag} style={tagBadge}>{tag}</span>
                    ))}
                    {tool.tags && tool.tags.length > (isMobile ? 1 : 2) && (
                      <span style={tagBadge}>+{tool.tags.length - (isMobile ? 1 : 2)}</span>
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
})
