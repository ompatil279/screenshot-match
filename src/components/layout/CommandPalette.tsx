import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Moon, Sun, Monitor } from "lucide-react";
import { toast } from "sonner";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { allNavItems } from "./nav";
import { usePreferences } from "@/lib/preferences";

const CLI_EXAMPLES = ["atlas --help", "atlas lookup 0xa9059cbb", "atlas decode <calldata>"];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { setPref } = usePreferences();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Go to a page or run an action…" />
      <CommandList>
        <CommandEmpty>No matching pages or actions.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {allNavItems.map((n) => (
            <CommandItem key={n.to} value={`go ${n.label}`} onSelect={() => run(() => navigate({ to: n.to }))}>
              <n.icon className="mr-2 size-4" />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Appearance">
          <CommandItem value="theme light" onSelect={() => run(() => setPref("theme", "light"))}><Sun className="mr-2 size-4" />Use light theme</CommandItem>
          <CommandItem value="theme dark" onSelect={() => run(() => setPref("theme", "dark"))}><Moon className="mr-2 size-4" />Use dark theme</CommandItem>
          <CommandItem value="theme system" onSelect={() => run(() => setPref("theme", "system"))}><Monitor className="mr-2 size-4" />Match system theme</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Copy CLI example (proposed)">
          {CLI_EXAMPLES.map((c) => (
            <CommandItem
              key={c}
              value={`copy ${c}`}
              onSelect={() =>
                run(() =>
                  navigator.clipboard.writeText(c).then(
                    () => toast.success("Copied command"),
                    () => toast.error("Clipboard access was blocked"),
                  ),
                )
              }
            >
              <Copy className="mr-2 size-4" />
              <span className="mono text-[12.5px]">{c}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
