"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function QCPage() {
  const { runs, metrics } = useAppStore();

  // Aggregate Phred scores across runs
  const aggregatedPhredData = runs.map(run => {
    const runMetric = metrics[run.id];
    return {
      name: run.id,
      q30: runMetric?.q30Percentage || 0,
      yield: runMetric?.estimatedYieldGb || 0
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          Global QC Analytics
          <Badge variant="outline" className="ml-2 text-[10px] bg-muted/50 border-border text-muted-foreground uppercase font-mono tracking-wider">[Live ENA Metadata]</Badge>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Aggregate quality control metrics across all distributed sequencing nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Q30 Trend */}
        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle className="text-lg">Q30 Quality Thresholds</CardTitle>
            <CardDescription>Percentage of bases &gt; Q30 across active runs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aggregatedPhredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} domain={[70, 100]} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#00ffff' }}
                  />
                  <Line type="monotone" dataKey="q30" name="Q30 %" stroke="#00ffff" strokeWidth={3} dot={{ r: 4, fill: "#00ffff" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yield Area Chart */}
        <Card className="bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle className="text-lg">Estimated Yield (Gb)</CardTitle>
            <CardDescription>Total genomic data output per active workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aggregatedPhredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="yield" name="Yield (Gb)" stroke="#8a2be2" strokeWidth={2} fillOpacity={1} fill="url(#colorYield)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
