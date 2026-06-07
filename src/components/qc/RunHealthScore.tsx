"use client";

import { RunHealth } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { UI_CONSTANTS } from "@/config/constants";

export function RunHealthScore({ health }: { health: RunHealth }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health.score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= UI_CONSTANTS.healthThresholds.warning) return "text-green-500";
    if (score >= UI_CONSTANTS.healthThresholds.critical) return "text-yellow-500";
    return "text-red-500";
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Stable": return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case "Monitoring": return <Shield className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getIcon(health.category)}
          Run Health & Stability
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6 pt-4">
        {/* Radial Score */}
        <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-muted/30 stroke-current"
              strokeWidth="8"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
            />
            <circle
              className={`${getColor(health.score)} stroke-current transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono">{health.score}</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Score</span>
          </div>
        </div>

        {/* Penalty Breakdown */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Confidence Level</span>
            <span className="font-mono font-medium">{health.confidence}%</span>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/70 mb-1 border-b border-border/50 pb-1">Penalty Factors</div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Duplication Rate</span>
              <span className="text-destructive font-mono">-{health.metrics.duplicationPenalty}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">GC Bias</span>
              <span className="text-yellow-500 font-mono">-{health.metrics.gcBiasPenalty}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Node Stability</span>
              <span className="text-primary font-mono">-{health.metrics.nodeStabilityPenalty}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
