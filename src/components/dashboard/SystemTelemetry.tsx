"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Activity, Zap, DatabaseZap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ExplainTooltip } from "@/components/ui/ExplainTooltip";

export function SystemTelemetryPanel() {
  const { telemetry } = useAppStore();

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground uppercase tracking-wider font-semibold">
          <Network className="w-4 h-4 text-primary" />
          System Telemetry
          <Badge variant="outline" className="ml-auto text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Deterministic Simulation]</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between py-2">
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>
        <div className="space-y-4">
          <div className="flex justify-between items-end gap-4">
            <div className="space-y-1 flex-1 relative">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Event Throughput</span>
              <ExplainTooltip title="Events Per Second (EPS)" content="Derived by tracking event dispatches over the refresh interval (2000ms).\n\nFormula: bufferCount / 2 + Organic Math.sin() noise.">
                <div className="text-2xl font-mono font-bold">{telemetry.eventsPerSecond.toFixed(1)} <span className="text-sm font-sans text-muted-foreground font-normal">evt/s</span></div>
              </ExplainTooltip>
              <div className="absolute inset-0 top-6 -z-10 opacity-30">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetry.history || []}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area type="monotone" dataKey="eventsPerSecond" stroke="#eab308" fill="url(#colorEvents)" strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-1 flex-1 text-right relative">
              <span className="text-xs text-muted-foreground flex items-center justify-end gap-1"><Activity className="w-3 h-3 text-green-500" /> API Latency</span>
              <ExplainTooltip title="API Latency" content="Base latency of 40ms + exponential growth when node CPU > 90%.\n\nSimulates thermal throttling and context switching delays.">
                <div className="text-2xl font-mono font-bold">{telemetry.apiLatencyMs.toFixed(0)} <span className="text-sm font-sans text-muted-foreground font-normal">ms</span></div>
              </ExplainTooltip>
              <div className="absolute inset-0 top-6 -z-10 opacity-30">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetry.history || []}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area type="monotone" dataKey="apiLatencyMs" stroke="#22c55e" fill="url(#colorLatency)" strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50 relative">
            <div className="flex justify-between items-center text-xs relative z-10">
              <span className="text-muted-foreground flex items-center gap-1"><DatabaseZap className="w-3 h-3" /> Queue Backlog</span>
              <ExplainTooltip title="Queue Depth" content="Accumulates rapidly when compute node demand exceeds available capacity (CPU > 90%).\n\nFormula: depth += (CPU - 90) * 15">
                <span className="font-mono font-bold text-destructive">{Math.floor(telemetry.queueDepth)} reqs</span>
              </ExplainTooltip>
            </div>
            <Progress value={Math.min(100, telemetry.queueDepth / 20)} className="h-1 relative z-10" />
            <div className="absolute inset-0 -top-2 z-0 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetry.history || []}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area type="monotone" dataKey="queueDepth" stroke="#ef4444" fill="transparent" strokeWidth={1} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">State Sync Health</span>
              <span className="font-mono font-bold text-primary">{telemetry.syncHealth.toFixed(1)}%</span>
            </div>
            <Progress value={telemetry.syncHealth} className="h-1 bg-muted/30" />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
