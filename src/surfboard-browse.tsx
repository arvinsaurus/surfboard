// surfboard-browse.tsx
// This command shows all tools grouped by tag.
// A tool with multiple tags appears in multiple sections.
// For example, Unicorn Studio tagged as "Backgrounds" and "Animation"
// will show up in both sections.

import {
    Action,
    ActionPanel,
    Icon,
    List,
    useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { EditTool } from "./edit-tool";

interface Tool {
    id: string;
    url: string;
    name: string;
    description: string | null;
    favicon_url: string | null;
    tags: string[];
    saved_by: string;
    times_opened: number;
}

export default function SurfboardBrowse() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchTools() {
        setIsLoading(true);
        const { data } = await supabase
            .from("tools")
            .select("*")
            .order("times_opened", { ascending: false });

        if (data) setTools(data as Tool[]);
        setIsLoading(false);
    }

    // Fetch all tools on load, sorted by most popular first
    useEffect(() => {
        fetchTools();
    }, []);

    // Group tools by each tag
    // A tool with tags ["Backgrounds", "Animation"] will appear in both groups
    const grouped = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
        tool.tags.forEach((tag) => {
            if (!acc[tag]) acc[tag] = [];
            acc[tag].push(tool);
        });
        return acc;
    }, {});

    // Sort sections alphabetically
    const sortedTags = Object.keys(grouped).sort();

    return (
        <List isLoading={isLoading}>
            {sortedTags.map((tag) => (
                <List.Section
                    key={tag}
                    title={tag}
                    subtitle={`${grouped[tag].length} tools`}
                >
                    {grouped[tag].map((tool) => (
                        <List.Item
                            key={`${tag}-${tool.id}`}
                            icon={tool.favicon_url || Icon.Globe}
                            title={tool.name}
                            subtitle={tool.description || ""}
                            accessories={[
                                { text: `by ${tool.saved_by}` },
                                { text: "⌘E", icon: Icon.Pencil, tooltip: "Press Cmd + E to Edit" },
                                { text: `${tool.times_opened}×`, icon: Icon.Eye },
                            ]}
                            actions={
                                <ActionPanel>
                                    <Action.OpenInBrowser url={tool.url} />
                                    <Action.Push
                                        title="Edit Tool"
                                        icon={Icon.Pencil}
                                        target={<EditTool tool={tool} onEdit={fetchTools} />}
                                        shortcut={{ modifiers: ["cmd"], key: "e" }}
                                    />
                                    <Action.CopyToClipboard content={tool.url} />
                                </ActionPanel>
                            }
                        />
                    ))}
                </List.Section>
            ))}
        </List>
    );
}