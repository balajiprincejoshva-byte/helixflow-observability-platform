"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, Database, PlayCircle } from "lucide-react";

export function MetricCards() {
  const { runs, nodes } = useAppStore();

  const activeRuns = runs.filter(r => r.status === "Pending" || r.status === "Sequencing" || r.status === "Processing").length;
  const avgCpu = nodes.reduce((acc, node) => acc + node.cpuUsage, 0) / nodes.length;
  const avgMemory = nodes.reduce((acc, node) => acc + node.memoryUsage, 0) / nodes.length;
  
  const totalSamples = runs.reduce((acc, run) => acc + run.totalSamples, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-md border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.05)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Sequencing Runs</CardTitle>
          <PlayCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{activeRuns}</div>
          <p className="text-xs text-muted-foreground mt-1 text-primary/80">
            +1 since last hour
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Samples Processing</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSamples}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {runs.length} total runs
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cluster CPU Load</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
          <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${avgCpu}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cluster Mem Load</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgMemory.toFixed(1)}%</div>
          <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${avgMemory}%` }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
