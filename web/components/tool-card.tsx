'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'
import { Tool } from '@/lib/types'

const FG = 'rgba(0,0,0,0.70)'
const SUBTLE = 'rgba(0,0,0,0.50)'

interface ToolCardProps {
  tool: Tool
  index: number
  onDelete: (tool: Tool) => void
  onEdit: (tool: Tool) => void
  onOpen: (tool: Tool) => void
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function ToolCard({ tool, index, onDelete, onEdit, onOpen }: ToolCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const domain = getDomain(tool.url)

  const screenshotUrl = tool.image_url || `https://api.microlink.io/?url=${encodeURIComponent(tool.url)}&screenshot=true&meta=false&embed=screenshot.url`

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
                src={
                  tool.favicon_url ||
                  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                }
                alt=""
                style={{ width: 16, height: 16, borderRadius: 3 }}
                onError={(e) => {
                  ; (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: FG,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                }}
              >
                {domain}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '11px 13px 13px' }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: FG,
              lineHeight: 1.35,
              marginBottom: 2,
            }}
          >
            {tool.name}
          </h3>
          {tool.description && (
            <p
              style={{
                fontSize: 13,
                color: SUBTLE,
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

          <p style={{ fontSize: 11, color: SUBTLE }}>Saved by {tool.saved_by}</p>
        </div>
      </a>

      {/* Hover actions */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            display: 'flex',
            gap: 3,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit(tool)
            }}
            style={actionBtnStyle}
            title="Edit"
          >
            <Pencil size={12} strokeWidth={2.2} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(tool)
            }}
            style={{ ...actionBtnStyle, color: '#d44' }}
            title="Delete"
          >
            <Trash2 size={12} strokeWidth={2.2} />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

const actionBtnStyle: React.CSSProperties = {
  width: 25,
  height: 25,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(0,0,0,0.05)',
  color: SUBTLE,
  cursor: 'pointer',
  padding: 0,
}
