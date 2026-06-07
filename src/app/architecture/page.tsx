"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, BrainCircuit, Activity, ShieldCheck, ArrowRight, Network } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Systems Architecture & Telemetry</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A distributed systems observability platform modeling high-throughput genomic workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend Architecture */}
        <Card className="bg-card/50 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Frontend Architecture & Rendering
            </CardTitle>
            <CardDescription>Next.js 15 App Router</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Built on React Server Components for initial payload optimization, pushing heavy state updates to strict client boundaries. 
              The rendering pipeline targets 60fps even during simulated event bursts.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-primary" /> React Concurrent Mode rendering</li>
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-primary" /> Framer Motion LayoutGroups for GPU offloading</li>
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-primary" /> Memoized component boundaries</li>
            </ul>
          </CardContent>
        </Card>

        {/* Event-Driven Simulation Engine */}
        <Card className="bg-card/50 backdrop-blur-md border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="w-5 h-5 text-secondary" />
              Event-Driven State Engine
            </CardTitle>
            <CardDescription>Zustand Autonomous Loop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Rather than generic CRUD, the global state runs an autonomous <Badge variant="outline" className="font-mono text-[10px]">simulateTick()</Badge> engine mimicking a distributed event bus (like Apache Kafka). It natively injects throughput spikes, queue congestion, and backpressure logic.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-secondary" /> Synthetic Event Bursts & Rate Limiting</li>
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-secondary" /> Microservice Latency Simulation</li>
              <li className="flex items-center gap-2 text-foreground"><ArrowRight className="w-3 h-3 text-secondary" /> State Propagation Delays</li>
            </ul>
          </CardContent>
        </Card>

        {/* Operational Intelligence */}
        <Card className="bg-card/50 backdrop-blur-md border-yellow-500/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-yellow-500" />
              Operational Intelligence Layer
            </CardTitle>
            <CardDescription>Cross-domain Heuristics Engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              A systems-level reasoning engine that acts similarly to an observability agent (e.g. Datadog Watchdog). It correlates distributed system metrics (GPU thermal throttling, node latency) with operational outcome failures (data duplication rates) to generate deterministic runbook recommendations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          End-to-End System Dataflow
        </h2>
        <div className="bg-card/30 border border-border rounded-xl p-8 backdrop-blur-md overflow-x-auto">
          <div className="min-w-[800px] flex items-center justify-between gap-4">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center relative z-10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground">1. ENA Ingest</p>
                <p className="text-[10px] text-muted-foreground mt-1">Live metadata fetched from European Nucleotide Archive</p>
              </div>
            </div>

            {/* Path 1 */}
            <div className="flex-1 h-px bg-border relative">
              <div className="absolute inset-0 bg-primary/50 h-full origin-left animate-[pulse_4s_ease-in-out_infinite]" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-16 h-16 rounded-full bg-green-500/5 border border-green-500/20 flex items-center justify-center relative z-10">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground">2. Validation</p>
                <p className="text-[10px] text-muted-foreground mt-1">Sanitized and mapped to Strict TS Domain Interfaces</p>
              </div>
            </div>

            {/* Path 2 */}
            <div className="flex-1 h-px bg-border relative">
              <div className="absolute inset-0 bg-green-500/50 h-full origin-left animate-[pulse_4s_ease-in-out_infinite_1s]" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-16 h-16 rounded-full bg-secondary/5 border border-secondary/20 flex items-center justify-center relative z-10">
                <Network className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground">3. Simulation Engine</p>
                <p className="text-[10px] text-muted-foreground mt-1">Deterministic physics loop generates throughput & telemetry</p>
              </div>
            </div>

            {/* Path 3 */}
            <div className="flex-1 h-px bg-border relative">
              <div className="absolute inset-0 bg-secondary/50 h-full origin-left animate-[pulse_4s_ease-in-out_infinite_2s]" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-3 w-40">
              <div className="w-16 h-16 rounded-full bg-yellow-500/5 border border-yellow-500/20 flex items-center justify-center relative z-10">
                <BrainCircuit className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground">4. AI Reasoning</p>
                <p className="text-[10px] text-muted-foreground mt-1">Correlates hardware bottlenecks to pipeline failures</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-12 bg-card/30 border border-border rounded-xl p-8 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server className="w-6 h-6 text-primary" />
          Production Data Orchestration Design
        </h2>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            If connected to a live production cluster, this architecture seamlessly replaces the Zustand mock-engine with live WebSocket subscriptions to an event-streaming backend.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500"/> Data Ingestion Pipeline</h3>
              <p>
                Workflow events emitted by orchestration tools (like Apache Airflow or AWS Step Functions) are pushed to <strong>Apache Kafka</strong>, aggregated by a Node.js/Go middleware, and flushed to the Next.js client via <strong>Socket.io</strong> to power the Live Event Stream without HTTP polling overhead.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500"/> Infrastructure Telemetry</h3>
              <p>
                The System Telemetry panel is designed to directly ingest <strong>PromQL</strong> queries via a GraphQL edge layer, mapping CPU/Memory bottlenecks and queue depths from Prometheus/Grafana directly into the frontend observability dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
