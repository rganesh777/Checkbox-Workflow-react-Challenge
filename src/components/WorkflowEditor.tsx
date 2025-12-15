import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Box, Card, Flex, Callout } from '@radix-ui/themes';
import { AlertCircle } from 'lucide-react';

import { StartNode } from './nodes/StartNode';
import { FormNode } from './nodes/FormNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { ApiNode } from './nodes/ApiNode';
import { EndNode } from './nodes/EndNode';
import { BlockPanel } from './BlockPanel';

import type { ConditionalNodeData } from './nodes/ConditionalNode';

import { NodeEditor } from './NodeEditor';
import { SaveStatusDialog } from './status/SaveStatusDialog';
import { RestoreDialog } from './status/RestoreDialog';
import { ValidationPanel } from './ValidationPanel';
import { SaveDialog } from './SaveDialog';
import { WorkflowHeader } from './Workflow/WorkflowHeader';
import { WorkflowMiniMap } from './Workflow/WorkflowMiniMap';

import { useAutoSave } from '@/hooks/UseAutoSave';
import { SaveWorkFlow } from '@/utils/SaveWorkFlow';
import { validateWorkflow } from '@/utils/Validation';
import { getBlockConfig } from '@/utils/OtherFns';
import type { SaveStatus } from '@/components/status/Status.types';
import type { WorkflowNodeData, ValidationError, workflowState } from './WorkflowEditor.types';

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  conditional: ConditionalNode,
  api: ApiNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

/**
 * WorkflowEditor - Main component for building and editing workflows
 * Provides a visual canvas for creating workflows with nodes and connections
 */
export const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState<SaveStatus>('idle');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Load saved workflow from localStorage
  const savedWorkflow = JSON.parse(
    localStorage.getItem('workflow-autosave') || 'null'
  ) as workflowState;

  // Memoized validation to avoid recalculating on every render
  // Only recalculates when nodes or edges actually change
  const validationResult = useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Debounced validation state update to prevent excessive re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValidationErrors(validationResult);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [validationResult]);

  useAutoSave(nodes, edges, validationErrors, setIsSaving);

  useEffect(() => {
    if (savedWorkflow?.nodes && savedWorkflow?.edges) {
      setShowRestoreDialog(true);
      const savedNodeIds: string[] = [];
      savedWorkflow?.nodes.forEach((node: Node) => savedNodeIds.push(node.id.split('_')[1]));
      nodeId = Math.max(...savedNodeIds.map((id) => parseInt(id, 10))) + 1;
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      // Get the source node to check if it's a conditional node
      const sourceNode = nodes.find((n) => n.id === params.source);

      let label = '';
      if (sourceNode?.type === 'conditional' && params.sourceHandle) {
        const conditionalData = sourceNode.data as unknown as ConditionalNodeData;
        // Find the route label for this handle
        const route = conditionalData.routes?.find((r) => r.id === params.sourceHandle);
        label = route?.label || params.sourceHandle || '';
      }

      setEdges((eds) => addEdge({ ...params, label }, eds));
    },
    [setEdges, nodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // Don't open editor for start and end nodes
    if (node.type === 'start' || node.type === 'end') {
      return;
    }
    setSelectedNode(node);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

  const closeEditor = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  // Keyboard shortcuts for deleting selected node
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selectedNode &&
        // prevent node from deleting when focused on input or textarea
        (event.target as HTMLElement).localName !== 'input' &&
        (event.target as HTMLElement).localName !== 'textarea'
      ) {
        // Prevent default behavior (like navigating back) when deleting
        event.preventDefault();
        deleteNode(selectedNode.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteNode]);

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const config = getBlockConfig(blockType);

      // Get viewport center position
      let position = { x: 100, y: 100 }; // Default fallback

      if (reactFlowInstance.current) {
        const viewport = reactFlowInstance.current.getViewport();
        const zoom = viewport.zoom;
        const canvasCenter = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };

        // Convert screen coordinates to flow coordinates
        position = reactFlowInstance.current.screenToFlowPosition({
          x: canvasCenter.x,
          y: canvasCenter.y,
        });
      }

      const nodeId = getId();
      const newNode: Node = {
        id: nodeId,
        type: blockType,
        position,
        data: {
          ...config,
          onDelete: () => deleteNode(nodeId),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, deleteNode]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleSave = () => {
    SaveWorkFlow(nodes, edges, setIsSaving);
    setShowSaveDialog(true);
  };

  const saveWorkFlowDisabled =
    nodes.length === 0 || edges.length === 0 || validationErrors.length > 0;

  // Restore Workflow from localStorage
  const handleRestoreWorkflow = () => {
    if (savedWorkflow?.nodes && savedWorkflow?.edges) {
      setNodes(savedWorkflow.nodes || []);
      setEdges(savedWorkflow.edges || []);
    }
    setShowRestoreDialog(false);
  };

  const formFields = nodes.flatMap((node) => {
    if (node.type === 'form') {
      const data = node.data as { fields: Array<{ name: string }> };
      return data.fields.map((field) => field.name.trim()).filter((name) => name !== '');
    }
    return [];
  });

  return (
    <Flex minHeight="100vh" direction="column" style={{ width: '100%' }}>
      <WorkflowHeader
        isSaving={isSaving}
        setShowStatusDialog={setShowStatusDialog}
        handleSave={handleSave}
        saveWorkFlowDisabled={saveWorkFlowDisabled}
      />

      {/* Main Content with Panel and Canvas */}
      <Flex flexGrow="1" m="4" mt="2" gap="4">
        {/* Left Panels */}
        <Flex direction="column" gap="4">
          <BlockPanel onAddBlock={handleAddBlock} nodes={nodes} />
          <ValidationPanel errors={validationErrors} />
        </Flex>

        {/* Workflow Canvas */}
        <Box flexGrow="1" style={{ minHeight: '600px' }}>
          <Card style={{ overflow: 'hidden', height: '100%' }}>
            {workflowErrors.length > 0 && (
              <Callout.Root color="red" size="1" mb="2">
                <Callout.Icon>
                  <AlertCircle />
                </Callout.Icon>
                <Callout.Text>Workflow Errors: {workflowErrors.join(', ')}</Callout.Text>
              </Callout.Root>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onInit={onInit}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{
                style: { strokeWidth: 2, stroke: '#94a3b8' },
                type: 'smoothstep',
                animated: false,
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius)',
              }}
            >
              <Controls
                style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />

              <WorkflowMiniMap />

              <Background color="#e2e8f0" gap={20} />
            </ReactFlow>
          </Card>
        </Box>

        {/* Right Panel - Node Editor */}
        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={closeEditor}
            onDelete={deleteNode}
            errors={validationErrors}
            formFields={formFields}
          />
        )}
      </Flex>

      {/* Save Dialog */}
      <SaveDialog showSaveDialog={showSaveDialog} setShowSaveDialog={setShowSaveDialog} />

      {/* Restore Dialog */}
      <RestoreDialog
        showRestoreDialog={showRestoreDialog}
        setShowRestoreDialog={setShowRestoreDialog}
        handleRestoreWorkflow={handleRestoreWorkflow}
      />

      {/* Save Status Dialog */}
      <SaveStatusDialog
        isSaving={isSaving}
        savedWorkflow={savedWorkflow}
        showStatusDialog={showStatusDialog}
        setShowStatusDialog={setShowStatusDialog}
      />
    </Flex>
  );
};
