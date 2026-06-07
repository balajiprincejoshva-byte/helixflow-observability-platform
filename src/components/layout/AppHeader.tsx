"use client";

import { Search, Play, Pause } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

import { Button } from "@/components/ui/button";

import { DataIntegrityPanel } from "@/components/dashboard/DataIntegrityPanel";

export function AppHeader() {
  const { isSimulating, toggleSimulation } = useAppStore();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 hidden xl:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search runs, samples, nodes..."
            className="w-full bg-muted/50 border border-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-colors"
          />
        </div>
        <DataIntegrityPanel />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Live Sim
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 border ${isSimulating ? 'border-primary/50 text-primary bg-primary/10 hover:bg-primary/20' : 'border-border text-muted-foreground'}`}
            onClick={toggleSimulation}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 mr-2" /> : <Play className="w-3.5 h-3.5 mr-2" />}
            {isSimulating ? "Running" : "Paused"}
          </Button>
        </div>
      </div>
    </header>
  );
}
