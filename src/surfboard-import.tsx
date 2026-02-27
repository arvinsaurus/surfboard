// surfboard-import.tsx
// Bulk import multiple URLs at once with shared tags.
// Paste URLs (one per line), pick tags, hit Enter — all saved.

import {
  Action,
  ActionPanel,
  Form,
  showToast,
  Toast,
  popToRoot,
  getPreferenceValues,
} from "@raycast/api";
import { useState } from "react";
import { supabase } from "./supabase";

const TAGS = [
  "Backgrounds & Textures",
  "Icons",
  "Fonts & Typography",
  "Color Tools",
  "Mockups & Prototyping",
  "Animation & Motion",
  "Stock Photos & Video",
  "CSS & Code Tools",
  "Web Inspo",
  "Product Inspo",
  "App Inspo",
  "Bento & Illustrations",
  "Brand & Logos",
];

export default function SurfboardImport() {
  const { memberName } = getPreferenceValues<{ memberName: string }>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: {
    urls: string;
    tags: string[];
    customTags: string;
    description: string;
  }) {
    try {
      // Combine preset tags + custom tags
      const presetTags = values.tags || [];
      const extraTags = values.customTags
        ? values.customTags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      const allTags = [...presetTags, ...extraTags];

      if (allTags.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Pick or type at least one tag",
        });
        return;
      }

      // Parse URLs — one per line, skip empty lines
      const urls = values.urls
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));

      if (urls.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: "No valid URLs found",
          message: "Paste URLs starting with http:// or https://, one per line",
        });
        return;
      }

      setIsLoading(true);

      await showToast({
        style: Toast.Style.Animated,
        title: `Importing ${urls.length} tools...`,
      });

      // Build rows for bulk insert
      const rows = urls.map((url) => {
        let domain = "";
        let name = "";
        try {
          const parsed = new URL(url);
          domain = parsed.hostname;
          // Auto-generate a name from the domain (e.g. "www.unicorn.studio" → "unicorn.studio")
          name = domain.replace(/^www\./, "");
        } catch {
          domain = url;
          name = url;
        }

        return {
          url,
          name,
          tags: allTags,
          description: values.description || null,
          favicon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
          saved_by: memberName,
        };
      });

      // Bulk insert all at once
      const { error } = await supabase.from("tools").insert(rows);

      if (error) throw error;

      setIsLoading(false);

      await showToast({
        style: Toast.Style.Success,
        title: `Imported ${urls.length} tools! 🏄`,
      });

      popToRoot();
    } catch (error) {
      setIsLoading(false);
      await showToast({
        style: Toast.Style.Failure,
        title: "Import failed",
        message: String(error),
      });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Import All" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="urls"
        title="URLs (one per line)"
        placeholder={`https://unicorn.studio\nhttps://grainrad.com\nhttps://realtime-colors.com`}
      />
      <Form.TagPicker id="tags" title="Tags for all">
        {TAGS.map((tag) => (
          <Form.TagPicker.Item key={tag} value={tag} title={tag} />
        ))}
      </Form.TagPicker>
      <Form.TextField
        id="customTags"
        title="Custom Tags (optional)"
        placeholder="e.g. Gradients, Hero Sections"
      />
      <Form.TextField
        id="description"
        title="Note for all (optional)"
        placeholder="e.g. Found these on Twitter"
      />
    </Form>
  );
}
