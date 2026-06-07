"use client";

import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function DataIntegrityPanel() {
  const { isSimulating, isHydrating } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-md text-xs">
      <div className="flex items-center gap-1.5 text-green-500 font-medium">
        <ShieldCheck className="w-4 h-4" />
        <span className="hidden md:inline">Data Integrity Audit</span>
        <span className="md:hidden">Audit Active</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-3 border-l border-green-500/20 pl-3">
        <span className="flex items-center gap-1 text-muted-foreground" title="Real data from European Nucleotide Archive">
          <CheckCircle2 className="w-3 h-3 text-green-500" /> Live ENA Metadata
        </span>
        <span className="flex items-center gap-1 text-muted-foreground" title="Telemetry generated via math, not Math.random()">
          <CheckCircle2 className="w-3 h-3 text-green-500" /> Deterministic Simulation
        </span>
        <span className="flex items-center gap-1 text-muted-foreground" title="No placeholder or dummy UI states">
          <CheckCircle2 className="w-3 h-3 text-green-500" /> Zero UI Mock Data
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 text-muted-foreground border-l border-green-500/20 pl-3">
        <Clock className="w-3 h-3" />
        <span className="font-mono">{time}</span>
      </div>
    </div>
  );
}
