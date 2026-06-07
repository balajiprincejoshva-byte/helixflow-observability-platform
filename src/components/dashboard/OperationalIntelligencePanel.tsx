"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, AlertTriangle, ShieldCheck, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OperationalIntelligencePanel() {
  const { operationalInsights } = useAppStore();

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "High": return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 text-[10px] py-0">High Confidence</Badge>;
      case "Medium": return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 text-[10px] py-0">Med Confidence</Badge>;
      default: return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 text-[10px] py-0">Low Confidence</Badge>;
    }
  };

  const handleExport = () => {
    const state = useAppStore.getState();
    const timestamp = new Date().toISOString();
    
    let reportContent = `=================================================================\n`;
    reportContent += `HELIXFLOW AUTOMATED INCIDENT REPORT\n`;
    reportContent += `Generated: ${timestamp}\n`;
    reportContent += `=================================================================\n\n`;

    if (operationalInsights.length === 0) {
      reportContent += `SYSTEM STATUS: STABLE\nNo active incidents detected in the telemetry stream.\n`;
    } else {
      reportContent += `SYSTEM STATUS: ${operationalInsights.length} ACTIVE INCIDENT(S) DETECTED\n\n`;
      
      operationalInsights.forEach((insight, idx) => {
        reportContent += `INCIDENT ${idx + 1}: ${insight.title}\n`;
        reportContent += `-----------------------------------------------------------------\n`;
        reportContent += `Confidence:      ${insight.confidence}\n`;
        reportContent += `Affected Nodes:  ${insight.affectedSystems.join(', ')}\n\n`;
        reportContent += `OBSERVATION:\n${insight.observation}\n\n`;
        reportContent += `ROOT CAUSE ANALYSIS:\n${insight.rootCause}\n\n`;
        if (insight.recommendedAction) {
          reportContent += `RECOMMENDED ACTION:\n${insight.recommendedAction}\n\n`;
        }
      });
    }

    reportContent += `=================================================================\n`;
    reportContent += `SYSTEM STATE SNAPSHOT\n`;
    reportContent += `=================================================================\n`;
    reportContent += `API Latency:      ${Math.round(state.telemetry.apiLatencyMs)} ms\n`;
    reportContent += `Queue Depth:      ${Math.round(state.telemetry.queueDepth)} requests\n`;
    reportContent += `Events/Sec:       ${state.telemetry.eventsPerSecond.toFixed(1)}\n`;
    reportContent += `Sync Health:      ${state.telemetry.syncHealth}%\n\n`;
    
    reportContent += `ACTIVE RUNS:\n`;
    const activeRuns = state.runs.filter(r => r.status !== "Completed" && r.status !== "Failed");
    if (activeRuns.length === 0) {
      reportContent += `No active runs.\n`;
    } else {
      activeRuns.forEach(r => {
        reportContent += `- [${r.id}] Platform: ${r.platform} | Node: ${r.assignedNodeId || 'Unassigned'} | Progress: ${Math.round(r.progress)}%\n`;
      });
    }

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HelixFlow_Incident_Report_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-md border-secondary/30 shadow-[0_0_20px_rgba(138,43,226,0.05)] h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-secondary">
          <BrainCircuit className="w-5 h-5" />
          Operational Intelligence Engine
          <Badge variant="outline" className="ml-2 text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Deterministic Simulation]</Badge>
        </CardTitle>
        <button 
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 px-2.5 py-1 rounded-md transition-colors"
          title="Export System Incident Report"
        >
          <Download className="w-3 h-3" />
          Export Report
        </button>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-y-auto pr-2">
        {operationalInsights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center border border-dashed border-border/50 rounded-lg bg-background/20 min-h-[160px]">
            <ShieldCheck className="w-12 h-12 text-primary/30 mb-3" />
            <p className="text-sm font-medium">Telemetry stable across all active sequencing nodes.</p>
            <p className="text-xs mt-1 opacity-70">No queue congestion or infrastructure anomalies detected.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          operationalInsights.map(insight => (
            <div key={insight.id} className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-secondary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  {insight.title}
                </h4>
                {getConfidenceBadge(insight.confidence)}
              </div>
              
              <div className="space-y-3 mt-3">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Telemetry Observation</span>
                  <p className="text-xs mt-0.5 leading-relaxed">{insight.observation}</p>
                </div>
                
                <div className="p-2 rounded bg-destructive/5 border border-destructive/20 border-l-2 border-l-destructive">
                  <span className="text-[10px] uppercase text-destructive font-semibold tracking-wider">Inferred Root Cause</span>
                  <p className="text-xs mt-0.5 leading-relaxed">{insight.rootCause}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex flex-wrap gap-1">
                    {insight.affectedSystems.map(sys => (
                      <Badge key={sys} variant="outline" className="text-[9px] py-0 bg-background/50">{sys}</Badge>
                    ))}
                  </div>
                  <span className="text-[10px] text-primary hover:underline cursor-pointer font-medium">View Runbook</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
