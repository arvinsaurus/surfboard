# 🏄 Surfboard

**Your team's shared design toolkit — always one keystroke away.**

Ever found an incredible design tool, bookmarked it, and completely forgot it existed two weeks later? Surfboard fixes that. It's a collaborative Raycast extension that turns your team's scattered bookmarks into a shared, searchable library — organized by *when you'd need them*, not just what they're called.

> *"You've already found the perfect tool for this — you just don't remember it."*

---

## Why Surfboard?

| The Problem | Surfboard's Fix |
|---|---|
| You bookmark a great tool but forget it exists | Tag it by intent — search "background" and it's right there |
| Your teammate found the tool you need, but you don't know that | Everything is shared — one person saves it, everyone has it |
| Bookmarks are flat, unsearchable, and lifeless | Browse by category, search by intent, recall in 2 seconds |

---

## 🚀 Setup (5 minutes)

### Prerequisites

- **[Raycast](https://raycast.com)** — installed on your Mac
- **Node.js** — run `brew install node` in Terminal
  *(No Homebrew? Run this first: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)*

### Install

```bash
git clone https://github.com/arvinsaurus/surfboard.git
cd surfboard
npm install
npm run dev
```

That's it. Raycast will ask for **your name** — type it so the team knows who saved what. You're in. 🤙

---

## 🛠 Commands

| Command | What it does |
|---|---|
| **Add to Surfboard** | Save a new tool with tags and a note |
| **Surfboard Search** | Find tools by name, description, or tag |
| **Surfboard Browse** | See everything organized by category |
| **Surfboard Import** | Bulk-import a list of URLs in one go |

### ➕ Add a Tool
`Raycast → "Add to Surfboard"`
1. Paste the URL (favicon loads automatically)
2. Name it
3. Pick tags from the list — or type your own custom ones
4. Add an optional note (e.g., *"amazing for hero sections"*)

### 🔍 Search
`Raycast → "Surfboard Search"`
- Type what you *need*, not what you *remember*
- `"background"` → shows everything tagged Backgrounds & Textures
- `"bento"` → shows every tool in the Bento category
- `"unicorn"` → finds Unicorn Studio by name
- Works across names, descriptions, and tags simultaneously

### 🍱 Browse
`Raycast → "Surfboard Browse"`
- Every tool organized into sections by tag
- See who saved what and spot tools you didn't know existed

### ⚡ Bulk Import
`Raycast → "Surfboard Import"`
- Paste multiple URLs (one per line)
- Tag them all at once — great for migrating entire bookmark folders

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Open tool in browser |
| `Cmd + E` | Edit a tool's name, tags, or notes |
| `Cmd + C` | Copy URL to clipboard |
| `Ctrl + X` | Delete a tool (with confirmation) |

> **Pro tip:** Set a hotkey for Surfboard Search in **Raycast Settings → Extensions → Surfboard → Surfboard Search → Hotkey** (e.g., `Cmd + Shift + S`). One keystroke and you're searching.

---

## 🏷 Tags

These are the built-in intent tags. You can also create custom tags when saving.

| Tag | When you need... |
|---|---|
| Backgrounds & Textures | Patterns, noise, gradients, canvas textures |
| Icons | SVG libraries, icon sets, icon generators |
| Fonts & Typography | Font pairings, type testers, foundry sites |
| Color Tools | Palette generators, contrast checkers, mesh gradients |
| Mockups & Prototyping | Device mockups, 3D scenes, prototype tools |
| Animation & Motion | Lottie, CSS animation, scroll effects, easing |
| Stock Photos & Video | High-quality photo and video libraries |
| CSS & Code Tools | Flexbox/Grid helpers, CSS generators, snippets |
| Web Inspo | Landing pages, marketing sites, web galleries |
| Product Inspo | SaaS UI patterns, dashboard references |
| App Inspo | Mobile and desktop interaction flows |
| Bento & Illustrations | Grid layouts, bento-style designs, illustration sets |
| Brand & Logos | Brand guidelines, logo inspiration, identity assets |
| Other | Everything else worth remembering |

---

## 🔄 Staying Updated

When the extension gets an update, just pull and restart:

```bash
cd surfboard
git pull
npm install
npm run dev
```

---

## 🧠 How It Works Under the Hood

- **Frontend:** Raycast extension built with React + TypeScript
- **Backend:** Supabase (hosted Postgres) — shared database, no setup needed for teammates
- **Sync:** Real-time — save a tool and your teammate sees it immediately
- **Auth:** None needed — if you have the extension, you're on the team

---

*Built for designers who keep finding amazing tools and then forgetting they exist.*
*Surfboard — because the best tools shouldn't stay buried.* 🏄‍♂️
