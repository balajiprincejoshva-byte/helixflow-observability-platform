import { SequencingRun, Sample, QCMetrics, PipelineStage, StorageMetrics } from "@/types";

export interface ENARunResponse {
  run_accession: string;
  instrument_model: string;
  library_layout: string;
  read_count: string;
  base_count: string;
  fastq_bytes: string;
  first_created: string;
  scientific_name?: string;
  collection_date?: string;
}

const generatePipelineStages = (): PipelineStage[] => {
  return [
    { id: "s1", name: "Demultiplexing", tool: "bcl2fastq / bcl-convert", description: "Converts raw base call (BCL) files into FASTQ reads.", status: "Completed", progress: 100, durationSeconds: 3600, dependencies: [] },
    { id: "s2", name: "Quality Control", tool: "FastQC", description: "Analyzes sequence quality, GC content, and duplication levels.", status: "Completed", progress: 100, durationSeconds: 1200, dependencies: ["s1"] },
    { id: "s3", name: "Read Trimming", tool: "Trimmomatic / fastp", description: "Removes adapters and low-quality bases from sequence ends.", status: "Completed", progress: 100, durationSeconds: 2400, dependencies: ["s2"] },
    { id: "s4", name: "Alignment", tool: "BWA-MEM", description: "Maps sequencing reads to the reference genome for downstream variant analysis.", status: "Running", progress: 45, durationSeconds: 14400, dependencies: ["s3"] },
    { id: "s5", name: "Variant Calling", tool: "GATK HaplotypeCaller", description: "Identifies SNPs and indels against the reference sequence.", status: "Pending", progress: 0, dependencies: ["s4"] },
    { id: "s6", name: "Annotation", tool: "VEP / SnpEff", description: "Associates detected variants with genomic and functional context.", status: "Pending", progress: 0, dependencies: ["s5"] },
  ];
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return (Math.abs(hash) / 2147483647);
};

let cachedEnaData: ENARunResponse[] | null = null;
let lastCacheTime = 0;

export const fetchENARuns = async (): Promise<{ runs: SequencingRun[], samples: Sample[], metrics: Record<string, QCMetrics>, storage: StorageMetrics }> => {
  try {
    const now = Date.now();
    let data: ENARunResponse[] = [];
    
    // 5 minute session cache
    if (cachedEnaData && now - lastCacheTime < 300000) {
      data = cachedEnaData;
    } else {
      const url = "https://www.ebi.ac.uk/ena/portal/api/search?result=read_run&query=tax_eq(9606)&fields=run_accession,instrument_model,library_layout,read_count,base_count,fastq_bytes,first_created,scientific_name,collection_date&format=json&limit=15";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch ENA runs");
      data = await res.json();
      cachedEnaData = data;
      lastCacheTime = now;
    }

    const runs: SequencingRun[] = [];
    const samples: Sample[] = [];
    const metrics: Record<string, QCMetrics> = {};
    let totalFastqBytes = 0;

    const nodeIds = ["node-align-01", "node-align-02", "node-gpu-01", "node-gpu-02"];

    data.forEach((enaRun, index) => {
      const baseCount = parseInt(enaRun.base_count || "0", 10);
      // const readCount = parseInt(enaRun.read_count || "0", 10);
      const bytes = parseInt(enaRun.fastq_bytes || "0", 10);
      totalFastqBytes += bytes;
      
      const estimatedYieldGb = baseCount / 1_000_000_000;
      const meanCoverage = estimatedYieldGb / 3.2; // 3.2Gb human genome size

      // Status generation
      let status: SequencingRun["status"] = "Completed";
      let progress = 100;
      let stages: PipelineStage[] = generatePipelineStages().map(s => ({ ...s, status: "Completed" as const, progress: 100 }));
      
      if (index === 0) {
        status = "Processing";
        progress = 68;
        stages = generatePipelineStages();
      } else if (index === 1) {
        status = "Processing";
        progress = 85;
        stages = generatePipelineStages().map(s => {
          if (s.name === "Alignment") return { ...s, status: "Completed", progress: 100 };
          if (s.name === "Variant Calling") return { ...s, status: "Running", progress: 30 };
          return s;
        });
      } else if (index === 2) {
        status = "Sequencing";
        progress = 42;
        stages = generatePipelineStages().map(s => ({ ...s, status: "Pending", progress: 0 }));
      }

      runs.push({
        id: enaRun.run_accession,
        machineId: enaRun.instrument_model || "Unknown Platform",
        platform: enaRun.instrument_model || "Unknown Platform",
        operator: "Public SRA (ENA)",
        status,
        progress,
        startTime: enaRun.first_created || new Date().toISOString(),
        totalSamples: 1, // SRA runs are typically single sample
        pipelineStages: stages,
        health: {
          score: 95 - (index % 5),
          category: "Stable",
          confidence: 94,
          metrics: { duplicationPenalty: 2, contaminationPenalty: 0, gcBiasPenalty: 3, nodeStabilityPenalty: 0 }
        },
        assignedNodeId: nodeIds[index % nodeIds.length]
      });

      samples.push({
        id: `SMP-${enaRun.run_accession}`,
        runId: enaRun.run_accession,
        organism: enaRun.scientific_name || "Homo sapiens",
        assayType: enaRun.library_layout === "PAIRED" ? "WGS" : "RNA-Seq",
        collectionDate: enaRun.collection_date || enaRun.first_created || new Date().toISOString(),
        status: status === "Completed" ? "QC_Passed" : (status === "Sequencing" ? "Waiting" : "Processing"),
        tags: ["Live SRA Data"]
      });

      // Biologically plausible QC math using deterministic hash
      const variance = Math.max(meanCoverage, 1);
      const h1 = hashString(enaRun.run_accession + "1");
      const h2 = hashString(enaRun.run_accession + "2");
      const h3 = hashString(enaRun.run_accession + "3");
      const h4 = hashString(enaRun.run_accession + "4");
      const h5 = hashString(enaRun.run_accession + "5");

      metrics[enaRun.run_accession] = {
        runId: enaRun.run_accession,
        q30Percentage: 92 + h1 * 6, // Tight cluster 92-98%
        meanQualityScore: 34 + h2 * 4, // Realistic Phred 34-38
        gcBiasExpected: 42.0,
        gcBiasObserved: 41 + h3 * 4, // Homo Sapiens 41-45%
        duplicationRate: 8 + h4 * 12, // Varies by complexity
        alignmentRate: 96 + h5 * 3.5,
        meanCoverage: meanCoverage > 0 ? meanCoverage : 30 + hashString(enaRun.run_accession + "cov") * 10,
        contaminationScore: hashString(enaRun.run_accession + "cont") * 0.02,
        estimatedYieldGb: estimatedYieldGb > 0 ? estimatedYieldGb : 90 + hashString(enaRun.run_accession + "yield") * 30,
        qualityOverCycle: Array.from({ length: 150 }, (_, i) => ({ cycle: i + 1, score: 36 - (i > 100 ? hashString(enaRun.run_accession + i) * 4 : hashString(enaRun.run_accession + "q" + i) * 1.5) })),
        // Poisson/Normal approximation for coverage distribution
        coverageDistribution: Array.from({ length: 50 }, (_, i) => {
          const depth = i * 2;
          // const noise = hashString(enaRun.run_accession + "dist" + i);
          const count = Math.floor((100000 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-Math.pow(depth - (meanCoverage > 0 ? meanCoverage : 30), 2) / (2 * variance)));
          return { depth, count };
        }),
      };
    });

    const fastqTb = totalFastqBytes / 1_000_000_000_000;
    const bamTb = fastqTb * 0.4; // Realistic BAM compression 35-45% of FASTQ
    const bclTb = fastqTb * 1.5; // Raw BCLs are larger
    const otherTb = fastqTb * 0.2;
    const totalUsed = fastqTb + bamTb + bclTb + otherTb;
    
    // Deterministic transfer rate
    const tr = hashString("global_transfer_rate");

    const storage: StorageMetrics = {
      totalCapacityTb: 500,
      usedCapacityTb: totalUsed > 0 ? totalUsed : 342.5,
      transferRateGbps: 4.2 + tr * 2,
      distribution: [
        { type: "BAM", sizeTb: bamTb > 0 ? bamTb : 180.2 },
        { type: "FASTQ", sizeTb: fastqTb > 0 ? fastqTb : 110.5 },
        { type: "BCL", sizeTb: bclTb > 0 ? bclTb : 40.8 },
        { type: "Other", sizeTb: otherTb > 0 ? otherTb : 11.0 }
      ]
    };

    return { runs, samples, metrics, storage };
  } catch (error) {
    console.error("Error fetching live ENA runs:", error);
    return { runs: [], samples: [], metrics: {}, storage: { totalCapacityTb: 500, usedCapacityTb: 0, transferRateGbps: 0, distribution: [] } };
  }
};
