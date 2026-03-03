'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, Search, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Tool, PRESET_TAGS } from '@/lib/types'
import { Sidebar } from '@/components/sidebar'
import { ToolCard } from '@/components/tool-card'
import { SearchModal } from '@/components/search-modal'
import { ToolFormModal } from '@/components/tool-form-modal'
import { DeleteConfirmModal } from '@/components/delete-confirm-modal'
import { toast } from 'sonner'

export function SurfboardShell() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editTool, setEditTool] = useState<Tool | null>(null)
  const [deleteTool, setDeleteTool] = useState<Tool | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchTools = useCallback(async () => {
    const { data } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
    setTools((data as Tool[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input or textarea
      const isTyping = (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable;
      if (isTyping) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if ((e.key === 's' || e.key === 'S') && !showAdd && !editTool) {
        e.preventDefault()
        setShowAdd(true)
      }
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false)
        } else if (search) {
          setSearch('')
        }
        setShowAdd(false)
        setEditTool(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showAdd, editTool])

  // Determine which tags are preset vs custom
  const presetTagSet = new Set<string>(PRESET_TAGS)

  // Tag counts (only preset tags shown individually)
  const allPresetTags = Array.from(new Set(
    tools.flatMap((t) => (t.tags || []).filter((tag) => presetTagSet.has(tag)))
  )).sort()

  const tagCounts: Record<string, number> = {}
  tools.forEach((t) =>
    (t.tags || []).forEach((tag) => {
      if (presetTagSet.has(tag)) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }),
  )

  // Count tools that have at least one custom (non-preset) tag
  const othersTools = tools.filter((t) =>
    (t.tags || []).some((tag) => !presetTagSet.has(tag))
  )
  const othersCount = othersTools.length

  // Filtering
  const filtered = tools.filter((t) => {
    const q = search.toLowerCase().trim()
    const terms = q.split(/\s+/).filter(Boolean)

    const matchSearch = terms.length === 0 || terms.every(term =>
      t.name?.toLowerCase().includes(term) ||
      (t.description || '').toLowerCase().includes(term) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(term))
    )

    // If there's a search query, search globally (ignore activeTag)
    if (q) return matchSearch

    // Otherwise, filter by activeTag
    let matchTag = true
    if (activeTag === '__others') {
      matchTag = (t.tags || []).some((tag) => !presetTagSet.has(tag))
    } else if (activeTag) {
      matchTag = t.tags?.includes(activeTag)
    }

    return matchTag
  })

  const handleDeleteClick = (tool: Tool) => {
    setDeleteTool(tool)
  }

  const confirmDelete = async () => {
    if (!deleteTool) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('tools').delete().eq('id', deleteTool.id)
      if (error) throw error

      toast.success(`"${deleteTool.name}" removed`)
      fetchTools()
      setDeleteTool(null)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      toast.error('Failed to delete tool: ' + message)
    } finally {
      setDeleting(false)
    }
  }

  const trackOpen = async (tool: Tool) => {
    await supabase
      .from('tools')
      .update({ times_opened: (tool.times_opened || 0) + 1 })
      .eq('id', tool.id)
  }

  return (
    <div className="shell-root" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Mobile Header ── */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              color: FG,
            }}
            aria-label="Open menu"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/icon.png"
              alt="Surfboard"
              width={22}
              height={22}
              style={{ borderRadius: 6 }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: FG }}>Surfboard</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              color: FG,
            }}
            aria-label="Search"
          >
            <Search size={16} strokeWidth={2.2} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#f5f5f5',
              border: 'none',
              cursor: 'pointer',
              color: FG,
            }}
            aria-label="Add bookmark"
          >
            <Plus size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* ── Desktop Sidebar ── */}
      <div className="desktop-sidebar">
        <Sidebar
          toolCount={tools.length}
          allTags={allPresetTags}
          tagCounts={tagCounts}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          onSearchOpen={() => setSearchOpen(true)}
          onAddOpen={() => setShowAdd(true)}
          othersCount={othersCount}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="sidebar-drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <Sidebar
                isMobile
                toolCount={tools.length}
                allTags={allPresetTags}
                tagCounts={tagCounts}
                activeTag={activeTag}
                onTagChange={(tag) => {
                  setActiveTag(tag)
                  setMobileMenuOpen(false)
                }}
                onSearchOpen={() => {
                  setSearchOpen(true)
                  setMobileMenuOpen(false)
                }}
                onAddOpen={() => {
                  setShowAdd(true)
                  setMobileMenuOpen(false)
                }}
                othersCount={othersCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scrollable main */}
      <main
        className="main-content"
        style={{
          marginLeft: 256,
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Top blur / fade edge */}
        <div
          className="main-blur-top"
          style={{
            position: 'sticky',
            top: 0,
            height: 48,
            zIndex: 15,
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            background: 'rgba(255, 255, 255, 0.5)',
            marginBottom: -48,
          }}
        />

        {/* Bottom blur / fade edge */}
        <div
          className="main-blur-bottom"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 256,
            right: 0,
            height: 64,
            zIndex: 15,
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
            background: 'rgba(255, 255, 255, 0.5)',
          }}
        />

        <div className="main-inner">
          {/* Active Search Hint */}
          <AnimatePresence>
            {search && !searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                style={{
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <p style={{ fontSize: 13, color: SUBTLE }}>
                  Showing results for &ldquo;{search}&rdquo;
                </p>
                <button
                  onClick={() => setSearch('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: 13,
                    color: SUBTLE,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div style={emptyStyle}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: '2px solid #eee',
                  borderTopColor: '#aaa',
                  borderRadius: '50%',
                  animation: 'spin 0.55s linear infinite',
                }}
              />
              <p style={{ color: 'rgba(0,0,0,0.50)', fontSize: 13, marginTop: 10 }}>
                Loading tools...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={emptyStyle}>
              <p style={{ fontSize: 42, opacity: 0.1 }}>🏄</p>
              <p style={{ color: 'rgba(0,0,0,0.50)', fontSize: 13, marginTop: 10 }}>
                No tools found
              </p>
              {(search || activeTag) && (
                <button
                  onClick={() => {
                    setSearch('')
                    setActiveTag(null)
                    setSearchOpen(false)
                  }}
                  style={{
                    marginTop: 18,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: 13,
                    color: SUBTLE,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          ) : (
            <div className="card-grid">
              {filtered.map((tool, i) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={i}
                  onDelete={handleDeleteClick}
                  onEdit={setEditTool}
                  onOpen={trackOpen}
                />
              ))}
            </div>
          )}
        </div>
      </main>



      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            tools={filtered}
            search={search}
            onSearchChange={setSearch}
            onClose={() => setSearchOpen(false)}
            onOpen={trackOpen}
          />
        )}
      </AnimatePresence>

      {/* Add / Edit */}
      <AnimatePresence>
        {(showAdd || editTool) && (
          <ToolFormModal
            tool={editTool}
            onClose={() => {
              setShowAdd(false)
              setEditTool(null)
            }}
            onSaved={() => {
              setShowAdd(false)
              setEditTool(null)
              fetchTools()
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteTool && (
          <DeleteConfirmModal
            toolName={deleteTool.name}
            onClose={() => setDeleteTool(null)}
            onConfirm={confirmDelete}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const SUBTLE = 'rgba(0,0,0,0.50)'
const FG = 'rgba(0,0,0,0.70)'

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 20px',
}
