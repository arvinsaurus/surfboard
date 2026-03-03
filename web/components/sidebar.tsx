'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Plus, ArrowRight, Github, X } from 'lucide-react'

const FG = 'rgba(0,0,0,0.70)'
const SUBTLE = 'rgba(0,0,0,0.50)'

/* ── Search button style ── */
const searchBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  height: 30,
  padding: '0 12px',
  background: '#f5f5f5',
  border: 'none',
  borderRadius: 99,
  color: FG,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.1s',
}

/* ── Add button style ── */
const addBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  height: 30,
  padding: '0 12px',
  background: '#f5f5f5',
  border: 'none',
  borderRadius: 99,
  color: FG,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.1s',
}

/* ── Raycast button style ── */
const raycastBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  height: 30,
  padding: '0 14px',
  background: '#f5f5f5',
  border: 'none',
  borderRadius: 99,
  color: FG,
  fontSize: 12.5,
  fontWeight: 500,
  textDecoration: 'none',
  width: 'fit-content',
  fontFamily: 'inherit',
  transition: 'background 0.1s',
}

interface SidebarProps {
  toolCount: number
  allTags: string[]
  tagCounts: Record<string, number>
  activeTag: string | null
  onTagChange: (tag: string | null) => void
  onSearchOpen: () => void
  onAddOpen: () => void
  onClose?: () => void
  othersCount: number
  isMobile?: boolean
}

export function Sidebar({
  toolCount,
  allTags,
  tagCounts,
  activeTag,
  onTagChange,
  onSearchOpen,
  onAddOpen,
  onClose,
  othersCount,
  isMobile = false,
}: SidebarProps) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  return (
    <aside
      style={{
        width: isMobile ? '100%' : 256,
        height: isMobile ? '100dvh' : '100vh',
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isMobile ? 'transparent' : '#fff',
        zIndex: 10,
        padding: isMobile ? '16px 20px 0' : 16,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="sidebar-hidden-scrollbar"
    >
      <div>
        {/* ── Mobile close button ── */}
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.06)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              color: FG,
            }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}

        {/* ── App Icon + Title (stacked) ── */}
        {!isMobile && (
          <div className="sidebar-branding" style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <img
                src="/icon.png"
                alt="Surfboard"
                width={32}
                height={32}
                style={{ borderRadius: 12, display: 'block' }}
              />
            </div>
            <h1
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: FG,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Surfboard
            </h1>
            <p style={{ fontSize: 13, color: SUBTLE, marginTop: 3, lineHeight: 1.4 }}>
              Curated bookmarks for Morva Labs
            </p>
          </div>
        )}

        {/* ── Action Pills ── */}
        {!isMobile && (
          <div className="sidebar-actions" style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#EEEEEE' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onClick={onSearchOpen}
              style={searchBtnStyle}
            >
              <Search size={13} strokeWidth={2.4} />
              <span style={{ fontSize: 11, color: SUBTLE }}>⌘F</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#EEEEEE' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onClick={onAddOpen}
              style={addBtnStyle}
            >
              <Plus size={14} strokeWidth={2.2} />
              <span>Add</span>
              <span style={{ fontSize: 11, color: SUBTLE }}>S</span>
            </motion.button>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <NavItem
              label="All"
              count={toolCount}
              active={activeTag === null}
              hovered={hoveredNav === '__all'}
              onMouseEnter={() => setHoveredNav('__all')}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => onTagChange(null)}
              isMobile={isMobile}
            />
          </motion.div>
          {allTags.map((tag, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
            >
              <NavItem
                label={tag}
                count={tagCounts[tag] || 0}
                active={activeTag === tag}
                hovered={hoveredNav === tag}
                onMouseEnter={() => setHoveredNav(tag)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
          {othersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + allTags.length * 0.03 }}
            >
              <NavItem
                label="Others"
                count={othersCount}
                active={activeTag === '__others'}
                hovered={hoveredNav === '__others'}
                onMouseEnter={() => setHoveredNav('__others')}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => onTagChange(activeTag === '__others' ? null : '__others')}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </nav>
      </div>

      <div
        className="sidebar-footer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 4 : 12,
          paddingBottom: isMobile ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : undefined,
        }}
      >
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/icon.png" alt="Surfboard" width={20} height={20} style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: FG }}>Surfboard</span>
          </div>
        )}
        {!isMobile && (
          <motion.a
            href="https://github.com/arvinsaurus/surfboard"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, backgroundColor: '#EEEEEE' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            style={raycastBtnStyle}
          >
            <Github size={14} strokeWidth={2.4} />
            <span>Install on Raycast</span>
          </motion.a>
        )}
        <p style={{ fontSize: isMobile ? 12 : 11, color: SUBTLE }}>Made by Arvin in his free time</p>
      </div>
    </aside>
  )
}

/* ── Nav Item with animated arrow + indent ── */
function NavItem({
  label,
  count,
  active,
  hovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isMobile = false,
}: {
  label: string
  count: number
  active: boolean
  hovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  isMobile?: boolean
}) {
  const show = active || (!isMobile && hovered)
  const textColor = active ? FG : SUBTLE

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: isMobile ? '5px 0' : '5px 0',
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
          width: show ? (isMobile ? 28 : 20) : 0,
          opacity: show ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <ArrowRight size={isMobile ? 18 : 13} strokeWidth={2} style={{ flexShrink: 0 }} />
      </motion.span>
      <span>{label}</span>
      <span
        style={{
          fontSize: isMobile ? 16 : 13,
          color: SUBTLE,
          marginLeft: isMobile ? 8 : 6,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 400,
        }}
      >
        {count}
      </span>
    </button>
  )
}


