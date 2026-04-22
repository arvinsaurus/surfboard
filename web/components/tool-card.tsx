'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'
import { Tool } from '@/lib/types'
import { colors } from '@/lib/tokens'
import { iconBtn, iconBtnGlass, tagBadge } from '@/lib/styles'

interface ToolCardProps {
  tool: Tool
  index: number
  onDelete: (tool: Tool) => void
  onEdit: (tool: Tool) => void
  onOpen: (tool: Tool) => void
  viewMode?: 'grid' | 'list'
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function ToolCard({ tool, index, onDelete, onEdit, onOpen, viewMode = 'grid' }: ToolCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [swiped, setSwiped] = useState(false)
  const swipeX = useMotionValue(0)
  const domain = getDomain(tool.url)

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches)
  }, [])

  const screenshotUrl = tool.image_url || `https://api.microlink.io/?url=${encodeURIComponent(tool.url)}&screenshot=true&meta=false&embed=screenshot.url`
  const faviconUrl = tool.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: hasEntered ? 0 : index * 0.02 }}
        onAnimationComplete={() => setHasEntered(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Swipe-to-reveal actions — mobile only */}
        <div
          className="list-swipe-actions"
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'none', zIndex: 0 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              animate(swipeX, 0, { type: 'spring', stiffness: 300, damping: 30 })
              setSwiped(false)
              onEdit(tool)
            }}
            style={swipeEditBtnStyle}
          >
            <Pencil size={15} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              animate(swipeX, 0, { type: 'spring', stiffness: 300, damping: 30 })
              setSwiped(false)
              onDelete(tool)
            }}
            style={swipeDeleteBtnStyle}
          >
            <Trash2 size={15} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Delete</span>
          </button>
        </div>

        <motion.a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (swiped) {
              e.preventDefault()
              animate(swipeX, 0, { type: 'spring', stiffness: 300, damping: 30 })
              setSwiped(false)
              return
            }
            onOpen(tool)
          }}
          drag="x"
          dragConstraints={{ right: 0, left: -144 }}
          dragElastic={{ left: 0.18, right: 0.05 }}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 28 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) {
              animate(swipeX, -144, { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 })
              setSwiped(true)
            } else {
              animate(swipeX, 0, { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 })
              setSwiped(false)
            }
          }}
          animate={{ backgroundColor: hovered && !isMobile ? '#f6f6f6' : '#ffffff' }}
          transition={{ duration: 0.12 }}
          style={{
            x: swipeX,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 8px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Index */}
          <span
            style={{
              fontSize: 11,
              color: colors.muted,
              fontVariantNumeric: 'tabular-nums',
              minWidth: 18,
              textAlign: 'right',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {index + 1}
          </span>

          {/* Favicon */}
          <img
            src={faviconUrl}
            alt=""
            width={20}
            height={20}
            style={{ borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.fg,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tool.name}
              </span>
              {tool.description && (
                <span
                  className="list-row-desc"
                  style={{
                    fontSize: 11.5,
                    color: colors.subtle,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                  }}
                >
                  · {tool.description}
                </span>
              )}
            </div>
            {/* Mobile: description + tags stacked */}
            <div className="list-row-mobile-sub" style={{ display: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 3, marginTop: 3 }}>
              {tool.description && (
                <span style={{ fontSize: 11.5, color: colors.subtle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                  {tool.description}
                </span>
              )}
              {(tool.tags || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {(tool.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} style={{ ...tagBadge, fontSize: 10 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags → replaced by edit/delete on hover */}
          <div className="list-row-right" style={{ display: 'flex', flexShrink: 0, height: 25, alignItems: 'center' }}>
            {hovered ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                style={{ display: 'flex', gap: 3 }}
              >
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(tool) }}
                  style={iconBtn}
                  title="Edit"
                >
                  <Pencil size={12} strokeWidth={2.2} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(tool) }}
                  style={{ ...iconBtn, color: colors.danger }}
                  title="Delete"
                >
                  <Trash2 size={12} strokeWidth={2.2} />
                </button>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', gap: 4 }}>
                {(tool.tags || []).slice(0, 2).map((tag) => (
                  <span key={tag} style={tagBadge}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </motion.a>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: hasEntered ? 0.15 : 0.4,
            ease: 'easeOut',
            delay: hasEntered ? 0 : index * 0.035,
          },
        },
        hover: {
          y: -2,
          boxShadow: '0 6px 18px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.10)',
          transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
        },
      }}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onAnimationComplete={() => setHasEntered(true)}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onOpen(tool)}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/10',
            background: '#f2f2f2',
            overflow: 'hidden',
          }}
        >
          {imgOk ? (
            <img
              src={screenshotUrl}
              alt={tool.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/assets/ocean_fallback.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <img
                src={tool.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt=""
                style={{ width: 16, height: 16, borderRadius: 3 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <span style={{ fontSize: 11, color: colors.fg, fontWeight: 600, letterSpacing: '0.01em' }}>
                {domain}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '11px 13px 13px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.fg, lineHeight: 1.35, marginBottom: 2 }}>
            {tool.name}
          </h3>
          {tool.description && (
            <p
              style={{
                fontSize: 13,
                color: colors.subtle,
                lineHeight: 1.5,
                marginBottom: 10,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}
            >
              {tool.description}
            </p>
          )}
          <p style={{ fontSize: 11, color: colors.subtle }}>Saved by {tool.saved_by}</p>
        </div>
      </a>

      {/* Hover actions */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          style={{ position: 'absolute', top: 7, right: 7, display: 'flex', gap: 3 }}
        >
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(tool) }}
            style={iconBtnGlass}
            title="Edit"
          >
            <Pencil size={12} strokeWidth={2.2} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(tool) }}
            style={{ ...iconBtnGlass, color: colors.danger }}
            title="Delete"
          >
            <Trash2 size={12} strokeWidth={2.2} />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

const swipeEditBtnStyle: React.CSSProperties = {
  width: 72,
  height: '100%',
  background: '#ebebeb',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  color: colors.fg,
  cursor: 'pointer',
}

const swipeDeleteBtnStyle: React.CSSProperties = {
  width: 72,
  height: '100%',
  background: '#ff3b30',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  color: '#fff',
  cursor: 'pointer',
}
