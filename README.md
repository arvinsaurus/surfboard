# 🏄 Surfboard

**The shared design toolkit that surfaces tools — right when you need them.**

Surfboard is a collaborative Raycast extension designed to solve the "bookmark graveyard" problem. Stop losing the amazing tools you discover. Save them to a shared team library, tag them by intent (what you're currently building), and recall them instantly with a keystroke.

---

## 🚀 Speed thru Setup (5 mins)

Since we've shared the code and backend, all you need to do is install the Raycast environment on your Mac.

### 1. Prerequisites
You need these two things installed:
- **Raycast**: Download at [raycast.com](https://raycast.com)
- **Node.js**: Open your Terminal and run:
  ```bash
  brew install node
  ```
  *(If you don't have Homebrew, [install it first](https://brew.sh))*

### 2. Connect to the Team Brain
Open your Terminal and run these commands:
```bash
# Clone the shared repo
git clone https://github.com/arvinsaurus/surfboard.git
cd surfboard

# Install the extension
npm install

# Start it up
npm run dev
```

### 3. Final Step
Raycast will pop up and ask for **"Your Name"**. Type your name (e.g., Alex) so the team knows who saved what!

---

## 🛠 How to Use

### ➕ Add a tool
Open Raycast → type **"Add to Surfboard"**
- Paste a URL (it auto-fetches the icon)
- Pick intent tags (e.g., "Backgrounds", "Bento")
- Add a custom tag if you have a specific niche

### 🔍 Recall a tool (Search)
Open Raycast → type **"Surfboard Search"**
- **Search by Name**: Type "Unicorn" or "Grain"
- **Search by Intent**: Type "background" or "svg" to see everything tagged that way.
- **Search by Tag**: Typing "Bento" will show every tool in the bento category.

### 🍱 Browse everything
Open Raycast → type **"Surfboard Browse"**
- See the entire library organized into sections by tag.
- Great for when you're just looking for inspiration.

### ⚡️ Bulk Import
Open Raycast → type **"Surfboard Import"**
- Paste a list of URLs (one per line).
- Tag them all at once—perfect for moving whole bookmark folders in seconds.

---

## 🔥 Pro Tips

- **Hotkey Hero**: Set a hotkey (like `Cmd + Shift + S`) for **Surfboard Search**. It makes the library feel like a native part of your Mac.
- **Edit & Delete**: Highlight any tool in the list and press **`Cmd + E`** to edit its tags or name. Use **`Ctrl + X`** if you need to delete a dead link.
- **Discover**: The Browse list shows you who saved what. Check it once a week to see what new tools your teammates are using.

---

## 🏷 Intent Tags
Use these tags to keep our toolkit organized:

| Tag | Use it for... |
|-----|---------------|
| **Backgrounds & Textures** | Patterns, noise, gradients, canvas textures |
| **Icons** | SVG libraries, icon sets, icon generators |
| **Fonts & Typography** | Font pairings, type testers, foundry sites |
| **Color Tools** | Palette generators, contrast checkers, mesh gradients |
| **Mockups & Prototyping** | Device mockups, 3D assets, prototype tools |
| **Animation & Motion** | Lottie, CSS animation, easing tools |
| **Stock Photos & Video** | High-quality media libraries |
| **CSS & Code Tools** | Flexbox/Grid helpers, CSS snippets |
| **Web Inspo** | Landing pages, marketing site galleries |
| **Product Inspo** | App UI patterns, dashboard references |
| **App Inspo** | Mobile/Desktop interaction flows, OS patterns |
| **Bento & Illustrations** | Grid-style layouts, illustration libraries |
| **Brand & Logos** | Brand guidelines, logo marks, brand assets |
| **Other** | Anything else worth remembering! |
