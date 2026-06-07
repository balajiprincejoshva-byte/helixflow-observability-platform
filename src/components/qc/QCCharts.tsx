"use client";

import { QCMetrics } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExplainTooltip } from "@/components/ui/ExplainTooltip";

export function QCCharts({ metrics }: { metrics: QCMetrics }) {
  if (!metrics) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Quality Over Cycle Chart */}
      <Card className="bg-card/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Mean Quality Score by Cycle</CardTitle>
          <CardDescription>Phred scores across 150 sequencing cycles</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.qualityOverCycle} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 190)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(0.7 0.15 190)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.02 260)" vertical={false} />
              <XAxis dataKey="cycle" stroke="oklch(0.708 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 40]} stroke="oklch(0.708 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'oklch(0.18 0.02 260)', borderColor: 'oklch(0.26 0.02 260)', borderRadius: '8px' }}
                itemStyle={{ color: 'oklch(0.985 0 0)' }}
              />
              <Area type="monotone" dataKey="score" stroke="oklch(0.7 0.15 190)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Coverage Distribution Chart */}
      <Card className="bg-card/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Coverage Distribution</CardTitle>
          <CardDescription>Frequency of read depth across genome</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.coverageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.02 260)" vertical={false} />
              <XAxis dataKey="depth" stroke="oklch(0.708 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.708 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'oklch(0.18 0.02 260)', borderColor: 'oklch(0.26 0.02 260)', borderRadius: '8px' }}
                cursor={{ fill: 'oklch(0.22 0.02 260)' }}
              />
              <Bar dataKey="count" fill="oklch(0.6 0.18 280)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Summary Metrics */}
      <Card className="md:col-span-2 bg-card/50 backdrop-blur-md border-secondary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <ExplainTooltip title="% > Q30" content="Deterministically seeded by hashing the ENA run_accession.\n\nSimulates typical high-throughput quality metrics where the majority of bases have a 99.9% accuracy rate.">
                <p className="text-sm text-muted-foreground">%&gt;Q30</p>
              </ExplainTooltip>
              <p className="text-2xl font-bold">{metrics.q30Percentage.toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <ExplainTooltip title="Alignment Rate" content="Calculated by seeding the ENA run accession.\n\nModels realistic alignment success (typically >95%) against the GRCh38 reference genome.">
                <p className="text-sm text-muted-foreground">Alignment Rate</p>
              </ExplainTooltip>
              <p className="text-2xl font-bold text-primary">{metrics.alignmentRate.toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <ExplainTooltip title="GC Bias" content="Ratio of observed GC content versus expected. Used to flag library prep amplification biases.">
                <p className="text-sm text-muted-foreground">GC Bias (Obs/Exp)</p>
              </ExplainTooltip>
              <p className="text-2xl font-bold">{metrics.gcBiasObserved.toFixed(1)} / {metrics.gcBiasExpected.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <ExplainTooltip title="Duplication Rate" content="PCR duplication frequency. Values >20% trigger AI operational warnings regarding library complexity.">
                <p className="text-sm text-muted-foreground">Duplication Rate</p>
              </ExplainTooltip>
              <p className={`text-2xl font-bold ${metrics.duplicationRate > 20 ? 'text-destructive' : ''}`}>{metrics.duplicationRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
