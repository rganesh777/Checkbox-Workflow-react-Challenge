import type { workflowState } from '@/components/WorkflowEditor.types';

/**
 * SaveStatus - Represents the saving status of the workflow
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * RestoreDialogProps - Props for RestoreDialog component
 */
export type RestoreDialogProps = {
  showRestoreDialog: boolean;
  setShowRestoreDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleRestoreWorkflow: () => void;
};

/**
 * SaveStatusBadgeProps - Props for SaveStatusBadge component
 */
export type SaveStatusBadgeProps = {
  isSaving: SaveStatus;
  setShowStatusDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * SaveStatusDialogProps - Props for SaveStatusDialog component
 */
export type SaveStatusDialogProps = {
  isSaving: SaveStatus;
  savedWorkflow: workflowState;
  showStatusDialog: boolean;
  setShowStatusDialog: React.Dispatch<React.SetStateAction<boolean>>;
};
