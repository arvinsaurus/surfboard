# 🏄 Surfboard Web

A shared bookmark collection for Morva Labs. Syncs with the Surfboard Raycast extension via Supabase.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
5. Deploy!

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

## Keyboard Shortcuts

- `⌘F` — Search
- `⌘A` — Add new tool
- `ESC` — Close modals

## Customization

- Replace `public/icon.png` with your app icon (48×48 or larger, will be rounded)
- Edit the title/subtitle in `components/sidebar.tsx`
