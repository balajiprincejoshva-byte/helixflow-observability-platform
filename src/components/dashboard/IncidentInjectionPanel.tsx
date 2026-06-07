"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertOctagon } from "lucide-react";

export function IncidentInjectionPanel() {
  const { injectIncident, nodes } = useAppStore();

  return (
    <Card className="bg-destructive/10 border-destructive/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-destructive uppercase tracking-wider font-semibold">
          <AlertOctagon className="w-4 h-4" />
          Systems Engineering: Incident Injection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Manually trigger a compute node failure to observe the Causal Engine generate queue congestion, throttle pipeline progression, and dynamically derive AI Operational Insights.
        </p>
        <div className="flex flex-wrap gap-2">
          {nodes.map(node => (
            <Button 
              key={node.id} 
              size="sm" 
              variant="destructive" 
              className="text-[10px] h-7"
              onClick={() => injectIncident(node.id)}
            >
              <Zap className="w-3 h-3 mr-1" />
              Crash {node.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
