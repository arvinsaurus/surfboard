# Surfboard Web — Project Rules

## Project Overview

Surfboard Web is a shared bookmark collection for Morva Labs. It's a Next.js 14 App Router project that connects to Supabase and syncs with a Raycast extension. The design is clean, minimal, and precise — every pixel matters.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict, no `any`)
- **Styling:** Inline styles + CSS variables (no Tailwind in this project)
- **Font:** OpenRunde (Regular 400, Medium 500, Semibold 600, Bold 700) — loaded via `@font-face` in `globals.css`
- **Icons:** `lucide-react` — use exclusively, never inline SVGs
- **Animations:** Motion for React (`motion/react`) — never `framer-motion`
- **Database:** Supabase (`@supabase/supabase-js`)
- **Deployment:** Vercel

## File Structure

```
app/
  layout.tsx          # Root layout, metadata, globals.css import
  page.tsx            # Entry — renders SurfboardShell
  globals.css         # OpenRunde @font-face, reset, keyframes
components/
  surfboard-shell.tsx # Main client shell — state, filtering, keyboard shortcuts
  sidebar.tsx         # Fixed sidebar — logo, pills, nav with animated arrows
  tool-card.tsx       # Card with OG screenshot, hover shadow, edit/delete
  search-modal.tsx    # ⌘F command palette search
  tool-form-modal.tsx # Add/Edit form modal
lib/
  supabase.ts         # Supabase client singleton
  types.ts            # Tool interface, PRESET_TAGS constant
public/
  icon.png            # Surfboard app icon (48×48, rounded corners)
  fonts/              # OpenRunde woff + woff2 files
```

## Design Principles

### 1:1 Fidelity Rule

**Match Figma designs exactly.** Never improvise spacing, swap components, or "improve" a layout unless explicitly asked. Preserve every decision: border radius, shadow, font weight, gap, color, opacity.

When translating from Figma:
- Read exact values from Figma — no guessing, no rounding
- Preserve Auto Layout hierarchy as flex containers — never flatten
- Use exact pixel values when Figma specifies them
- If ambiguous, state the assumption in one sentence and proceed

### Visual Language

- **Background:** `#ffffff`
- **Text primary:** `#111111`
- **Text secondary:** `#999999`
- **Text muted:** `#cccccc` / `#d0d0d0`
- **Border:** `rgba(0,0,0,0.04)` or `#ececec`
- **Surface:** `#f2f2f2` / `#f3f3f3` / `#fafafa`
- **Hover surface:** `#f6f6f6`
- **Danger:** `#dd4444`
- **Card resting shadow:** `0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)`
- **Card hover shadow:** `0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)`
- **Card border radius:** `10px`
- **Button/pill radius:** `8px`
- **Modal radius:** `14px`
- **Backdrop:** `rgba(0,0,0,0.18)` with `backdrop-filter: blur(3px)`

### Typography

All text uses OpenRunde. Specific weights and sizes:
- Logo title: 16px / 700
- Body text: 13px / 400
- Card title: 13px / 600
- Card description: 11.5px / 400
- Card meta: 11px / 400
- Nav items: 13px / 400 (active: 600)
- Nav count: 12px / 400, `font-variant-numeric: tabular-nums`
- Labels: 10.5px / 600, uppercase, `letter-spacing: 0.04em`
- Pill buttons: 12.5px / 500
- Footer: 11px / 400

### Spacing

- Sidebar width: `256px`, padding: `28px 20px 18px`
- Content area padding: `16px 28px 72px`
- Card grid: 3 columns, `gap: 16px`
- Card body padding: `11px 13px 13px`
- Between sidebar sections: `20–24px`

## Motion for React Rules

### Import Path — Critical

```tsx
// ✅ Always correct
import { motion, AnimatePresence } from "motion/react"

// ❌ Never use — deprecated
import { motion } from "framer-motion"
```

**Always add `"use client"`** to any file using Motion APIs.

### Animation Patterns Used

**Card entrance (staggered):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.035 }}
/>
```

**Nav arrow (show/hide):**
```tsx
<motion.span
  animate={{
    opacity: show ? 1 : 0,
    x: show ? 0 : -5,
  }}
  transition={{ duration: 0.18, ease: "easeOut" }}
/>
```

**Card hover (subtle lift):**
```tsx
<motion.div
  whileHover={{
    y: -1,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
  }}
  transition={{ duration: 0.25, ease: "easeOut" }}
/>
```

**Modal overlay:**
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    />
  )}
</AnimatePresence>
```

**Hover actions (fade in):**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.12 }}
/>
```

### Motion Rules

- `"use client"` on every file using Motion
- Wrap conditional renders with `AnimatePresence` for exit animations
- Never animate `width`/`height` directly — use `scaleX`/`scaleY` or `layout`
- Never use `framer-motion` import path
- `motion.create()` for wrapping third-party components — always at module level, never inside render
- Keep transitions subtle: 0.12–0.4s duration range
- Use `easeOut` as default easing
- Spring for interactive gestures: `{ type: "spring", stiffness: 400, damping: 20 }`

## Figma to Code Workflow

When I share a Figma frame or component:

1. **Read exact values** — spacing, colors, font sizes, border radius, shadows, opacity
2. **Map Auto Layout to flex** — preserve the nesting hierarchy
3. **Use exact measurements** — don't round to a grid unless I say so
4. **Map colors to existing tokens** — or create new CSS variables if needed
5. **Map to existing components** — check if sidebar, card, modal patterns already exist
6. **Preserve layer names** — use them as component/element names
7. **Build in one pass** — full working code, all imports, no TODOs

### Property Mapping

| Figma Property | Code Output |
|----------------|-------------|
| `fills` | CSS color variable or inline style |
| `fontFamily` + `fontWeight` + `fontSize` | OpenRunde with exact weight and px size |
| `lineHeightPx` | `lineHeight` in style object |
| `letterSpacing` | `letterSpacing` in style object |
| `paddingLeft/Right/Top/Bottom` | Exact `padding` values |
| `itemSpacing` | `gap` in flex container |
| `cornerRadius` | `borderRadius` |
| `effects` (shadows) | `boxShadow` |
| `strokes` | `border` |
| `opacity` | `opacity` |

### What NOT To Do

- Don't ignore Figma layer names — they hint at component names
- Don't eyeball values — use exact numbers
- Don't round aggressively — if Figma says 13px, use 13px
- Don't flatten nested Auto Layout into a single div
- Don't swap components — if I designed a Sheet, don't build a Dialog
- Don't "improve" the design — match it exactly, then ask if I want changes

## Supabase Schema

**Table: `tools`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key, auto-generated |
| `url` | text | Required |
| `name` | text | Required |
| `description` | text | Nullable |
| `favicon_url` | text | Nullable, auto-generated from domain |
| `tags` | text[] | Array of strings |
| `saved_by` | text | Team member name |
| `times_opened` | integer | Click counter, default 0 |
| `created_at` | timestamptz | Auto-generated |

## Code Style

- `const` always, `let` only when reassigning
- Arrow functions for callbacks and handlers
- Destructure props in function signature
- No semicolons
- Single quotes for strings
- Trailing commas
- Named exports (except `page.tsx`, `layout.tsx`)
- No `any` — define proper TypeScript interfaces
- `"use client"` only when needed (hooks, browser APIs, event handlers, Motion)
- Push `"use client"` as far down the component tree as possible

## Lucide Icons

Always import from `lucide-react`. Common icons used in this project:

```tsx
import { Search, Plus, ArrowRight, Pencil, Trash2, X } from "lucide-react"

// Usage with consistent sizing
<Search size={13} strokeWidth={2.4} />
<Plus size={14} strokeWidth={2.2} />
<ArrowRight size={13} strokeWidth={2} />
<Pencil size={12} strokeWidth={2.2} />
<Trash2 size={12} strokeWidth={2.2} />
<X size={14} strokeWidth={2} />
```

Never use inline SVGs. If a new icon is needed, find it in Lucide first.

## Keyboard Shortcuts

- `⌘F` — Open search modal
- `⌘A` — Open add tool modal
- `Escape` — Close any modal, clear search

## Layout Architecture

- **Sidebar:** Fixed position, `width: 256px`, full viewport height, non-scrolling
- **Main content:** `margin-left: 256px`, scrollable, with top/bottom gradient fades
- **Top fade:** `position: sticky`, gradient from white to transparent, `height: 32px`
- **Bottom fade:** `position: fixed`, gradient from transparent to white, `height: 52px`
- **Cards:** 3-column CSS Grid, responsive consideration for future

## OG Images

Tool cards show website screenshots via Microlink API:
```
https://api.microlink.io/?url={encoded_url}&screenshot=true&meta=false&embed=screenshot.url
```
Fallback to favicon if screenshot fails. Thumbnail aspect ratio: `16/10`.
