import { Action, ActionPanel, Detail, Form, LocalStorage, openExtensionPreferences } from "@raycast/api";
import { useState } from "react";

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"name" | "hotkeys">("name");
  const [name, setName] = useState("");

  async function handleNameSubmit(values: { name: string }) {
    setName(values.name);
    setStep("hotkeys");
  }

  async function finish(openPrefs: boolean) {
    await LocalStorage.setItem("memberName", name);
    await LocalStorage.setItem("onboardingComplete", "true");
    if (openPrefs) openExtensionPreferences();
    onComplete(name);
  }

  if (step === "hotkeys") {
    return (
      <Detail
        markdown={`# Set up hotkeys\n\nAssign global shortcuts so you can reach Surfboard from anywhere on your Mac.\n\n**Suggested shortcuts:**\n- **Add to Surfboard** — e.g. \`⌥⇧S\`\n- **Surfboard Search** — e.g. \`⌥⇧F\`\n\nPress **Set Hotkeys** below, then click the hotkey field next to each command and press your preferred shortcut.`}
        actions={
          <ActionPanel>
            <Action title="Set Hotkeys" onAction={() => finish(true)} />
            <Action title="Skip for Now" onAction={() => finish(false)} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Continue" onSubmit={handleNameSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Your Name"
        placeholder="e.g. Alex"
        info="How your team sees you in Surfboard"
        autoFocus
      />
    </Form>
  );
}
