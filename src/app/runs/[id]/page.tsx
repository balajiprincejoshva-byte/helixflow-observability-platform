"use client";

import { useAppStore } from "@/store/useAppStore";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PipelineVisualizer } from "@/components/pipeline/PipelineVisualizer";
import { QCCharts } from "@/components/qc/QCCharts";
import { SampleTable } from "@/components/samples/SampleTable";
import { RunHealthScore } from "@/components/qc/RunHealthScore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Server, PlayCircle, Activity } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

export default function RunDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { runs, metrics, simulateTick, isSimulating } = useAppStore();
  
  const id = params.id as string;
  const run = runs.find(r => r.id === id);
  const runMetrics = metrics[id];

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      simulateTick();
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating, simulateTick]);

  if (!run) {
    return <div className="p-8 text-center text-muted-foreground">Run not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/")} className="shrink-0 border-border bg-background/50 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Run {run.id}</h1>
            <Badge variant={run.status === "Sequencing" || run.status === "Processing" ? "default" : "secondary"} className="uppercase font-mono text-xs py-0.5">
              {run.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5" /> {run.machineId} ({run.platform})</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(run.startTime), "PP p")}</span>
          </div>
        </div>
      </div>

      {/* Health & Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <RunHealthScore health={run.health} />
        </div>
        
        {/* Pipeline Visualizer */}
        <div className="md:col-span-2 bg-card/30 backdrop-blur-md rounded-xl border border-border p-6 shadow-inner flex flex-col justify-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <PlayCircle className="w-4 h-4" /> Live Pipeline Status
          </h2>
          <PipelineVisualizer stages={run.pipelineStages} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="qc" className="w-full">
        <TabsList className="bg-card/50 backdrop-blur-md border border-border/50 p-1 rounded-lg">
          <TabsTrigger value="qc" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md">
            <Activity className="w-4 h-4 mr-2" /> QC Analytics
          </TabsTrigger>
          <TabsTrigger value="samples" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md">
            Sample Sheet ({run.totalSamples})
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="qc" className="m-0 focus-visible:outline-none">
            {runMetrics ? (
              <QCCharts metrics={runMetrics} />
            ) : (
              <div className="text-center p-8 text-muted-foreground border border-border/50 rounded-lg bg-card/20">
                QC Metrics not yet available for this run.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="samples" className="m-0 focus-visible:outline-none">
            <SampleTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
