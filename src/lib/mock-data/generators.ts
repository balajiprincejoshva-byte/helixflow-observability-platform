import { subHours, subMinutes, subDays } from "date-fns";
import { Alert, OperationalInsight, ComputeNode, PipelineStage, QCMetrics, Sample, SequencingRun, RunHealth, LiveEvent, SystemTelemetry, StorageMetrics } from "@/types";

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

export const generatePipelineStages = (): PipelineStage[] => {
  return [
    { id: "s1", name: "Demultiplexing", tool: "bcl2fastq / bcl-convert", description: "Converts raw base call (BCL) files into FASTQ reads.", status: "Completed", progress: 100, durationSeconds: 3600, dependencies: [] },
    { id: "s2", name: "Quality Control", tool: "FastQC", description: "Analyzes sequence quality, GC content, and duplication levels.", status: "Completed", progress: 100, durationSeconds: 14400, dependencies: ["s1"] },
    { id: "s3", name: "Read Trimming", tool: "Trimmomatic / fastp", description: "Removes adapters and low-quality bases from sequence ends.", status: "Running", progress: 68, durationSeconds: 86400, dependencies: ["s2"] },
    { id: "s4", name: "Alignment", tool: "BWA-MEM", description: "Maps sequencing reads to the reference genome for downstream variant analysis.", status: "Pending", progress: 0, dependencies: ["s3"] },
    { id: "s5", name: "Variant Calling", tool: "GATK HaplotypeCaller", description: "Identifies SNPs and indels against the reference sequence.", status: "Pending", progress: 0, dependencies: ["s4"] },
    { id: "s6", name: "Annotation", tool: "VEP / SnpEff", description: "Associates detected variants with genomic and functional context.", status: "Pending", progress: 0, dependencies: ["s5"] },
  ];
};

export const generateRunHealth = (id: string): RunHealth => {
  if (id === "HX-204") {
    return {
      score: 72,
      category: "Monitoring",
      confidence: 88,
      metrics: { duplicationPenalty: 15, contaminationPenalty: 0, gcBiasPenalty: 8, nodeStabilityPenalty: 5 }
    };
  }
  return {
    score: 95,
    category: "Stable",
    confidence: 94,
    metrics: { duplicationPenalty: 2, contaminationPenalty: 0, gcBiasPenalty: 3, nodeStabilityPenalty: 0 }
  };
};

export const generateSequencingRuns = (): SequencingRun[] => {
  const now = new Date();
  return [
    {
      id: "HX-204",
      machineId: "NSQ-Alpha",
      platform: "NovaSeq X Plus",
      operator: "Dr. E. Chen",
      status: "Sequencing",
      progress: 68,
      startTime: subHours(now, 14).toISOString(),
      totalSamples: 384,
      pipelineStages: generatePipelineStages(),
      health: generateRunHealth("HX-204"),
      assignedNodeId: "node-align-01"
    },
    {
      id: "HX-203",
      machineId: "NSQ-Beta",
      platform: "NovaSeq X Plus",
      operator: "J. Smith",
      status: "Processing",
      progress: 85,
      startTime: subHours(now, 26).toISOString(),
      totalSamples: 192,
      pipelineStages: generatePipelineStages().map(s => ({
        ...s,
        status: s.name === "Alignment" ? "Running" : (["Demultiplexing", "Quality Control", "Read Trimming"].includes(s.name) ? "Completed" : "Pending"),
        progress: s.name === "Alignment" ? 45 : (["Demultiplexing", "Quality Control", "Read Trimming"].includes(s.name) ? 100 : 0)
      })),
      health: generateRunHealth("HX-203"),
      assignedNodeId: "node-align-02"
    },
    {
      id: "MSEQ-88",
      machineId: "MSQ-01",
      platform: "MiSeq",
      operator: "A. Patel",
      status: "Completed",
      progress: 100,
      startTime: subHours(now, 48).toISOString(),
      totalSamples: 96,
      pipelineStages: generatePipelineStages().map(s => ({ ...s, status: "Completed", progress: 100 })),
      health: generateRunHealth("MSEQ-88")
    }
  ];
};

export const generateQCMetrics = (runId: string): QCMetrics => {
  const qualityOverCycle = Array.from({ length: 150 }, (_, i) => ({
    cycle: i + 1,
    score: 35 - (i > 100 ? Math.random() * 5 : Math.random() * 2),
  }));

  const coverageDistribution = Array.from({ length: 50 }, (_, i) => ({
    depth: i * 2,
    count: Math.floor(Math.exp(-Math.pow(i - 20, 2) / 50) * 1000 + Math.random() * 50),
  }));

  return {
    runId,
    q30Percentage: runId === "HX-204" ? 88.2 : 94.4,
    meanQualityScore: runId === "HX-204" ? 31.2 : 36.5,
    gcBiasExpected: 45.0,
    gcBiasObserved: runId === "HX-204" ? 52.1 : 46.2,
    duplicationRate: runId === "HX-204" ? 18.5 : 12.1,
    alignmentRate: 98.1,
    meanCoverage: 41.5,
    contaminationScore: 0.02,
    estimatedYieldGb: runId === "HX-204" ? 120.5 : 95.2,
    qualityOverCycle,
    coverageDistribution,
  };
};

export const generateComputeNodes = (): ComputeNode[] => {
  return [
    { id: "node-align-01", name: "Alignment Cluster 1", cpuUsage: 88, memoryUsage: 76, gpuUsage: 0, status: "Healthy", temperature: 62, uptime: 1205000 },
    { id: "node-align-02", name: "Alignment Cluster 2", cpuUsage: 92, memoryUsage: 81, gpuUsage: 0, status: "Healthy", temperature: 65, uptime: 1205000 },
    { id: "node-gpu-01", name: "Basecall GPU Node 1", cpuUsage: 45, memoryUsage: 60, gpuUsage: 98, status: "Healthy", temperature: 78, uptime: 450000 },
    { id: "node-gpu-02", name: "Basecall GPU Node 2", cpuUsage: 12, memoryUsage: 25, gpuUsage: 15, status: "Degraded", temperature: 85, uptime: 450000 },
  ];
};

export const generateAlerts = (): Alert[] => {
  const now = new Date();
  return [
    { id: "alt-1", severity: "Warning", message: "Node node-gpu-02 operating at high temperature (85°C).", source: "Infrastructure", timestamp: subMinutes(now, 12).toISOString(), isRead: false },
    { id: "alt-2", severity: "Info", message: "Run MSEQ-88 completed successfully.", source: "Pipeline", timestamp: subHours(now, 2).toISOString(), isRead: true },
    { id: "alt-3", severity: "Critical", message: "GC Bias anomaly detected in Run HX-204 (Lane 3).", source: "QC", timestamp: subMinutes(now, 45).toISOString(), isRead: false, runId: "HX-204" },
  ];
};

export const generateOperationalInsights = (): OperationalInsight[] => {
  const now = new Date();
  return [
    { 
      id: "rc-1", 
      title: "Elevated Duplication Rate Origin", 
      observation: "Run HX-204 shows 18.5% duplication rate, 4% above assay baseline.",
      rootCause: "Correlated with unstable Pipeline Node latency during peak throughput window (node-align-02). Process retry loops artificially inflating rate.",
      affectedSystems: ["HX-204", "node-align-02", "Variant Caller"],
      confidence: "High",
      recommendedAction: "Isolate node-align-02 and re-balance queue to node-align-01. Review state synchronization logs.",
      relatedRunId: "HX-204", 
      timestamp: subMinutes(now, 50).toISOString() 
    },
    { 
      id: "rc-2", 
      title: "GPU Node Degredation", 
      observation: "node-gpu-02 operating at 85°C with reduced throughput.",
      rootCause: "Cooling system localized failure on Rack 3. GPU thermal throttling engaged, reducing Workflow Stage speed by 60%.",
      affectedSystems: ["Basecalling Pipeline", "node-gpu-02"],
      confidence: "High",
      recommendedAction: "Drain node-gpu-02 immediately. Dispatched hardware alert to local facility team.",
      timestamp: subHours(now, 3).toISOString() 
    }
  ];
};

export const generateSystemTelemetry = (): SystemTelemetry => {
  return {
    eventsPerSecond: 24.5,
    apiLatencyMs: 142,
    queueDepth: 840,
    syncHealth: 99.99,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
      eventsPerSecond: 20 + Math.random() * 5,
      apiLatencyMs: 130 + Math.random() * 20,
      queueDepth: 800 + Math.random() * 50
    }))
  };
};

export const generateSamples = (): Sample[] => {
  const samples: Sample[] = [];
  const organisms = ["Homo sapiens", "Mus musculus", "E. coli", "SARS-CoV-2", "Drosophila"];
  const assays = ["WGS", "WES", "RNA-Seq", "ChIP-Seq", "scRNA-Seq"];
  const runs = ["HX-204", "HX-203", "MSEQ-88", "Pending-1", "Pending-2"];
  const statuses = ["Waiting", "Processing", "QC_Passed", "QC_Failed"] as const;

  for (let i = 0; i < 150; i++) {
    samples.push({
      id: generateId("SMP"),
      runId: runs[Math.floor(Math.random() * runs.length)],
      organism: organisms[Math.floor(Math.random() * organisms.length)],
      assayType: assays[Math.floor(Math.random() * assays.length)],
      collectionDate: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      tags: Math.random() > 0.8 ? ["Clinical", "Urgent"] : ["Research"]
    });
  }
  return samples;
};

export const generateStorageMetrics = (): StorageMetrics => {
  return {
    totalCapacityTb: 500,
    usedCapacityTb: 342.5,
    transferRateGbps: 4.2,
    distribution: [
      { type: "BAM", sizeTb: 180.2 },
      { type: "FASTQ", sizeTb: 110.5 },
      { type: "BCL", sizeTb: 40.8 },
      { type: "Other", sizeTb: 11.0 }
    ]
  };
};

export const generateLiveEvents = (): LiveEvent[] => {
  const now = new Date();
  return [
    { id: generateId("evt"), message: "Alignment cluster node latency normalized.", timestamp: subMinutes(now, 1).toISOString(), severity: "Normal" },
    { id: generateId("evt"), message: "Run HX-203 Variant Calling stage reached 45%.", timestamp: subMinutes(now, 3).toISOString(), severity: "Highlight" },
    { id: generateId("evt"), message: "QC degradation detected in Batch-18.", timestamp: subMinutes(now, 15).toISOString(), severity: "Warning" }
  ];
};
