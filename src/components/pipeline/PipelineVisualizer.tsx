"use client";

import { motion } from "framer-motion";
import { PipelineStage } from "@/types";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";

export function PipelineVisualizer({ stages }: { stages: PipelineStage[] }) {
  const getIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle2 className="w-6 h-6 text-primary" />;
      case "Running": return <Loader2 className="w-6 h-6 text-secondary animate-spin" />;
      case "Failed": return <XCircle className="w-6 h-6 text-destructive" />;
      default: return <CircleDashed className="w-6 h-6 text-muted-foreground/50" />;
    }
  };

  return (
    <div className="relative py-8 overflow-x-auto">
      <div className="flex items-center min-w-max px-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            {/* Stage Node */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 w-32 relative z-10"
            >
              <div className={`p-3 rounded-full bg-background border-2 ${
                stage.status === 'Completed' ? 'border-primary shadow-[0_0_15px_rgba(0,255,255,0.3)]' :
                stage.status === 'Running' ? 'border-secondary shadow-[0_0_15px_rgba(138,43,226,0.3)]' :
                'border-border'
              }`}>
                {getIcon(stage.status)}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{stage.name}</p>
                {stage.tool && (
                  <p className="text-[10px] text-primary/80 font-mono mt-0.5">{stage.tool}</p>
                )}
                {stage.description && (
                  <p className="text-[9px] text-muted-foreground mt-1 leading-tight opacity-80 px-2 line-clamp-2">
                    {stage.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-mono mt-1.5">
                  {stage.status === 'Running' ? `${Math.round(stage.progress)}%` : stage.status}
                </p>
              </div>
            </motion.div>

            {/* Connecting Line */}
            {index < stages.length - 1 && (
              <div className="w-24 h-1 bg-muted relative -ml-4 -mr-4 z-0">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: stage.status === "Completed" ? "100%" : 
                           stage.status === "Running" ? "50%" : "0%" 
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
