"use client";

import { useAppStore } from "@/store/useAppStore";
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from "react";
import { useTheme } from "next-themes";

export function TopologyMap() {
  const { nodes, runs } = useAppStore();
  const { theme } = useTheme();

  const { initialNodes, initialEdges } = useMemo(() => {
    const rfNodes: Node[] = [];
    const rfEdges: Edge[] = [];

    // Central orchestrator
    rfNodes.push({
      id: "orchestrator",
      position: { x: 400, y: 50 },
      data: { label: "Pipeline Orchestrator" },
      style: { background: "#09090b", color: "#fff", border: "1px solid #333", borderRadius: "8px", width: 180, padding: 12, fontWeight: "bold", textAlign: "center" }
    });

    // Sequencing Nodes (from runs)
    const seqNodes = Array.from(new Set(runs.map(r => r.machineId)));
    seqNodes.forEach((machineId, i) => {
      rfNodes.push({
        id: `seq-${machineId}`,
        position: { x: 150 + (i * 220), y: 150 },
        data: { label: `Sequencer: ${machineId}` },
        style: { background: "#18181b", color: "#fff", border: "1px solid #8a2be2", borderRadius: "8px", padding: 10, textAlign: "center" }
      });
      rfEdges.push({
        id: `e-seq-${machineId}`,
        source: "orchestrator",
        target: `seq-${machineId}`,
        animated: true,
        style: { stroke: '#8a2be2', opacity: 0.5 }
      });
    });

    // Compute Nodes
    nodes.forEach((node, i) => {
      const isDegraded = node.status === "Degraded";
      rfNodes.push({
        id: `comp-${node.id}`,
        position: { x: 50 + (i * 220), y: 300 },
        data: { label: `${node.name}\n${node.cpuUsage.toFixed(0)}% CPU` },
        style: { 
          background: isDegraded ? "#450a0a" : "#18181b", 
          color: isDegraded ? "#fca5a5" : "#fff", 
          border: `1px solid ${isDegraded ? "#ef4444" : "#00ffff"}`, 
          borderRadius: "8px", 
          padding: 10,
          textAlign: "center",
          boxShadow: isDegraded ? "0 0 15px rgba(239,68,68,0.3)" : "0 0 10px rgba(0,255,255,0.1)"
        }
      });

      // Connect runs to assigned nodes
      runs.forEach(run => {
        if (run.assignedNodeId === node.id && run.machineId) {
          rfEdges.push({
            id: `e-run-${run.id}-${node.id}`,
            source: `seq-${run.machineId}`,
            target: `comp-${node.id}`,
            animated: run.status !== "Completed",
            style: { stroke: isDegraded ? "#ef4444" : "#00ffff", strokeWidth: 2, opacity: 0.8 }
          });
        }
      });
    });

    return { initialNodes: rfNodes, initialEdges: rfEdges };
  }, [nodes, runs]);

  return (
    <div style={{ width: '100%', height: '450px' }} className="border border-border/50 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md">
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges} 
        fitView 
        attributionPosition="bottom-right"
        colorMode={theme === 'dark' ? 'dark' : 'light'}
      >
        <Background color="#333" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
