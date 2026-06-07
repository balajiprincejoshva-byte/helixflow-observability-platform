"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, ArrowDownUp, Cloud } from "lucide-react";

export default function StoragePage() {
  const { storage } = useAppStore();

  const usagePercent = (storage.usedCapacityTb / storage.totalCapacityTb) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="w-8 h-8 text-primary" />
          Data Storage Cluster
          <Badge variant="outline" className="ml-2 text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Live ENA Metadata]</Badge>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Simulated S3 and cold-storage infrastructure usage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono">{storage.totalCapacityTb}</span>
              <span className="text-sm text-muted-foreground font-mono">TB</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><HardDrive className="w-3 h-3"/> Provisioned RAID Array</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Used Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-primary">{storage.usedCapacityTb.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground font-mono">TB</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Cloud className="w-3 h-3"/> {usagePercent.toFixed(1)}% Utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">I/O Transfer Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-secondary">{storage.transferRateGbps.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground font-mono">Gbps</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><ArrowDownUp className="w-3 h-3"/> Active Read/Write</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle className="text-lg">Data Type Distribution</CardTitle>
          <CardDescription>Volume allocation by file type across the storage cluster. Estimated BAM size assumes ~35–45% compression relative to raw FASTQ.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-8 w-full rounded-full overflow-hidden flex border border-border/50">
              {storage.distribution.map((dist, idx) => {
                const colors = ["bg-primary", "bg-secondary", "bg-blue-500", "bg-muted"];
                return (
                  <div 
                    key={dist.type} 
                    className={`h-full ${colors[idx % colors.length]}`} 
                    style={{ width: `${(dist.sizeTb / storage.usedCapacityTb) * 100}%` }}
                  />
                );
              })}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {storage.distribution.map((dist, idx) => {
                const colors = ["text-primary", "text-secondary", "text-blue-500", "text-muted-foreground"];
                return (
                  <div key={dist.type} className="flex flex-col p-4 rounded-lg bg-background/50 border border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{dist.type}</span>
                    <span className={`text-xl font-bold font-mono ${colors[idx % colors.length]}`}>{dist.sizeTb.toFixed(1)} TB</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {((dist.sizeTb / storage.usedCapacityTb) * 100).toFixed(1)}% of used
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
