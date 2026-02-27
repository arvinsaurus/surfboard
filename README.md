# 🏄 Surfboard

**It surfaces things — right when you need them.**

Surfboard is a shared Raycast extension for our design team. Save tools you discover, tag them by when you'd need them, and find them instantly — so nothing we find ever gets forgotten again.

---

## What It Does

Ever found an amazing design tool, bookmarked it, and completely forgot it existed three weeks later? That's what Surfboard fixes.

- **Save** tools with intent-based tags like "Backgrounds & Textures" or "Animation & Motion"
- **Search** by typing what you need — "background", "icons", "fonts" — and your team's saved tools appear
- **Browse** your entire shared toolkit organized by tag
- **See who saved what** and how popular each tool is across the team

Everything is shared. When one person saves a tool, everyone on the team can find it.

---

## Install (5 minutes)

### Prerequisites

You need two things on your Mac:

1. **Raycast** — download from [raycast.com](https://raycast.com) if you don't have it
2. **Node.js** — install it by running these in your terminal:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Then follow any PATH instructions it gives you, then:
   ```bash
   brew install node
   ```

### Setup

1. **Clone this repo:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/surfboard-extension.git
   cd surfboard-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the extension:**
   ```bash
   npm run dev
   ```

4. **Raycast will ask for your name** the first time you open any Surfboard command. Type it and you're in.

That's it. You're on the team.

---

## How to Use

### Save a tool

1. Open Raycast → type **"Surfboard Save"**
2. Paste the URL
3. Give it a name
4. Pick one or more tags (and add custom tags if you want)
5. Add an optional note
6. Press Enter

### Find a tool

1. Open Raycast → type **"Surfboard Search"**
2. Type what you need: "background", "gradient", "icons", whatever
3. Press Enter to open it in your browser

### Browse all tools

1. Open Raycast → type **"Surfboard Browse"**
2. Scroll through tools organized by tag

### Pro tip

Set a hotkey for Surfboard Search so it's truly one keystroke away:
Raycast Settings (Cmd + ,) → Extensions → Surfboard → Surfboard Search → set a Hotkey

---

## Updating

When the extension gets updated, just pull and restart:

```bash
git pull
npm install
npm run dev
```

---

## Tags

These are the built-in tags. You can also add custom tags when saving.

| Tag | Use it when you need... |
|-----|------------------------|
| Backgrounds & Textures | Background patterns, gradients, textures |
| Icons & Illustrations | Icon sets, illustration libraries |
| Fonts & Typography | Font tools, type pairings, font libraries |
| Color Tools | Color palettes, gradient generators |
| Mockups & Prototyping | Mockup generators, prototyping tools |
| Animation & Motion | Animation libraries, motion tools |
| Stock Photos & Video | Free/paid stock media |
| CSS & Code Tools | CSS generators, code utilities |
| Inspiration & References | Design galleries, inspiration sites |
| Other | Everything else |
