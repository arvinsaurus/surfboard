// surfboard-browse.tsx
// This command shows all tools grouped by tag.
// A tool with multiple tags appears in multiple sections.
// For example, Unicorn Studio tagged as "Backgrounds" and "Animation"
// will show up in both sections.

import { Action, ActionPanel, Icon, List, LocalStorage, confirmAlert, Alert, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { EditTool } from "./edit-tool";
import { Onboarding } from "./onboarding";

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
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      const done = await LocalStorage.getItem<string>("onboardingComplete");
      setOnboardingDone(done === "true");
    }
    check();
  }, []);

  async function fetchTools() {
    setIsLoading(true);
    const { data } = await supabase.from("tools").select("*").order("times_opened", { ascending: false });

    if (data) setTools(data as Tool[]);
    setIsLoading(false);
  }

  // Fetch all tools on load, sorted by most popular first
  useEffect(() => {
    if (onboardingDone) fetchTools();
  }, [onboardingDone]);

  async function handleDelete(tool: Tool) {
    if (
      await confirmAlert({
        title: "Delete Tool",
        message: `Are you sure you want to delete "${tool.name}"?`,
        primaryAction: {
          title: "Delete",
          style: Alert.ActionStyle.Destructive,
        },
      })
    ) {
      try {
        const { error } = await supabase.from("tools").delete().eq("id", tool.id);
        if (error) throw error;
        await showToast({ style: Toast.Style.Success, title: "Deleted 🏄" });
        fetchTools();
      } catch {
        await showToast({ style: Toast.Style.Failure, title: "Failed to delete" });
      }
    }
  }

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

  if (onboardingDone === null) return null;

  if (!onboardingDone) {
    return <Onboarding onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <List isLoading={isLoading}>
      {sortedTags.map((tag) => (
        <List.Section key={tag} title={tag} subtitle={`${grouped[tag].length} tools`}>
          {grouped[tag].map((tool) => (
            <List.Item
              key={`${tag}-${tool.id}`}
              icon={tool.favicon_url || Icon.Globe}
              title={tool.name}
              subtitle={tool.description || ""}
              accessories={[
                { text: `by ${tool.saved_by}` },
                { text: "⌘E", icon: Icon.Pencil, tooltip: "Press Cmd + E to Edit" },
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
                  <Action
                    title="Delete Tool"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["ctrl"], key: "x" }}
                    onAction={() => handleDelete(tool)}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
