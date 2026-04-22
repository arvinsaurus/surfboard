'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Check, Pencil } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Tool, PRESET_TAGS, DESIGN_TAGS } from '@/lib/types'
import { toast } from 'sonner'
import { colors, shadows } from '@/lib/tokens'
import { formInput, cancelBtn, primaryBtn, tagChip, tagTrigger, kbdBadge } from '@/lib/styles'

interface ToolFormModalProps {
  tool: Tool | null
  section: 'tools' | 'design'
  onClose: () => void
  onSaved: () => void
}

export function ToolFormModal({ tool, section: sectionProp, onClose, onSaved }: ToolFormModalProps) {
  const [form, setForm] = useState({
    url: tool?.url || '',
    name: tool?.name || '',
    description: tool?.description || '',
    tags: tool?.tags || [],
    saved_by: tool?.saved_by || 'Morva',
  })
  const [section, setSection] = useState<'tools' | 'design'>(sectionProp)
  const [saving, setSaving] = useState(false)
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [tagSearch, setTagSearch] = useState('')

  const update = (key: string, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleTag = (tag: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }))

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const sectionPresetTags = section === 'design' ? DESIGN_TAGS : PRESET_TAGS
  const allAvailableTags = Array.from(new Set([...sectionPresetTags, ...form.tags]))
  const filteredTags = allAvailableTags.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!form.url || !form.name) {
      toast.error('URL and Name are required')
      return
    }

    if (!form.tags.length) {
      toast.error('Select at least one tag')
      return
    }

    setSaving(true)
    try {
      const domain = new URL(form.url).hostname
      const payload = {
        url: form.url,
        name: form.name,
        tags: form.tags,
        description: form.description || null,
        favicon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        saved_by: form.saved_by,
        section,
      }

      if (tool) {
        const { error } = await supabase.from('tools').update(payload).eq('id', tool.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tools').insert(payload)
        if (error) throw error
      }

      onSaved()
      toast.success(tool ? 'Saved!' : 'Added!')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      toast.error('Something went wrong: ' + message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
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
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'visible',
          boxShadow: shadows.modal,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" />

        {/* ESC badge */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <div style={{ ...kbdBadge, fontSize: 10 }}>ESC</div>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 12px 20px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              color: colors.subtle,
            }}
          >
            {tool ? <Pencil size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>
            {tool ? 'Edit' : 'New'}
          </h2>

          {/* ── Section Radio ── */}
          <div style={{ display: 'inline-flex', gap: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 99, padding: 2, marginTop: 12 }}>
            {(['tools', 'design'] as const).map((sec) => {
              const isActive = section === sec
              return (
                <motion.button
                  key={sec}
                  onClick={() => { setSection(sec); setForm((f) => ({ ...f, tags: [] })) }}
                  style={{
                    padding: '0 14px',
                    height: 26,
                    borderRadius: 99,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? colors.fg : colors.subtle,
                    background: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="modal-section-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 99,
                        background: '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.10)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  )}
                  {sec === 'tools' ? 'Tool' : 'Design'}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '0 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="url"
              value={form.url}
              onChange={(e) => update('url', e.target.value)}
              placeholder="URL"
              className="form-input"
              style={formInput}
            />
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder={section === 'design' ? 'Website name' : 'Tool name'}
              className="form-input"
              style={formInput}
            />
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Notes (e.g. Great for animated background)"
              className="form-input"
              style={{ ...formInput, height: 'auto', minHeight: 140, padding: '12px', resize: 'none' }}
            />

            {/* Multi-select tags */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {form.tags.map(tag => (
                  <span key={tag} onClick={() => removeTag(tag)} style={tagChip}>
                    {tag}
                    <X size={10} strokeWidth={3} style={{ opacity: 0.4 }} />
                  </span>
                ))}
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="tag-trigger"
                  style={tagTrigger}
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Tags</span>
                </button>
              </div>

              {/* Tag Picker Dropdown */}
              <AnimatePresence>
                {showTagPicker && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                      onClick={() => setShowTagPicker(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 8px)',
                        left: 0,
                        width: 240,
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: shadows.dropdown,
                        zIndex: 100,
                        padding: 6,
                        maxHeight: 280,
                        overflowY: 'auto',
                      }}
                    >
                      <input
                        autoFocus
                        placeholder="Search or create tag..."
                        value={tagSearch}
                        onChange={e => setTagSearch(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && tagSearch && !form.tags.includes(tagSearch)) {
                            toggleTag(tagSearch)
                            setTagSearch('')
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: 'none',
                          background: '#f8f8f8',
                          borderRadius: 6,
                          fontSize: 13,
                          outline: 'none',
                          marginBottom: 6,
                          fontFamily: 'inherit',
                        }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              background: 'none',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: 13,
                              color: form.tags.includes(tag) ? colors.fg : colors.subtle,
                              transition: 'background 0.1s',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHover}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {tag}
                            {form.tags.includes(tag) && <Check size={14} strokeWidth={2.5} />}
                          </button>
                        ))}
                        {tagSearch && !allAvailableTags.includes(tagSearch) && (
                          <button
                            onClick={() => { toggleTag(tagSearch); setTagSearch('') }}
                            style={{
                              padding: '8px',
                              textAlign: 'left',
                              fontSize: 12,
                              color: colors.subtle,
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Create "{tagSearch}"
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="modal-footer"
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, padding: '16px 12px 12px' }}
        >
          <button
            onClick={onClose}
            className="modal-action-btn"
            style={cancelBtn}
            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = colors.surface}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="modal-action-btn"
            style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = 'rgba(0,0,0,0.7)' }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = 'rgba(0,0,0,0.6)' }}
          >
            <span>{saving ? 'Saving...' : tool ? 'Save Changes' : 'Add'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
