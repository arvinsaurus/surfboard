'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SlidersHorizontal, Search, Plus } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isScrolled, setIsScrolled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => setIsScrolled(el.scrollTop > 0)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && !showAdd && !editTool) {
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
      {/* ── Mobile Bottom Bar ── */}
      <div className="mobile-bottom-bar">
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={mobileBarBtnStyle}
          aria-label="Open menu"
        >
          <SlidersHorizontal size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => setSearchOpen(true)}
          style={mobileBarBtnStyle}
          aria-label="Search"
        >
          <Search size={18} strokeWidth={2.2} />
        </button>
        <button
          onClick={() => setShowAdd(true)}
          style={mobileBarBtnStyle}
          aria-label="Add bookmark"
        >
          <Plus size={18} strokeWidth={2.2} />
        </button>
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggleInFooter={false}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sidebar-drawer"
            drag="x"
            dragConstraints={{ right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setMobileMenuOpen(false)
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
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
              onClose={() => setMobileMenuOpen(false)}
              othersCount={othersCount}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showViewToggleInFooter={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable main */}
      <main
        ref={mainRef}
        className="main-content"
        style={{
          marginLeft: 256,
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top blur / fade edge */}
        <motion.div
          className="main-blur-top"
          animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : -12 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
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

        <div className="main-inner" style={{ padding: viewMode === 'list' ? '32px 180px 72px' : '32px 40px 72px' }}>
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
            <div
              className="card-grid"
              style={viewMode === 'list'
                ? { display: 'flex', flexDirection: 'column', gap: 0 }
                : { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 64 }
              }
            >
              {filtered.map((tool, i) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={i}
                  onDelete={handleDeleteClick}
                  onEdit={setEditTool}
                  onOpen={trackOpen}
                  viewMode={viewMode}
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

const mobileBarBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 99,
  background: 'rgba(161,161,161,0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
}

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 20px',
}
