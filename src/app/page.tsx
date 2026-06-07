"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { OperationalIntelligencePanel } from "@/components/dashboard/OperationalIntelligencePanel";
import { SystemTelemetryPanel } from "@/components/dashboard/SystemTelemetry";
import { LiveEventStream } from "@/components/dashboard/LiveEventStream";
import { IncidentInjectionPanel } from "@/components/dashboard/IncidentInjectionPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { X, ActivitySquare } from "lucide-react";

export default function Dashboard() {
  const { simulateTick, isSimulating, runs, isHydrating } = useAppStore();
  const [showContextBanner, setShowContextBanner] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      simulateTick();
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating, simulateTick]);

  const activeRuns = runs.filter(r => r.status !== "Completed");

  return (
    <div className="space-y-6">
      {showContextBanner && (
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(138,43,226,0.1)]">
          <div className="absolute right-4 top-4">
            <button onClick={() => setShowContextBanner(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <CardContent className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-primary mb-2 tracking-tight">Why This Exists</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
              Modern sequencing workflows generate enormous operational complexity. HelixFlow explores how real-time observability, telemetry, and AI-assisted operational intelligence can improve visibility across distributed genomic processing systems.
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time NGS pipeline monitoring and operations intelligence.
        </p>
      </div>

      <LiveEventStream />

      <IncidentInjectionPanel />

      <MetricCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 h-[450px]">
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-md h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Active Sequencing Runs</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {isHydrating ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-muted/20 animate-pulse rounded-lg border border-border/30" />
                    ))}
                  </div>
                ) : activeRuns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center border border-dashed border-border/50 rounded-lg bg-background/20 min-h-[250px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8a2be205_1px,transparent_1px),linear-gradient(to_bottom,#8a2be205_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                    <ActivitySquare className="w-12 h-12 text-primary/30 mb-3 relative z-10" />
                    <p className="text-sm relative z-10 font-medium">No active sequencing workloads.</p>
                    <p className="text-xs mt-1 opacity-70 relative z-10">Cluster is idle. Awaiting workflow assignment.</p>
                  </div>
                ) : (
                  activeRuns.map(run => (
                    <Link href={`/runs/${run.id}`} key={run.id}>
                      <div className="p-4 border border-border/50 rounded-lg bg-background/30 hover:bg-muted/50 transition-colors cursor-pointer block mb-4 last:mb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-primary group-hover:underline">{run.id}</h3>
                              <Badge variant={run.status === "Sequencing" ? "default" : "secondary"} className="text-[10px] uppercase font-mono px-1.5 py-0">
                                {run.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Platform: <span className="text-foreground">{run.platform}</span> • Samples: <span className="text-foreground">{run.totalSamples}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{Math.round(run.progress)}%</div>
                          </div>
                        </div>
                        <Progress value={run.progress} className="h-1.5 bg-muted/50" />
                        <div className="mt-3 flex gap-1">
                          {run.pipelineStages.map((stage, idx) => (
                            <div 
                              key={stage.id} 
                              className="flex-1 h-1 rounded-full overflow-hidden bg-muted/50 relative"
                              title={`${stage.name}: ${stage.status}`}
                            >
                              <div 
                                className={`absolute inset-0 transition-all duration-500 ${
                                  stage.status === 'Completed' ? 'bg-primary' : 
                                  stage.status === 'Running' ? 'bg-secondary animate-pulse' : 'bg-transparent'
                                }`}
                                style={{ width: stage.status === 'Running' ? `${stage.progress}%` : '100%' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex-1 overflow-hidden min-h-[150px]">
            <SystemTelemetryPanel />
          </div>
          <div className="flex-1 overflow-hidden min-h-[200px]">
            <OperationalIntelligencePanel />
          </div>
          <div className="flex-1 overflow-hidden min-h-[150px]">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
