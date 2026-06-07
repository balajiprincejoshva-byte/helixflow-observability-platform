// Domain-Driven Types

export type RunStatus = "Pending" | "Sequencing" | "Processing" | "Completed" | "Failed";
export type PipelineStageStatus = "Pending" | "Running" | "Completed" | "Failed";
export type AlertSeverity = "Info" | "Warning" | "Critical";
export type HealthCategory = "Stable" | "Monitoring" | "Critical";
export type AIConfidenceLevel = "High" | "Medium" | "Low";

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStageStatus;
  progress: number;
  durationSeconds?: number;
  dependencies: string[];
  tool?: string;
  description?: string;
}

export interface RunHealth {
  score: number; // 0-100
  category: HealthCategory;
  confidence: number; // 0-100
  metrics: {
    duplicationPenalty: number;
    contaminationPenalty: number;
    gcBiasPenalty: number;
    nodeStabilityPenalty: number;
  }
}

export interface SequencingRun {
  id: string;
  machineId: string;
  platform: string;
  operator: string;
  status: RunStatus;
  progress: number;
  startTime: string;
  estimatedCompletionTime?: string;
  totalSamples: number;
  pipelineStages: PipelineStage[];
  health: RunHealth;
  assignedNodeId?: string; // Used by simulation engine
}

export interface QCMetrics {
  runId: string;
  q30Percentage: number;
  meanQualityScore: number;
  gcBiasExpected: number;
  gcBiasObserved: number;
  duplicationRate: number;
  alignmentRate: number;
  meanCoverage: number;
  contaminationScore: number;
  estimatedYieldGb: number;
  qualityOverCycle: { cycle: number; score: number }[];
  coverageDistribution: { depth: number; count: number }[];
}

export interface Sample {
  id: string;
  runId: string;
  organism: string;
  assayType: string;
  collectionDate: string;
  status: "Waiting" | "Processing" | "QC_Passed" | "QC_Failed";
  tags: string[];
}

export interface ComputeNode {
  id: string;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  status: "Healthy" | "Degraded" | "Offline";
  temperature: number;
  uptime: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  source: "QC" | "Pipeline" | "Infrastructure" | "System";
  timestamp: string;
  isRead: boolean;
  runId?: string;
}

export interface LiveEvent {
  id: string;
  message: string;
  timestamp: string;
  severity: "Normal" | "Highlight" | "Warning" | "Error";
}

export interface OperationalInsight {
  id: string;
  title: string;
  observation: string; // The observed anomaly
  rootCause: string; // The inferred reason
  affectedSystems: string[];
  confidence: AIConfidenceLevel;
  recommendedAction: string;
  relatedRunId?: string;
  timestamp: string;
}

export interface SystemTelemetry {
  eventsPerSecond: number;
  apiLatencyMs: number;
  queueDepth: number;
  syncHealth: number; // 0-100 percentage
  history: {
    time: string;
    eventsPerSecond: number;
    apiLatencyMs: number;
    queueDepth: number;
  }[];
}

export interface StorageMetrics {
  totalCapacityTb: number;
  usedCapacityTb: number;
  transferRateGbps: number;
  distribution: {
    type: "BAM" | "FASTQ" | "BCL" | "Other";
    sizeTb: number;
  }[];
}
