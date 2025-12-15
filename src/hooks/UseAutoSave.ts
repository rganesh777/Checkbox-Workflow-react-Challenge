import { useEffect, useRef } from 'react';
import { Edge, Node } from '@xyflow/react';
import { SaveWorkFlow } from '@/utils/SaveWorkFlow';
import { ValidationError } from '@/components/WorkflowEditor.types';
import { SaveStatus } from '@/components/status/Status.types';

/**
 * useAutoSave - Automatically saves workflow state to localStorage with debouncing
 * Debounce delay: 2000ms to prevent excessive writes
 * @param nodes - Array of workflow nodes
 * @param edges - Array of workflow edges
 * @param validationErrors - Array of validation errors
 */
export const useAutoSave = (
  nodes: Node[],
  edges: Edge[],
  validationErrors: ValidationError[],
  setIsSaving: React.Dispatch<React.SetStateAction<SaveStatus>>
): void => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounced timer
    debounceTimerRef.current = setTimeout(() => {
      if (validationErrors.length === 0) {
        SaveWorkFlow(nodes, edges, setIsSaving);
      }
    }, 2000);

    // Cleanup timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [nodes, edges, validationErrors]);
};
