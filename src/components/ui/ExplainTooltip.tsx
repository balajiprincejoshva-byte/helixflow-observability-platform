"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ExplainTooltip({ 
  content, 
  title = "Why this number?", 
  children 
}: { 
  content: string | React.ReactNode; 
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delay={100}>
      <Tooltip>
        <TooltipTrigger>
          <span className="inline-flex items-center gap-1 cursor-help group">
            {children}
            <Info className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-card border border-border p-3 shadow-xl" sideOffset={8}>
          <div className="space-y-1.5">
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">{title}</h4>
            <div className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
