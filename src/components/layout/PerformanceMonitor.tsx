"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const { isSimulating } = useAppStore();

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-md border border-border/50 rounded-lg p-2 flex items-center gap-4 shadow-lg text-[10px] font-mono tracking-wider">
      <div className="flex items-center gap-1.5">
        <Activity className={`w-3 h-3 ${fps >= 55 ? "text-green-500" : "text-yellow-500"}`} />
        <span className="text-muted-foreground">RENDER:</span>
        <span className="font-bold">{fps} FPS</span>
      </div>
      <div className="w-[1px] h-3 bg-border/50" />
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">SYNC:</span>
        <span className={isSimulating ? "text-primary font-bold animate-pulse" : "text-destructive font-bold"}>
          {isSimulating ? "ACTIVE" : "HALTED"}
        </span>
      </div>
      <div className="w-[1px] h-3 bg-border/50" />
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span>CACHE:</span>
        <span className="text-foreground">94.2%</span>
      </div>
    </div>
  );
}
