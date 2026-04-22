export interface Tool {
  id: string
  url: string
  name: string
  description: string | null
  favicon_url: string | null
  tags: string[]
  saved_by: string
  times_opened: number
  created_at: string
  image_url?: string | null
  section?: 'tools' | 'design' | null
}

export const PRESET_TAGS = [
  'Backgrounds & Textures',
  'Icons',
  'Fonts & Typography',
  'Color Tools',
  'Mockups & Prototyping',
  'Animation & Motion',
  'Stock Photos & Video',
  'CSS & Code Tools',
  'Web Inspo',
  'Product Inspo',
  'App Inspo',
  'Bento & Illustrations',
  'Brand & Logos',
] as const

export const DESIGN_TAGS = [
  'Isometric',
  'Technical',
  'Dither',
  'Standard SaaS',
  'People First',
  'Brutalism',
  'Scroll Animation',
  'Playful',
  'Narrow Layout',
  'Mobile App',
] as const
