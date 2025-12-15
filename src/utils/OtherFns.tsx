import { ConditionalOperator, ConditionalRoute } from '@/components/nodes/ConditionalNode';
import { SaveStatus } from '@/components/status/Status.types';
import { WorkflowNodeData } from '@/components/WorkflowEditor.types';
import { AlertCircle, CheckCircleIcon, Loader, CircleX } from 'lucide-react';

/** getBlockConfig - Returns default configuration for a given block type
 * @param blockType - Type of the workflow block
 * @returns Default configuration object for the block
 */
export const getBlockConfig = (blockType: string): WorkflowNodeData => {
  const configs: Record<string, WorkflowNodeData> = {
    start: {
      label: 'Start',
    },
    form: {
      label: 'Form',
      customName: 'Form',
      fields: [],
    },
    conditional: {
      label: 'Conditional',
      customName: 'Conditional',
      fieldToEvaluate: '',
      operator: 'equals' as ConditionalOperator,
      value: '',
      routes: [
        { id: 'true' as const, label: 'True', condition: '' },
        { id: 'false' as const, label: 'False', condition: '' },
      ] as ConditionalRoute[],
    },
    api: {
      label: 'API Call',
      url: '',
      method: 'GET',
    },
    end: {
      label: 'End',
    },
  };
  return configs[blockType] || { label: blockType };
};

/** getSaveStatusColor - Returns color string based on save status
 * @param isSaving - Current save status
 * @returns Color string
 */
export const getSaveStatusColor = (isSaving: SaveStatus) => {
  switch (isSaving) {
    case 'error':
      return 'red';
    case 'saving':
      return 'blue';
    case 'saved':
      return 'green';
    default:
      return 'gray';
  }
};

/** getSaveStatusIcon - Returns icon component based on save status
 * @param isSaving - Current save status
 * @returns Icon component
 */
export const getSaveStatusIcon = (isSaving: SaveStatus) => {
  switch (isSaving) {
    case 'saved':
      return <CheckCircleIcon data-testid="check-circle-icon" />;
    case 'saving':
      return <Loader data-testid="loader" />;
    case 'idle':
      return <AlertCircle data-testid="alert-circle" />;
    case 'error':
      return <CircleX data-testid="circle-x" />;
    default:
      return null;
  }
};
