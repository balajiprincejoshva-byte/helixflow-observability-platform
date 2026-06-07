"use client";

import { Sample } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SampleTable({ samples = [] }: { samples?: Sample[] }) {
  if (!samples || samples.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card/50 backdrop-blur-md p-8 text-center text-muted-foreground">
        <p className="text-sm">No samples found. Waiting for telemetry hydration...</p>
      </div>
    );
  }

  const displaySamples = samples;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "QC_Passed": return <Badge variant="default" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">QC Passed</Badge>;
      case "QC_Failed": return <Badge variant="destructive">QC Failed</Badge>;
      case "Processing": return <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30">Processing</Badge>;
      default: return <Badge variant="outline">Waiting</Badge>;
    }
  };

  return (
    <div className="rounded-md border border-border bg-card/50 backdrop-blur-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-mono">Sample ID</TableHead>
            <TableHead>Organism</TableHead>
            <TableHead>Assay</TableHead>
            <TableHead>Collection Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displaySamples.map((sample) => (
            <TableRow key={sample.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-primary font-medium">{sample.id}</TableCell>
              <TableCell className="italic">{sample.organism}</TableCell>
              <TableCell>{sample.assayType}</TableCell>
              <TableCell className="text-muted-foreground">{sample.collectionDate}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {sample.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] py-0">{tag}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">{getStatusBadge(sample.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
