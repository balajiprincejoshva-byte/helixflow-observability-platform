"use client";

import { useAppStore } from "@/store/useAppStore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertCircle, Info, Zap } from "lucide-react";
import { FEATURES } from "@/config/features";

export function LiveEventStream() {
  const { events } = useAppStore();

  if (!FEATURES.enableLiveStreaming) return null;

  const getIcon = (severity: string) => {
    switch (severity) {
      case "Error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "Warning": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "Highlight": return <Zap className="w-4 h-4 text-primary" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card/30 border-y border-border/50 py-2 px-6 flex items-center overflow-hidden h-12 shadow-inner">
      <div className="flex items-center gap-2 mr-4 shrink-0">
        <Activity className="w-4 h-4 text-secondary animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live Stream</span>
      </div>
      <div className="flex-1 relative overflow-hidden h-full">
        <div className="absolute inset-0 flex items-center gap-6">
          <AnimatePresence>
            {events.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 shrink-0 bg-background/50 border border-border/50 rounded-full px-3 py-1 shadow-sm"
              >
                {getIcon(event.severity)}
                <span className="text-xs truncate max-w-[250px]">{event.message}</span>
                <span className="text-[10px] text-muted-foreground font-mono ml-1">
                  {formatDistanceToNow(new Date(event.timestamp))}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
