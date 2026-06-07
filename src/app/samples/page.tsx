"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TestTubeDiagonal, Search } from "lucide-react";
import { format } from "date-fns";

export default function SamplesPage() {
  const { samples } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSamples = samples.filter(sample => 
    sample.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.runId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.organism.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TestTubeDiagonal className="w-8 h-8 text-primary" />
          Sample Explorer
          <Badge variant="outline" className="ml-2 text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Live ENA Metadata]</Badge>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Laboratory Information Management System (LIMS) Sample Index.
        </p>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Biosample Registry</CardTitle>
            <CardDescription>Search across {samples.length} registered samples.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search by ID, Run, Organism..." 
              className="pl-8 bg-background/50 border-border/50 text-xs h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Sample ID</th>
                  <th className="px-4 py-3 font-medium">Run ID</th>
                  <th className="px-4 py-3 font-medium">Organism</th>
                  <th className="px-4 py-3 font-medium">Assay Type</th>
                  <th className="px-4 py-3 font-medium">Collection Date</th>
                  <th className="px-4 py-3 font-medium">Tags</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSamples.slice(0, 50).map((sample) => (
                  <tr key={sample.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-foreground">{sample.id}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-primary">{sample.runId}</td>
                    <td className="px-4 py-3 text-muted-foreground italic">{sample.organism}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sample.assayType}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground" suppressHydrationWarning>
                      {format(new Date(sample.collectionDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {sample.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] py-0 bg-background/50">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        sample.status === "QC_Passed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        sample.status === "QC_Failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                        "bg-muted/50 text-muted-foreground"
                      }>
                        {sample.status.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSamples.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No samples match your search criteria.
              </div>
            )}
            {filteredSamples.length > 50 && (
              <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/50 bg-muted/20">
                Showing top 50 results. Refine your search to see more.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
