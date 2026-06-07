"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed() {
  const { alerts } = useAppStore();

  const getIcon = (severity: string) => {
    switch (severity) {
      case "Critical": return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "Warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "Info": return <Info className="w-5 h-5 text-primary" />;
      default: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-md h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          System Alerts
          {alerts.filter(a => a.severity === "Critical" && !a.isRead).length > 0 ? (
            <span className="bg-destructive/20 text-destructive text-xs py-0.5 px-2 rounded-full font-mono">
              {alerts.filter(a => a.severity === "Critical" && !a.isRead).length} CRITICAL
            </span>
          ) : (
            <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase py-0.5 px-2 rounded-full font-mono">
              STATUS: STABLE
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center border border-dashed border-border/50 rounded-lg bg-background/20 relative overflow-hidden min-h-[120px]">
              <CheckCircle2 className="w-8 h-8 text-green-500/50 mb-2 relative z-10" />
              <p className="text-xs font-medium text-green-500/80 relative z-10">No active infrastructure incidents.</p>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="flex gap-3 items-start border-b border-border/50 pb-4 last:border-0">
                <div className="mt-0.5">{getIcon(alert.severity)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{alert.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono uppercase tracking-wider">{alert.source}</span>
                    <span>•</span>
                    <span suppressHydrationWarning>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
