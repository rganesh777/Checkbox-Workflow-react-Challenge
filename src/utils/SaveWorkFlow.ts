import { Edge, Node } from '@xyflow/react';
import { workflowState } from '@/components/WorkflowEditor.types';
import { SaveStatus } from '@/components/status/Status.types';

/**
 * SaveWorkFlow - Saves the current workflow state to localStorage
 * @param nodes - Array of workflow nodes
 * @param edges - Array of workflow edges
 * @param setIsSaving - Function to update saving status
 */
export const SaveWorkFlow = (
  nodes: Node[],
  edges: Edge[],
  setIsSaving: React.Dispatch<React.SetStateAction<SaveStatus>>
): void => {
  setIsSaving('saving');
  const workflowConfig = {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    })),
    metadata: {
      name: 'Sample Workflow',
      version: '1.0.0',
      lastSaved: new Date().toISOString(),
    },
  } as workflowState;

  try {
    localStorage.setItem('workflow-autosave', JSON.stringify(workflowConfig));
  } catch (error) {
    console.error('Error saving workflow to localStorage:', error);
    setIsSaving('error');
    return;
  }

  setTimeout(() => {
    setIsSaving('saved');
  }, 1000);
};
