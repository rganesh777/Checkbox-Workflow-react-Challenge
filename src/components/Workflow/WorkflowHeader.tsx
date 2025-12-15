import { Button, Card, Flex, Heading } from '@radix-ui/themes';
import { Save } from 'lucide-react';
import { SaveStatusBadge } from '../status/SaveStatusBadge';
import { SaveStatus } from '@/components/status/Status.types';

type WorkflowHeaderProps = {
  isSaving: SaveStatus;
  setShowStatusDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  saveWorkFlowDisabled: boolean;
};

/** WorkflowHeader - Header component for the workflow editor
 */
export const WorkflowHeader = ({
  isSaving,
  setShowStatusDialog,
  handleSave,
  saveWorkFlowDisabled,
}: WorkflowHeaderProps): JSX.Element => {
  return (
    <Card m="4" mb="0">
      <Flex flexGrow="1" justify="between" align="center">
        <Heading as="h2">Workflow Editor</Heading>

        <Flex flexGrow="1" justify="end" align="center" gap="5">
          <SaveStatusBadge isSaving={isSaving} setShowStatusDialog={setShowStatusDialog} />

          <Button onClick={handleSave} disabled={saveWorkFlowDisabled}>
            <Save size={16} />
            Save Workflow
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
