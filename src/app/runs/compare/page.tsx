"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, ActivitySquare, Database, HardDrive, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { QCCharts } from "@/components/qc/QCCharts";
import { Progress } from "@/components/ui/progress";
import { ExplainTooltip } from "@/components/ui/ExplainTooltip";

export default function CompareRunsPage() {
  const { runs, metrics, storage } = useAppStore();
  const [runAId, setRunAId] = useState<string>(runs[0]?.id || "");
  const [runBId, setRunBId] = useState<string>(runs[1]?.id || "");

  const runA = runs.find(r => r.id === runAId);
  const runB = runs.find(r => r.id === runBId);
  const metricsA = metrics[runAId];
  const metricsB = metrics[runBId];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            Compare Runs
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Side-by-side analytical view of sequencing metrics and pipeline states.
          </p>
        </div>
        <Link href="/runs" className="text-sm text-primary hover:underline">
          &larr; Back to Runs
        </Link>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />
            
            {/* Left Column (Run A) */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Run A</label>
                <select 
                  className="bg-muted/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={runAId}
                  onChange={(e) => setRunAId(e.target.value)}
                >
                  {runs.map(r => (
                    <option key={r.id} value={r.id}>{r.id} ({r.platform})</option>
                  ))}
                </select>
              </div>

              {runA && metricsA && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-mono text-primary">{runA.id}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{runA.platform}</p>
                    </div>
                    <Badge variant={runA.status === "Completed" ? "outline" : "default"}>
                      {runA.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <ActivitySquare className="w-4 h-4" /> Pipeline Progress
                    </span>
                    <div className="flex items-center gap-3">
                      <Progress value={runA.progress} className="h-2 flex-1" />
                      <span className="text-sm font-mono">{Math.floor(runA.progress)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="% > Q30" content="Percentage of bases with a Phred score > 30. (99.9% accuracy).">
                        <span className="text-xs text-muted-foreground">Q30 Score</span>
                      </ExplainTooltip>
                      <p className="text-xl font-bold mt-1">{metricsA.q30Percentage.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Estimated Yield" content="Total theoretical data output measured in Gigabases (Gb).">
                        <span className="text-xs text-muted-foreground">Est. Yield</span>
                      </ExplainTooltip>
                      <p className="text-xl font-bold mt-1 text-primary">{metricsA.estimatedYieldGb.toFixed(0)} <span className="text-sm text-muted-foreground">Gb</span></p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Duplication Rate" content="PCR duplication frequency.">
                        <span className="text-xs text-muted-foreground">Duplication</span>
                      </ExplainTooltip>
                      <p className={`text-xl font-bold mt-1 ${metricsA.duplicationRate > 20 ? 'text-destructive' : ''}`}>{metricsA.duplicationRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Assigned Node" content="The cluster compute instance handling this pipeline.">
                        <span className="text-xs text-muted-foreground">Compute</span>
                      </ExplainTooltip>
                      <p className="text-sm font-mono mt-2 truncate">{runA.assignedNodeId || "Pending"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Run B) */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Run B</label>
                <select 
                  className="bg-muted/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={runBId}
                  onChange={(e) => setRunBId(e.target.value)}
                >
                  {runs.map(r => (
                    <option key={r.id} value={r.id}>{r.id} ({r.platform})</option>
                  ))}
                </select>
              </div>

              {runB && metricsB && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-mono text-secondary">{runB.id}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{runB.platform}</p>
                    </div>
                    <Badge variant={runB.status === "Completed" ? "outline" : "default"}>
                      {runB.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <ActivitySquare className="w-4 h-4" /> Pipeline Progress
                    </span>
                    <div className="flex items-center gap-3">
                      <Progress value={runB.progress} className="h-2 flex-1" />
                      <span className="text-sm font-mono">{Math.floor(runB.progress)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="% > Q30" content="Percentage of bases with a Phred score > 30. (99.9% accuracy).">
                        <span className="text-xs text-muted-foreground">Q30 Score</span>
                      </ExplainTooltip>
                      <p className="text-xl font-bold mt-1">{metricsB.q30Percentage.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Estimated Yield" content="Total theoretical data output measured in Gigabases (Gb).">
                        <span className="text-xs text-muted-foreground">Est. Yield</span>
                      </ExplainTooltip>
                      <p className="text-xl font-bold mt-1 text-secondary">{metricsB.estimatedYieldGb.toFixed(0)} <span className="text-sm text-muted-foreground">Gb</span></p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Duplication Rate" content="PCR duplication frequency.">
                        <span className="text-xs text-muted-foreground">Duplication</span>
                      </ExplainTooltip>
                      <p className={`text-xl font-bold mt-1 ${metricsB.duplicationRate > 20 ? 'text-destructive' : ''}`}>{metricsB.duplicationRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                      <ExplainTooltip title="Assigned Node" content="The cluster compute instance handling this pipeline.">
                        <span className="text-xs text-muted-foreground">Compute</span>
                      </ExplainTooltip>
                      <p className="text-sm font-mono mt-2 truncate">{runB.assignedNodeId || "Pending"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visual Analytics */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-primary" />
          Comparative Flow Analytics
        </h2>
        {runA && metricsA && (
            <div className="opacity-50 pointer-events-none grayscale">
              <p className="text-xs text-muted-foreground mb-4">Detailed comparative histograms and flow charts are available in Enterprise tier.</p>
              <QCCharts metrics={metricsA} />
            </div>
        )}
      </div>
    </div>
  );
}
