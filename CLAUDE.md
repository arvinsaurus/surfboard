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
- `surfboard-save.tsx` — Add new tool (URL, name, tags, description)
- `surfboard-search.tsx` — Search by name/tag/description
- `surfboard-browse.tsx` — Browse organized by tag category
- `surfboard-import.tsx` — Bulk import multiple URLs
- `edit-tool.tsx` — Reusable edit form component
- `supabase.ts` — Supabase client (hardcoded anon key, team-shared)

Tech: `@raycast/api`, `@raycast/utils`, `@supabase/supabase-js`, TypeScript

### Web App (`/web`)
See **`web/claude.md`** for complete design rules, token system, and animation patterns. Summary:

- **Framework:** Next.js 14 App Router, TypeScript strict mode
- **Styling:** Inline `style={{}}` objects + CSS variables — **no Tailwind**
- **Font:** OpenRunde via `@font-face` in `globals.css`
- **Icons:** `lucide-react` exclusively — never inline SVGs
- **Animations:** `import { motion, AnimatePresence } from "motion/react"` — **never `framer-motion`**
- **Toasts:** `sonner`

#### State Management
All state lives in `SurfboardShell` (`components/surfboard-shell.tsx`). No Redux, Zustand, or Context — direct Supabase calls + local `useState`. Child components receive data and callbacks as props.

#### Component Roles
- `surfboard-shell.tsx` — Main orchestrator: fetches tools, manages filtering, keyboard shortcuts, modal state
- `sidebar.tsx` — Fixed 256px tag nav; tag list with counts + action pills
- `tool-card.tsx` — Card with OG screenshot (Microlink API → favicon fallback), hover edit/delete
- `search-modal.tsx` — `⌘F` command palette
- `tool-form-modal.tsx` — Add/Edit form with inline tag creation
- `lib/types.ts` — `Tool` interface and `PRESET_TAGS` constant (13 categories)
- `lib/supabase.ts` — Singleton Supabase client

### Database (`tools` table)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `url` | text | Required |
| `name` | text | Required |
| `description` | text | Nullable |
| `favicon_url` | text | Auto-generated from domain |
| `tags` | text[] | Array of strings |
| `saved_by` | text | Team member name |
| `times_opened` | integer | Click counter, default 0 |
| `created_at` | timestamptz | Auto-generated |

### Environment Variables (web)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Critical Rules

- **Motion import:** Always `from "motion/react"`, never `"framer-motion"`
- **`"use client"`** required on any file using Motion, hooks, or browser APIs — push as far down tree as possible
- **No Tailwind** in web app — use inline style objects with exact pixel values
- **Named exports** everywhere except `page.tsx` and `layout.tsx`
- **No `any`** — define proper TypeScript interfaces
- **Code style:** no semicolons, single quotes, trailing commas, `const` always

## Keyboard Shortcuts (Web)

- `⌘F` — Open search modal
- `S` — Open add tool modal
- `Escape` — Close any modal / clear search
