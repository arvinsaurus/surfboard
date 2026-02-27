// surfboard-save.tsx
// This command lets you save a new tool to Surfboard.
// It shows a form with fields for URL, name, tags, and a note.

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
    "Bento & Illustrations",
    "Brand & Logos"
];

export default function SurfboardSave() {
    const { memberName } = getPreferenceValues<{ memberName: string }>();
    const [customTag, setCustomTag] = useState("");

    async function handleSubmit(values: {
        url: string;
        name: string;
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

            const domain = new URL(values.url).hostname;
            const faviconUrl =
                `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            const { error } = await supabase.from("tools").insert({
                url: values.url,
                name: values.name,
                tags: allTags,
                description: values.description || null,
                favicon_url: faviconUrl,
                saved_by: memberName,
            });

            if (error) throw error;

            await showToast({
                style: Toast.Style.Success,
                title: "Saved! 🏄",
                message: `${values.name} saved with ${allTags.length} tag${allTags.length > 1 ? "s" : ""}`,
            });

            popToRoot();
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Failed to save",
                message: String(error),
            });
        }
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Save to Surfboard" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField
                id="url"
                title="URL"
                placeholder="https://unicorn.studio"
            />
            <Form.TextField
                id="name"
                title="Tool Name"
                placeholder="Unicorn Studio"
            />
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
    );
}