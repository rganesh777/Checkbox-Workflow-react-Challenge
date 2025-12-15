import type { FormNodeData } from './nodes/FormNode';
import type { ApiNodeData } from './nodes/ApiNode';
import type { ConditionalNodeData } from './nodes/ConditionalNode';
import type { StartNodeData } from './nodes/StartNode';
import type { EndNodeData } from './nodes/EndNode';
import { Edge, Node } from '@xyflow/react';

/**
 * Union type representing all possible node data types
 */
export type WorkflowNodeData =
  | FormNodeData
  | ApiNodeData
  | ConditionalNodeData
  | StartNodeData
  | EndNodeData;

/**
 * Validation error structure
 */
export interface ValidationError {
  id: string;
  type: 'error' | 'info';
  message: string;
  nodeId?: string;
}

/**
 * Props for the ValidationPanel component
 */
export interface ValidationPanelProps {
  errors: ValidationError[];
}

/**
 * workflowState - Structure representing the saved workflow state
 */
export type workflowState = {
  nodes: Node[];
  edges: Edge[];
  metadata: {
    name: string;
    version: string;
    lastSaved: string;
  };
} | null;
