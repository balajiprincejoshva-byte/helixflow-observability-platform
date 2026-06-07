"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ActivitySquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RunsPage() {
  const { runs } = useAppStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ActivitySquare className="w-8 h-8 text-primary" />
          Sequencing Runs
          <Badge variant="outline" className="ml-2 text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Live ENA Metadata]</Badge>
        </h1>
        <div className="flex justify-between items-center mt-1">
          <p className="text-muted-foreground text-sm">
            Active and historical sequencing pipelines.
          </p>
          <Link href="/runs/compare" className="text-sm bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2">
            <ActivitySquare className="w-4 h-4" />
            Compare Runs
          </Link>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle className="text-lg">Run Directory</CardTitle>
          <CardDescription>All sequenced workflows indexed across the distributed cluster.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Run ID</th>
                  <th className="px-4 py-3 font-medium">Platform</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Assigned Node</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-4 py-3 font-mono font-medium text-foreground">{run.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{run.platform}</td>
                    <td className="px-4 py-3">
                      <Badge variant={run.status === "Completed" ? "outline" : "default"} className={
                        run.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        run.status === "Sequencing" || run.status === "Processing" ? "bg-primary/20 text-primary border-primary/20" : ""
                      }>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 w-48">
                      <div className="flex items-center gap-2">
                        <Progress value={run.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{Math.floor(run.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                      {run.assignedNodeId || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground" suppressHydrationWarning>
                      {format(new Date(run.startTime), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/runs/${run.id}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
