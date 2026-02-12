"use client";

import { LoadingView, ErrorView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useState, useCallback } from "react";
import { nodeComponents } from "@/config/node-components";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSetAtom } from "jotai";
import { AddNodeButton } from "../add-node-button";
import { editorAtom } from "../store/atom";



const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

export const EditorLoading = () => <LoadingView message="Loading editor..." />;
export const EditorError = () => <ErrorView message="Failed to load editor." />;

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor=useSetAtom(editorAtom);
  
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        snapGrid={[10,10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectNodesOnDrag
      >
        <Background
          variant={BackgroundVariant.Dots} color="pink"
        />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};