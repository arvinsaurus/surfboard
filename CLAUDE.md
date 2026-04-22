# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Surfboard is a collaborative team bookmarking tool for design resources — a **monorepo** with two apps sharing one Supabase database:

1. **Raycast Extension** (`/src`) — the primary product; lets teams save/search/browse tools from Raycast
2. **Web App** (`/web`) — Next.js 14 dashboard for browsing the shared library in a browser

Both apps write to the same `tools` table in Supabase. Real-time sync — no auth layer, team-access only.

## Commands

### Raycast Extension (root)
```bash
npm install
npm run dev        # Start Raycast dev mode
npm run build      # Build extension
npm run lint       # Check linting (@raycast/eslint-config)
npm run fix-lint   # Auto-fix linting issues
```

### Web App (`/web`)
```bash
cd web
npm install
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm run start      # Start production server
```

## Architecture

### Raycast Extension (`/src`)

| File | Purpose |
|------|---------|
| `surfboard-save.tsx` | Add new tool (URL, name, tags, description) |
| `surfboard-search.tsx` | Search by name/tag/description; tracks `times_opened` |
| `surfboard-browse.tsx` | Browse tools organized by tag, sorted by popularity |
| `surfboard-import.tsx` | Bulk import multiple URLs with shared tags |
| `edit-tool.tsx` | Reusable edit form component used by search and browse |
| `onboarding.tsx` | First-run setup: collect team member name + hotkey guidance |
| `supabase.ts` | Supabase client (hardcoded anon key, team-shared) |

**Tech:** `@raycast/api`, `@raycast/utils`, `@supabase/supabase-js`, TypeScript

**Onboarding flow:** Saves `memberName` and `onboardingComplete` to Raycast LocalStorage. The `surfboard-search.tsx` and `surfboard-save.tsx` commands check for `onboardingComplete` and redirect if not set.

### Web App (`/web`)

See **`web/claude.md`** for the complete design system, token reference, and animation patterns. Summary:

- **Framework:** Next.js 14 App Router, TypeScript strict mode
- **Styling:** Inline `style={{}}` objects + CSS variables — **no Tailwind**
- **Font:** OpenRunde (400/500/600/700) via `@font-face` in `globals.css`
- **Icons:** `lucide-react` exclusively — never inline SVGs
- **Animations:** `import { motion, AnimatePresence } from "motion/react"` — **never `framer-motion`**
- **Toasts:** `sonner` (rendered in `layout.tsx`, bottom-right)
- **Deployment:** Vercel (`/.vercel/`)

#### State Management

All state lives in `SurfboardShell` (`components/surfboard-shell.tsx`). No Redux, Zustand, or Context — direct Supabase calls + local `useState`. Child components receive data and callbacks as props.

**Shell state variables:**

| State | Type | Purpose |
|-------|------|---------|
| `tools` | `Tool[]` | Full list fetched from Supabase, ordered by `created_at` DESC |
| `loading` | `boolean` | Initial fetch indicator |
| `search` | `string` | Active search query |
| `activeTag` | `string \| null` | Currently selected sidebar tag |
| `showAdd` | `boolean` | Controls add-tool modal visibility |
| `editTool` | `Tool \| null` | Tool being edited (null = closed) |
| `deleteTool` | `Tool \| null` | Tool pending deletion confirmation |
| `deleting` | `boolean` | Delete-in-progress indicator |
| `searchOpen` | `boolean` | Controls search modal visibility |
| `mobileMenuOpen` | `boolean` | Mobile sidebar drawer state |
| `viewMode` | `'grid' \| 'list'` | Card layout mode |
| `isScrolled` | `boolean` | True when main content area is scrolled > 0 |

#### Component Roles

| File | Purpose |
|------|---------|
| `surfboard-shell.tsx` | Main orchestrator: fetches tools, manages all state, keyboard shortcuts, modal state, tag filtering |
| `sidebar.tsx` | Fixed 256px tag nav; branding, action pills, tag list with counts, view toggle |
| `tool-card.tsx` | Card with OG screenshot (Microlink API → fallback), hover edit/delete; supports grid + list modes |
| `search-modal.tsx` | `/` key command palette; filters up to 8 results |
| `tool-form-modal.tsx` | Add/Edit form with inline tag creation; validates URL, name, and at least 1 tag |
| `delete-confirm-modal.tsx` | Confirmation dialog before deleting a tool |
| `lib/types.ts` | `Tool` interface and `PRESET_TAGS` constant (13 categories) |
| `lib/supabase.ts` | Singleton Supabase client (reads from env vars) |

#### Tag Filtering Logic

- **Preset tags** (from `PRESET_TAGS`): shown individually in sidebar with counts
- **Custom tags** (not in `PRESET_TAGS`): grouped under an "Others" pill in sidebar
- `othersCount` = number of tools with at least one custom tag
- Filtering is AND across all search terms (multi-word search is additive)

#### OG Images

Tool cards show website screenshots via Microlink API:
```
https://api.microlink.io/?url={encoded_url}&screenshot=true&meta=false&embed=screenshot.url
```
Falls back to favicon if screenshot fails. Thumbnail aspect ratio: `16/10`.

`next.config.js` allows remote images from `www.google.com` (favicons) and `api.microlink.io`.

### Database (`tools` table)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `url` | text | Required |
| `name` | text | Required |
| `description` | text | Nullable |
| `favicon_url` | text | Nullable, auto-generated from domain |
| `tags` | text[] | Array of strings |
| `saved_by` | text | Team member name |
| `times_opened` | integer | Click counter, default 0 |
| `created_at` | timestamptz | Auto-generated |
| `image_url` | text | Optional, for manual image override |

### Environment Variables (web)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The Raycast extension hardcodes these values directly in `src/supabase.ts`.

## Design System (Web)

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#ffffff` | Page, cards |
| Text primary | `#111111` | Headings, titles |
| Text secondary | `#999999` | Descriptions, meta |
| Text muted | `#cccccc` / `#d0d0d0` | Placeholders |
| Border | `rgba(0,0,0,0.04)` / `#ececec` | Card outlines |
| Surface | `#f2f2f2` / `#f3f3f3` / `#fafafa` | Pills, inputs |
| Hover surface | `#f6f6f6` | Interactive hover states |
| Danger | `#dd4444` | Delete buttons |
| Card resting shadow | `0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)` | Default card |
| Card hover shadow | `0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)` | Hovered card |

### Border Radius

- Cards: `10px`
- Buttons/pills: `8px`
- Modals: `14px`
- Backdrop: `rgba(0,0,0,0.18)` with `backdrop-filter: blur(3px)`

### Typography (all OpenRunde)

| Element | Size | Weight |
|---------|------|--------|
| Logo title | 16px | 700 |
| Body text | 13px | 400 |
| Card title | 13px | 600 |
| Card description | 11.5px | 400 |
| Card meta | 11px | 400 |
| Nav items | 13px | 400 (active: 600) |
| Nav count | 12px | 400, `font-variant-numeric: tabular-nums` |
| Labels | 10.5px | 600, uppercase, `letter-spacing: 0.04em` |
| Pill buttons | 12.5px | 500 |
| Footer | 11px | 400 |

### Spacing

- Sidebar: `width: 256px`, `padding: 28px 20px 18px`
- Content area: `padding: 16px 28px 72px`
- Card grid: 3 columns, `gap: 16px`
- Card body: `padding: 11px 13px 13px`
- Between sidebar sections: `20–24px`

### Layout

- **Sidebar:** Fixed position, `width: 256px`, full viewport height, non-scrolling
- **Main content:** `margin-left: 256px`, scrollable via `mainRef`
- **Top fade:** Sticky gradient from white to transparent, `height: 32px`
- **Bottom fade:** Fixed, gradient from transparent to white, `height: 52px`
- **Responsive:** 3→2→1 column grid; mobile uses bottom bar + sidebar drawer + bottom-sheet modals

### Lucide Icons (consistent sizing)

```tsx
import { Search, Plus, ArrowRight, Pencil, Trash2, X } from 'lucide-react'

<Search size={13} strokeWidth={2.4} />
<Plus size={14} strokeWidth={2.2} />
<ArrowRight size={13} strokeWidth={2} />
<Pencil size={12} strokeWidth={2.2} />
<Trash2 size={12} strokeWidth={2.2} />
<X size={14} strokeWidth={2} />
```

## Animation Patterns (motion/react)

### Card entrance (staggered)
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.035 }}
/>
```

### Card hover (subtle lift)
```tsx
<motion.div
  whileHover={{ y: -1, boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
/>
```

### Nav arrow (show/hide)
```tsx
<motion.span
  animate={{ opacity: show ? 1 : 0, x: show ? 0 : -5 }}
  transition={{ duration: 0.18, ease: 'easeOut' }}
/>
```

### Modal overlay
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

### Motion rules
- `"use client"` on every file using Motion APIs
- Wrap conditional renders with `AnimatePresence` for exit animations
- Never animate `width`/`height` directly — use `scaleX`/`scaleY` or `layout`
- `motion.create()` for third-party component wrapping — always at module level, never inside render
- Duration range: `0.12–0.4s`; default easing: `easeOut`
- Spring for interactive gestures: `{ type: 'spring', stiffness: 400, damping: 20 }`

## Critical Rules

- **Motion import:** Always `from "motion/react"`, never `"framer-motion"`
- **`"use client"`** required on any file using Motion, hooks, or browser APIs — push as far down tree as possible
- **No Tailwind** in web app — use inline style objects with exact pixel values
- **Named exports** everywhere except `page.tsx` and `layout.tsx`
- **No `any`** — define proper TypeScript interfaces
- **Code style:** no semicolons, single quotes, trailing commas, `const` always
- **Icons:** `lucide-react` exclusively — never inline SVGs
- **No improvising design** — match exact pixel values; when in doubt, state the assumption

## Keyboard Shortcuts (Web)

| Shortcut | Action |
|----------|--------|
| `/` | Open search modal |
| `S` | Open add tool modal |
| `Escape` | Close any open modal / clear search |

> Note: The search shortcut was changed from `⌘F` to `/` — any older references to `⌘F` in comments or docs are stale.
