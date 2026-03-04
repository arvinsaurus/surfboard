// surfboard-save.tsx
// This command lets you save a new tool to Surfboard.
// It shows a form with fields for URL, name, tags, and a note.

import { Action, ActionPanel, Form, LocalStorage, showToast, Toast, popToRoot } from '@raycast/api'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Onboarding } from './onboarding'

const TAGS = [
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
]

export default function SurfboardSave() {
  const [memberName, setMemberName] = useState<string | null>(null)
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)

  useEffect(() => {
    async function check() {
      const done = await LocalStorage.getItem<string>('onboardingComplete')
      const name = await LocalStorage.getItem<string>('memberName')
      setOnboardingDone(done === 'true')
      setMemberName(name || null)
    }
    check()
  }, [])

  async function handleSubmit(values: {
    url: string
    name: string
    tags: string[]
    customTags: string
    description: string
  }) {
    try {
      const presetTags = values.tags || []
      const extraTags = values.customTags
        ? values.customTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      const allTags = [...presetTags, ...extraTags]

      if (allTags.length === 0) {
        await showToast({ style: Toast.Style.Failure, title: 'Pick or type at least one tag' })
        return
      }

      const domain = new URL(values.url).hostname
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

      const { error } = await supabase.from('tools').insert({
        url: values.url,
        name: values.name,
        tags: allTags,
        description: values.description || null,
        favicon_url: faviconUrl,
        saved_by: memberName || 'Unknown',
      })

      if (error) throw error

      await showToast({
        style: Toast.Style.Success,
        title: 'Saved! 🏄',
        message: `${values.name} saved with ${allTags.length} tag${allTags.length > 1 ? 's' : ''}`,
      })

      popToRoot()
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: 'Failed to save', message: String(error) })
    }
  }

  if (onboardingDone === null) return null

  if (!onboardingDone) {
    return (
      <Onboarding
        onComplete={(name) => {
          setMemberName(name)
          setOnboardingDone(true)
        }}
      />
    )
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save to Surfboard" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="url" title="URL" placeholder="https://unicorn.studio" />
      <Form.TextField id="name" title="Tool Name" placeholder="Unicorn Studio" />
      <Form.TagPicker id="tags" title="Tags">
        {TAGS.map((tag) => (
          <Form.TagPicker.Item key={tag} value={tag} title={tag} />
        ))}
      </Form.TagPicker>
      <Form.TextField
        id="customTags"
        title="Custom Tags (optional)"
        placeholder="e.g. Gradients, Hero Sections, WebGL"
      />
      <Form.TextArea
        id="description"
        title="Quick Note (optional)"
        placeholder="Great for animated gradient backgrounds"
      />
    </Form>
  )
}
