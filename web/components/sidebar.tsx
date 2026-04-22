'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Plus, Github, X } from 'lucide-react'
import { colors } from '@/lib/tokens'
import { pillBtn } from '@/lib/styles'
import { ViewToggle } from '@/components/view-toggle'
import { NavItem } from '@/components/nav-item'

const raycastBtn = {
  ...pillBtn,
  display: 'inline-flex',
  textDecoration: 'none',
  width: 'fit-content',
  padding: '0 14px',
  fontSize: 12.5,
} as React.CSSProperties

interface SidebarProps {
  toolCount: number
  allTags: string[]
  tagCounts: Record<string, number>
  activeTag: string | null
  onTagChange: (tag: string | null) => void
  onSearchOpen: () => void
  onAddOpen: () => void
  othersCount: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  showViewToggleInFooter?: boolean
  isMobile?: boolean
  onClose?: () => void
  activeSection: 'tools' | 'design'
  onSectionChange: (s: 'tools' | 'design') => void
}

export function Sidebar({
  toolCount,
  allTags,
  tagCounts,
  activeTag,
  onTagChange,
  onSearchOpen,
  onAddOpen,
  othersCount,
  viewMode,
  onViewModeChange,
  showViewToggleInFooter = false,
  isMobile = false,
  onClose,
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  return (
    <aside
      style={{
        width: isMobile ? '100%' : 256,
        height: '100vh',
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isMobile ? 'transparent' : '#fff',
        zIndex: 10,
        padding: isMobile ? '32px 20px calc(64px + env(safe-area-inset-bottom, 0px))' : 16,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="sidebar-hidden-scrollbar"
    >
      <div>
        {/* ── Mobile header row: section switcher + view toggle + close ── */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            {/* Section switcher */}
            <motion.button
              onClick={() => onSectionChange(activeSection === 'tools' ? 'design' : 'tools')}
              style={{
                height: 32,
                padding: '0 16px',
                borderRadius: 99,
                border: '1px solid rgba(0,0,0,0.12)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: colors.fg,
                background: 'transparent',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
              whileTap={{ scale: 0.88 }}
              transition={{ duration: 0.12 }}
              title={activeSection === 'tools' ? 'Switch to Design' : 'Switch to Tools'}
            >
              {activeSection === 'tools' ? 'Tools' : 'Design'}
            </motion.button>

            {/* View toggle + close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: colors.fg,
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* ── App Icon + Title ── */}
        {!isMobile && (
        <div className="sidebar-branding" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <img
              src="/icon.png"
              alt="Surfboard"
              width={32}
              height={32}
              style={{ borderRadius: 12, display: 'block' }}
            />
            {!showViewToggleInFooter && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.button
                  onClick={() => onSectionChange(activeSection === 'tools' ? 'design' : 'tools')}
                  style={{
                    height: 30,
                    padding: '0 12px',
                    borderRadius: 99,
                    border: '1px solid rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.fg,
                    background: 'transparent',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.12 }}
                  title={activeSection === 'tools' ? 'Switch to Design' : 'Switch to Tools'}
                >
                  {activeSection === 'tools' ? 'Tools' : 'Design'}
                </motion.button>
                <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
              </div>
            )}
          </div>
          <h1
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: colors.fg,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Surfboard
          </h1>
          <p style={{ fontSize: 13, color: colors.subtle, marginTop: 3, lineHeight: 1.4 }}>
            Curated bookmarks for Morva Labs
          </p>

          {/* ── Search + Add row (desktop: below branding) ── */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: colors.surfaceHover }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onClick={onSearchOpen}
              style={pillBtn}
            >
              <Search size={13} strokeWidth={2.4} />
              <span style={{ fontSize: 11, color: colors.subtle }}>/</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: colors.surfaceHover }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onClick={onAddOpen}
              style={pillBtn}
            >
              <Plus size={14} strokeWidth={2.2} />
              <span>Add</span>
              <span style={{ fontSize: 11, color: colors.subtle }}>S</span>
            </motion.button>
          </div>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* ── View Toggle (desktop: above footer) ── */}
        {showViewToggleInFooter && !isMobile && (
          <div style={{ marginBottom: 16 }}>
            <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
          </div>
        )}

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <img
                src="/icon.png"
                alt="Surfboard"
                width={28}
                height={28}
                style={{ borderRadius: 8, display: 'block' }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: colors.fg, letterSpacing: '-0.01em' }}>
                Surfboard
              </span>
            </div>
          )}
          {!isMobile && (
            <motion.a
              href="https://github.com/morvaproject/surfboard"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, backgroundColor: colors.surfaceHover }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              style={raycastBtn}
            >
              <Github size={14} strokeWidth={2.4} />
              <span>Install on Raycast</span>
            </motion.a>
          )}
          <p style={{ fontSize: 11, color: colors.subtle }}>Made by Arvin in his free time</p>
        </div>
      </div>
    </aside>
  )
}

