'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Check, Pencil } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Tool, PRESET_TAGS } from '@/lib/types'
import { toast } from 'sonner'

const FG = 'rgba(0,0,0,0.85)'
const SUBTLE = 'rgba(0,0,0,0.45)'

interface ToolFormModalProps {
  tool: Tool | null
  onClose: () => void
  onSaved: () => void
}

export function ToolFormModal({ tool, onClose, onSaved }: ToolFormModalProps) {
  const [form, setForm] = useState({
    url: tool?.url || '',
    name: tool?.name || '',
    description: tool?.description || '',
    tags: tool?.tags || [],
    saved_by: tool?.saved_by || 'Morva',
  })
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

  const allAvailableTags = Array.from(new Set([...PRESET_TAGS, ...form.tags]))
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
      }

      if (tool) {
        const { error } = await supabase.from('tools').update(payload).eq('id', tool.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tools').insert(payload)
        if (error) throw error
      }

      onSaved()
      toast.success(tool ? 'Tool updated!' : 'Tool added to Surfboard!')
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
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
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'visible',
          boxShadow: '0 16px 48px 0 rgba(0, 0, 0, 0.10)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" />
        {/* Header Overlay (ESC) */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: SUBTLE,
              background: '#f2f2f2',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2px 6px',
              borderRadius: 4,
              letterSpacing: '0.02em',
            }}
          >
            ESC
          </div>
        </div>

        {/* Centered Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 12px 20px',
          }}
        >
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
              color: SUBTLE,
            }}
          >
            {tool ? (
              <Pencil size={14} strokeWidth={1.5} />
            ) : (
              <Plus size={14} strokeWidth={1.5} />
            )}
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>
            {tool ? 'Edit Tool' : 'New Tool'}
          </h2>
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
              style={inputStyle}
            />

            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Tool name"
              className="form-input"
              style={inputStyle}
            />

            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Notes (e.g. Great for animated background)"
              className="form-input"
              style={{ ...inputStyle, height: 'auto', minHeight: 140, padding: '12px', resize: 'none' }}
            />

            {/* Notion Style Multi-select */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => removeTag(tag)}
                    style={{
                      background: '#f2f2f2',
                      padding: '0 10px',
                      height: 24,
                      borderRadius: 6,
                      fontSize: 13,
                      color: FG,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {tag}
                    <X size={10} strokeWidth={3} style={{ opacity: 0.4 }} />
                  </span>
                ))}
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="tag-trigger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 8,
                    border: '1.5px dashed #ddd',
                    background: 'none',
                    color: SUBTLE,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Tags</span>
                </button>
              </div>

              {/* Tag Picker Dropdown */}
              {showTagPicker && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                    onClick={() => setShowTagPicker(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: 0,
                      width: 240,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                      zIndex: 100,
                      padding: 6,
                      maxHeight: 280,
                      overflowY: 'auto'
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
                        marginBottom: 6
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
                            color: form.tags.includes(tag) ? FG : SUBTLE,
                            transition: 'background 0.1s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#EEEEEE'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          {tag}
                          {form.tags.includes(tag) && <Check size={14} strokeWidth={2.5} />}
                        </button>
                      ))}
                      {tagSearch && !allAvailableTags.includes(tagSearch) && (
                        <button
                          onClick={() => {
                            toggleTag(tagSearch)
                            setTagSearch('')
                          }}
                          style={{
                            padding: '8px',
                            textAlign: 'left',
                            fontSize: 12,
                            color: SUBTLE,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Create "{tagSearch}"
                        </button>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
            padding: '16px 12px 12px',
          }}
        >
          <button
            onClick={onClose}
            style={cancelBtnStyle}
            onMouseEnter={e => e.currentTarget.style.background = '#EEEEEE'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              ...saveBtnStyle,
              opacity: saving ? 0.6 : 1,
            }}
            onMouseEnter={e => {
              if (!saving) e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
            }}
            onMouseLeave={e => {
              if (!saving) e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
            }}
          >
            <span>{saving ? 'Saving...' : tool ? 'Save Changes' : 'Add to Surfboard'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f5f5f5',
  border: 'none',
  borderRadius: 8,
  height: 30,
  padding: '0 12px',
  color: FG,
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
}

const cancelBtnStyle: React.CSSProperties = {
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
}

const saveBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 30,
  padding: '0 10px',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: 99,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}
