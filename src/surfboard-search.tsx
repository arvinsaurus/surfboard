// surfboard-search.tsx
// This command lets you search for tools by typing keywords.
// It searches across tool names, descriptions, and tags.

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

// TypeScript type — describes what a "tool" looks like
interface Tool {
    id: string;
    url: string;
    name: string;
    description: string | null;
    favicon_url: string | null;
    tags: string[];
    saved_by: string;
    times_opened: number;
    created_at: string;
}

export default function SurfboardSearch() {
    // State: the list of tools, whether we're loading, and what the user typed
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    // Re-fetch tools whenever the search text changes
    useEffect(() => {
        fetchTools();
    }, [searchText]);

    async function fetchTools() {
        setIsLoading(true);

        // Fetch all tools from Supabase, newest first
        let query = supabase
            .from("tools")
            .select("*")
            .order("created_at", { ascending: false });

        // If the user typed something, filter by name and description on the server
        if (searchText) {
            query = query.or(
                `name.ilike.%${searchText}%,` +
                `description.ilike.%${searchText}%`
            );
        }

        const { data, error } = await query;

        if (!error && data) {
            let results = data as Tool[];

            // Also filter by tags on the client side
            // (because Supabase array search needs exact matches,
            //  but we want partial matching like "back" → "Backgrounds")
            if (searchText) {
                const search = searchText.toLowerCase();
                results = results.filter(
                    (tool) =>
                        tool.name.toLowerCase().includes(search) ||
                        (tool.description || "").toLowerCase().includes(search) ||
                        tool.tags.some((tag) => tag.toLowerCase().includes(search))
                );
            }

            setTools(results);
        }

        setIsLoading(false);
    }

    // When someone opens a tool, increment the counter
    async function trackOpen(tool: Tool) {
        await supabase
            .from("tools")
            .update({ times_opened: tool.times_opened + 1 })
            .eq("id", tool.id);
    }

    // The list UI
    return (
        <List
            isLoading={isLoading}
            searchBarPlaceholder="What do you need? (e.g. background, icons, fonts)"
            onSearchTextChange={setSearchText}
            throttle
        >
            {tools.map((tool) => (
                <List.Item
                    key={tool.id}
                    icon={tool.favicon_url || Icon.Globe}
                    title={tool.name}
                    subtitle={tool.description || ""}
                    accessories={[
                        { text: tool.tags.join(", "), icon: Icon.Tag },
                        { text: `by ${tool.saved_by}`, icon: Icon.Person },
                        { text: `${tool.times_opened}×`, icon: Icon.Eye },
                    ]}
                    actions={
                        <ActionPanel>
                            <Action.OpenInBrowser
                                url={tool.url}
                                onOpen={() => trackOpen(tool)}
                            />
                            <Action.Push
                                title="Edit Tool"
                                icon={Icon.Pencil}
                                target={<EditTool tool={tool} onEdit={fetchTools} />}
                                shortcut={{ modifiers: ["cmd"], key: "e" }}
                            />
                            <Action.CopyToClipboard
                                content={tool.url}
                                shortcut={{ modifiers: ["cmd"], key: "c" }}
                            />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    );
}