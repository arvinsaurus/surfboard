import {
    Action,
    ActionPanel,
    Form,
    showToast,
    Toast,
    useNavigation,
} from "@raycast/api";
import { supabase } from "./supabase";

interface Tool {
    id: string;
    url: string;
    name: string;
    description: string | null;
    tags: string[];
}

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
    "Brand & Logos",
];

export function EditTool({ tool, onEdit }: { tool: Tool; onEdit: () => void }) {
    const { pop } = useNavigation();

    async function handleSubmit(values: {
        url: string;
        name: string;
        tags: string[];
        customTags: string;
        description: string;
    }) {
        try {
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

            const { error } = await supabase
                .from("tools")
                .update({
                    url: values.url,
                    name: values.name,
                    tags: allTags,
                    description: values.description || null,
                })
                .eq("id", tool.id);

            if (error) throw error;

            await showToast({
                style: Toast.Style.Success,
                title: "Updated! 🏄",
            });

            onEdit();
            pop();
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Failed to update",
                message: String(error),
            });
        }
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField id="url" title="URL" defaultValue={tool.url} />
            <Form.TextField id="name" title="Tool Name" defaultValue={tool.name} />
            <Form.TagPicker id="tags" title="Tags" defaultValue={tool.tags.filter(t => TAGS.includes(t))}>
                {TAGS.map((tag) => (
                    <Form.TagPicker.Item key={tag} value={tag} title={tag} />
                ))}
            </Form.TagPicker>
            <Form.TextField
                id="customTags"
                title="Custom Tags"
                placeholder="e.g. Gradients, Hero Sections"
                defaultValue={tool.tags.filter(t => !TAGS.includes(t)).join(", ")}
            />
            <Form.TextArea
                id="description"
                title="Quick Note"
                defaultValue={tool.description || ""}
            />
        </Form>
    );
}
