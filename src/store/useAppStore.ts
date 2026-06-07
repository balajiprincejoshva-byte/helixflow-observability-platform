import { create } from 'zustand';
import { SequencingRun, Sample, QCMetrics, ComputeNode, Alert, OperationalInsight, SystemTelemetry, StorageMetrics, LiveEvent } from "@/types";
import { generateComputeNodes } from "@/lib/mock-data/generators";
import { fetchENARuns } from "@/lib/api/ena";
import { APP_CONFIG } from '@/config/constants';

interface AppState {
  runs: SequencingRun[];
  metrics: Record<string, QCMetrics>;
  nodes: ComputeNode[];
  alerts: Alert[];
  operationalInsights: OperationalInsight[];
  events: LiveEvent[];
  telemetry: SystemTelemetry;
  samples: Sample[];
  storage: StorageMetrics;
  isSimulating: boolean;
  eventBuffer: number; // Used for eventsPerSecond calculation
  isCommandCenterMode: boolean;
  isHydrating: boolean;
  tickCount: number;
  
  // Actions
  toggleSimulation: () => void;
  markAlertRead: (id: string) => void;
  simulateTick: () => void;
  dispatch: (message: string, severity: "Normal" | "Highlight" | "Warning" | "Error") => void;
  injectIncident: (nodeId: string) => void;
  toggleCommandCenter: () => void;
  hydrateLiveData: () => Promise<void>;
}

let idCounter = 0;
const generateId = () => `id-${Date.now().toString(36)}-${idCounter++}`;

export const useAppStore = create<AppState>((set) => {
  return {
    runs: [],
    metrics: {},
    nodes: generateComputeNodes(),
    alerts: [],
    operationalInsights: [],
    events: [],
    telemetry: {
      eventsPerSecond: 12.4,
      apiLatencyMs: 42,
      queueDepth: 0,
      syncHealth: 99.99,
      history: [],
    },
    samples: [],
    storage: { 
      totalCapacityTb: 500, 
      usedCapacityTb: 342.5, 
      transferRateGbps: 4.2, 
      distribution: [
        { type: "BAM", sizeTb: 180.2 },
        { type: "FASTQ", sizeTb: 110.5 },
        { type: "BCL", sizeTb: 40.8 },
        { type: "Other", sizeTb: 11.0 }
      ] 
    },
    isSimulating: true,
    eventBuffer: 0,
    isCommandCenterMode: false,
    isHydrating: false,
    tickCount: 0,

    hydrateLiveData: async () => {
      set({ isHydrating: true });
      const { runs, samples, metrics, storage } = await fetchENARuns();
      if (runs.length > 0) {
        set({ runs, samples, metrics, storage, isHydrating: false });
      } else {
        set({ isHydrating: false });
      }
    },

    toggleCommandCenter: () => set((state) => {
      if (typeof window !== 'undefined') {
        if (!state.isCommandCenterMode) {
          document.documentElement.requestFullscreen().catch(e => console.log(e));
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(e => console.log(e));
          }
        }
      }
      return { isCommandCenterMode: !state.isCommandCenterMode };
    }),

    toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),
    
    markAlertRead: (id) => set((state) => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
    })),

    dispatch: (message, severity) => set((state) => {
      const newEvent: LiveEvent = { id: generateId(), message, timestamp: new Date().toISOString(), severity };
      return { 
        events: [newEvent, ...state.events].slice(0, APP_CONFIG.maxEventsHistory),
        eventBuffer: state.eventBuffer + 1
      };
    }),

    injectIncident: (nodeId) => set((state) => {
      // Cause an immediate massive queue spike when incident injected
      const newTelemetry = { 
        ...state.telemetry, 
        queueDepth: state.telemetry.queueDepth + 500,
        apiLatencyMs: state.telemetry.apiLatencyMs + 200
      };
      return {
        telemetry: newTelemetry,
        nodes: state.nodes.map(n => n.id === nodeId ? { ...n, cpuUsage: 100, temperature: 95, status: "Degraded" } : n)
      };
    }),

    simulateTick: () => set((state) => {
      if (!state.isSimulating) return state;

      const currentTick = state.tickCount + 1;
      const newEvents = [...state.events];
      let eventBufferCount = state.eventBuffer;
      const internalDispatch = (msg: string, sev: "Normal" | "Highlight" | "Warning" | "Error") => {
        newEvents.unshift({ id: generateId(), message: msg, timestamp: new Date().toISOString(), severity: sev });
        eventBufferCount++;
      };

      // 1. Calculate Demand
      // Find how many runs are hitting a specific node
      const nodeDemand: Record<string, number> = {};
      state.nodes.forEach(n => nodeDemand[n.id] = 0);

      state.runs.forEach(run => {
        if (!run.assignedNodeId) return;
        const activeStage = run.pipelineStages.find(s => s.status === "Running");
        if (activeStage && ["Alignment", "Variant Calling", "Demultiplexing", "Read Trimming"].includes(activeStage.name)) {
          let scaling = 1;
          // Scale demand based on known high-throughput instruments
          if (run.platform.includes("NovaSeq") || run.platform.includes("PromethION") || run.platform.includes("NextSeq")) scaling = 2.0;
          nodeDemand[run.assignedNodeId] += 30 * scaling;
        } else if (activeStage) {
          nodeDemand[run.assignedNodeId] += 8; // light stages
        }
      });

      // 2. Compute Infrastructure Load
      let globalQueueDepth = 0;
      let maxLatency = 40;

      const newNodes = state.nodes.map((node, index) => {
        const noise = Math.sin((currentTick + index * 5) / 10) * 5;
        const targetCpu = Math.min(100, Math.max(0, (nodeDemand[node.id] || 0) + 10 + noise)); // base 10% + demand + organic noise
        
        // Move towards target smoothly
        const newCpu = node.cpuUsage + (targetCpu - node.cpuUsage) * 0.2;
        const newTemp = 50 + (newCpu * 0.4); // Temp scales with CPU
        let status = node.status;

        // Throttling physics
        if (newCpu > 90) {
          globalQueueDepth += (newCpu - 90) * 15; // Queue builds exponentially past 90%
          maxLatency = Math.max(maxLatency, 40 + (newCpu - 90) * 20);
          if (currentTick % 6 === 0) {
            internalDispatch(`Node ${node.name} experiencing thermal throttling (${newTemp.toFixed(1)}°C)`, "Warning");
          }
        }

        if (newTemp > 85 && status === "Healthy") {
          status = "Degraded";
          internalDispatch(`Node ${node.name} marked Degraded due to sustained temperature.`, "Error");
        } else if (newTemp < 75 && status === "Degraded") {
          status = "Healthy";
          internalDispatch(`Node ${node.name} recovered to Healthy status.`, "Highlight");
        }

        return { ...node, cpuUsage: newCpu, temperature: newTemp, status };
      });

      // 3. Pipeline Backpressure
      // Compute global backpressure multiplier (1.0 = normal, < 1.0 = slowed)
      const backpressureMultiplier = Math.max(0.1, 1.0 - (maxLatency / 1000));

      const newRuns = state.runs.map(run => {
        if (run.status === "Completed" || run.status === "Failed") return run;

        // Apply specific node throttling if assigned
        let runMultiplier = backpressureMultiplier;
        if (run.assignedNodeId) {
          const assignedNode = newNodes.find(n => n.id === run.assignedNodeId);
          if (assignedNode && assignedNode.cpuUsage > 85) {
            runMultiplier *= 0.5; // Half speed if node is struggling
          }
        }

        const newStages = run.pipelineStages.map((stage, stageIdx) => {
          if (stage.status === "Running") {
            const organicSpeed = (Math.sin((currentTick + stageIdx) / 5) * 0.5 + 1.0);
            const progressSpeed = organicSpeed * runMultiplier;
            const newProgress = Math.min(100, stage.progress + progressSpeed);
            
            if (newProgress === 100 && stage.progress < 100) {
              internalDispatch(`Run ${run.id} finished ${stage.name} stage.`, "Highlight");
            }
            return {
              ...stage,
              progress: newProgress,
              status: newProgress === 100 ? "Completed" as const : "Running" as const
            };
          }
          return stage;
        });

        // Resolve dependencies
        for (let i = 0; i < newStages.length; i++) {
          if (newStages[i].status === "Pending") {
            const depsMet = newStages[i].dependencies.every(
              depId => newStages.find(s => s.id === depId)?.status === "Completed"
            );
            if (depsMet) {
              newStages[i].status = "Running";
              internalDispatch(`Run ${run.id} entered ${newStages[i].name} stage.`, "Normal");
            }
          }
        }

        const totalProgress = newStages.reduce((acc, stage) => acc + stage.progress, 0) / newStages.length;
        
        // Update health dynamically based on multiplier
        const newHealth = { ...run.health };
        if (runMultiplier < 0.5) {
          newHealth.metrics.nodeStabilityPenalty = Math.min(30, newHealth.metrics.nodeStabilityPenalty + 1);
          newHealth.score = Math.max(0, 100 - Object.values(newHealth.metrics).reduce((a,b)=>a+b,0));
          if (newHealth.score < 60) newHealth.category = "Critical";
          else if (newHealth.score < 80) newHealth.category = "Monitoring";
          else newHealth.category = "Stable";
        } else if (newHealth.metrics.nodeStabilityPenalty > 0) {
          newHealth.metrics.nodeStabilityPenalty = Math.max(0, newHealth.metrics.nodeStabilityPenalty - 0.5);
          newHealth.score = Math.max(0, 100 - Object.values(newHealth.metrics).reduce((a,b)=>a+b,0));
          if (newHealth.score < 60) newHealth.category = "Critical";
          else if (newHealth.score < 80) newHealth.category = "Monitoring";
          else newHealth.category = "Stable";
        }

        return {
          ...run,
          pipelineStages: newStages,
          progress: totalProgress,
          health: newHealth,
          status: totalProgress === 100 ? "Completed" as const : run.status
        };
      });

      // 4. Dynamic AI Heuristics
      const newOperationalInsights = [...state.operationalInsights];
      const overloadedNode = newNodes.find(n => n.cpuUsage > 95 && n.status === "Degraded");
      
      if (overloadedNode && globalQueueDepth > 100) {
        const existingInsight = newOperationalInsights.find(oi => oi.affectedSystems.includes(overloadedNode.id));
        if (!existingInsight) {
          const insightId = generateId();
          const heavyRuns = state.runs.filter(r => r.assignedNodeId === overloadedNode.id && ["Processing", "Sequencing"].includes(r.status));
          const heavyPlatforms = [...new Set(heavyRuns.map(r => r.platform))].join(" and ");

          newOperationalInsights.unshift({
            id: insightId,
            title: `Severe Compute Bottleneck on ${overloadedNode.name}`,
            observation: `Queue depth reached ${Math.floor(globalQueueDepth)} requests following sustained >95% CPU load on ${overloadedNode.name}.`,
            rootCause: `Alignment latency increased due to elevated read volume from active ${heavyPlatforms || "sequencing"} payloads exceeding standard queue throughput thresholds. Thermal throttling engaged, reducing pipeline throughput.`,
            affectedSystems: [overloadedNode.id, "Pipeline Orchestrator"],
            confidence: "High",
            recommendedAction: `Drain ${overloadedNode.name} and engage auto-scaling group immediately.`,
            timestamp: new Date().toISOString()
          });
          internalDispatch(`AI Engine detected severe bottleneck on ${overloadedNode.name}`, "Error");
        }
      }

      // Cleanup resolved insights
      const activeInsights = newOperationalInsights.filter(insight => {
        // If the node recovered, clear the insight after some time
        const sysId = insight.affectedSystems[0];
        const node = newNodes.find(n => n.id === sysId);
        if (node && node.status === "Healthy" && node.cpuUsage < 70) {
          internalDispatch(`AI Engine resolved insight: ${insight.title}`, "Highlight");
          return false;
        }
        return true;
      });

      // 5. Telemetry Generation
      const currentEps = eventBufferCount / (APP_CONFIG.refreshIntervalMs / 1000);
      
      const newEps = state.telemetry.eventsPerSecond + (currentEps - state.telemetry.eventsPerSecond) * 0.3;
      const newLatency = Math.max(5, maxLatency + Math.sin(currentTick / 3) * 5);
      
      const newHistoryItem = {
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
        eventsPerSecond: newEps,
        apiLatencyMs: newLatency,
        queueDepth: globalQueueDepth
      };

      const newHistory = [...(state.telemetry.history || []), newHistoryItem].slice(-20);

      // Simulating realistic metric fluctuations
      const newTelemetry: SystemTelemetry = {
        eventsPerSecond: newEps,
        apiLatencyMs: newLatency,
        queueDepth: globalQueueDepth,
        syncHealth: globalQueueDepth > 500 ? 98.4 : (globalQueueDepth > 100 ? 99.2 : 99.99),
        history: newHistory
      };

      return {
        nodes: newNodes,
        runs: newRuns,
        events: newEvents.slice(0, APP_CONFIG.maxEventsHistory),
        eventBuffer: 0, // Reset buffer for next tick
        telemetry: newTelemetry,
        operationalInsights: activeInsights,
        tickCount: currentTick
      };
    })
  };
});
