"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [stage, setStage] = useState<"loading" | "fading" | "hidden">("loading");

  useEffect(() => {
    // Hold solid for 1.5s, then fade out over 0.5s
    const fadeTimer = setTimeout(() => {
      setStage("fading");
    }, 1500);

    const hideTimer = setTimeout(() => {
      setStage("hidden");
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
      stage === "fading" ? "opacity-0" : "opacity-100"
    )}>
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8a2be208_1px,transparent_1px),linear-gradient(to_bottom,#8a2be208_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 fade-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(138,43,226,0.3)] relative overflow-hidden">
          <Activity className="w-8 h-8 text-primary" />
          
          {/* Scanning laser effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-1 bg-primary/60 blur-[1px] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-1">
          Helix<span className="text-primary font-light">Flow</span>
        </h1>
        
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="h-1 w-32 bg-muted/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress_1.5s_ease-in-out_forwards]" />
          </div>
          <p className="text-muted-foreground text-[10px] font-mono tracking-[0.2em] uppercase animate-pulse">
            Initializing Telemetry Engine
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(64px); opacity: 1; }
          60% { opacity: 0; }
          100% { transform: translateY(64px); opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
