"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, Server, Thermometer, Clock } from "lucide-react";
import { TopologyMap } from "@/components/dashboard/TopologyMap";

export default function NodesPage() {
  const { nodes } = useAppStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Cpu className="w-8 h-8 text-primary" />
          Compute Infrastructure
          <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground border-border text-xs">[Deterministic Engine]</Badge>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Live hardware telemetry and cluster health monitoring.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">System Topology</h2>
        <TopologyMap />
      </div>

      <h2 className="text-xl font-bold mb-4">Node Telemetry</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => (
          <Card key={node.id} className={`bg-card/50 backdrop-blur-md transition-colors ${node.status === "Degraded" ? "border-destructive/50 shadow-[0_0_15px_rgba(255,0,0,0.1)]" : "border-border"}`}>
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    {node.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">{node.id}</CardDescription>
                </div>
                <Badge variant={node.status === "Healthy" ? "outline" : "destructive"} className={node.status === "Healthy" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                  {node.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">CPU Utilization</span>
                  <span className={`font-mono font-bold ${node.cpuUsage > 85 ? "text-destructive" : "text-foreground"}`}>
                    {node.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={node.cpuUsage} className={`h-1.5 ${node.cpuUsage > 85 ? "bg-destructive/20 [&>div]:bg-destructive" : ""}`} />
              </div>

              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Memory Allocation</span>
                  <span className="font-mono font-bold">{node.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={node.memoryUsage} className="h-1.5 bg-muted/50 [&>div]:bg-secondary" />
              </div>

              {/* Hardware Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Thermometer className={`w-4 h-4 ${node.temperature > 85 ? "text-destructive" : "text-yellow-500"}`} />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Core Temp</p>
                    <p className={`font-mono text-sm font-bold ${node.temperature > 85 ? "text-destructive animate-pulse" : "text-foreground"}`}>
                      {node.temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Uptime</p>
                    <p className="font-mono text-sm font-bold">{Math.floor(node.uptime / 3600)}h {(Math.floor(node.uptime / 60) % 60).toString().padStart(2, '0')}m</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
