"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppStore } from "@/store/useAppStore";
import { Activity, LayoutDashboard, Terminal, AlertTriangle } from "lucide-react";
import { FEATURES } from "@/config/features";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { runs, alerts } = useAppStore();

  useEffect(() => {
    if (!FEATURES.enableCommandPalette) return;
    
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!FEATURES.enableCommandPalette) return null;

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Global Overview
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/architecture"))}>
            <Terminal className="mr-2 h-4 w-4" />
            System Architecture
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Active Sequencing Runs">
          {runs.map((run) => (
            <CommandItem key={run.id} onSelect={() => runCommand(() => router.push(`/runs/${run.id}`))}>
              <Activity className="mr-2 h-4 w-4 text-primary" />
              <span>Run {run.id}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">{run.status}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Critical Alerts">
          {alerts.filter(a => a.severity === "Critical").map(alert => (
            <CommandItem key={alert.id} onSelect={() => runCommand(() => console.log("Alert selected", alert.id))}>
              <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
              <span className="truncate max-w-[300px]">{alert.message}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
