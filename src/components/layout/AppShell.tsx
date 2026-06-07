"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AmbientBackground } from "./AmbientBackground";
import { CommandPalette } from "./CommandPalette";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { SplashScreen } from "./SplashScreen";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCommandCenterMode, toggleCommandCenter, runs, hydrateLiveData } = useAppStore();

  useEffect(() => {
    if (runs.length === 0) {
      hydrateLiveData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "C" && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleCommandCenter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandCenter]);

  return (
    <div className={cn(
      "flex h-screen bg-background text-foreground overflow-hidden transition-all duration-700",
      isCommandCenterMode && "bg-black"
    )}>
      <SplashScreen />
      <AmbientBackground />
      {!isCommandCenterMode && <AppSidebar />}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {!isCommandCenterMode && <AppHeader />}
        <main className={cn(
          "flex-1 overflow-y-auto relative transition-all duration-700",
          isCommandCenterMode ? "p-2 md:p-4" : "p-4 md:p-6 lg:p-8"
        )}>
          <div className={cn(
            "relative z-10 mx-auto space-y-6 transition-all duration-700",
            isCommandCenterMode ? "max-w-[1600px] scale-[0.98]" : "max-w-7xl"
          )}>
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
      <PerformanceMonitor />
      
      {isCommandCenterMode && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-[100px] blur-[150px] mix-blend-screen" />
          <div className="absolute top-4 right-4 z-50 text-xs text-primary/50 font-mono tracking-widest uppercase animate-pulse">
            Command Center Active • Press Shift+C to exit
          </div>
        </div>
      )}
    </div>
  );
}
